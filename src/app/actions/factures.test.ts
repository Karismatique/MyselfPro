import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@/auth";
import { db as realDb } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { createFacture, updateFacture, deleteFacture } from "./factures";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: {
    client: {
      findFirst: vi.fn(),
    },
    facture: {
      create: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

// Cast pour contourner le typage strict de PrismaClient : à l'exécution ces
// méthodes sont bien les vi.fn() définies par vi.mock ci-dessus.
const db = realDb as unknown as {
  client: { findFirst: ReturnType<typeof vi.fn> };
  facture: {
    create: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    deleteMany: ReturnType<typeof vi.fn>;
  };
};
// `auth` de NextAuth v5 est fortement surchargé (usage session / middleware),
// ce qui empêche vi.mocked de lui inférer une signature de mock exploitable.
const mockedAuth = vi.mocked(auth) as unknown as {
  mockResolvedValue: (value: { user: { id: string } } | null) => void;
};

const AUTHENTICATED_SESSION = { user: { id: "user-1" } };

function buildFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createFacture", () => {
  it("refuse la création si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "100", status: "BROUILLON" })
    );

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.facture.create).not.toHaveBeenCalled();
  });

  it("rejette un montant négatif ou nul via la validation Zod", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "0", status: "BROUILLON" })
    );

    expect(result?.error).toBe("Le montant de la facture doit être un nombre positif supérieur à zéro.");
    expect(db.facture.create).not.toHaveBeenCalled();
  });

  it("rejette un statut hors de l'énumération autorisée", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "100", status: "STATUT_INCONNU" })
    );

    expect(result?.error).toBeTruthy();
    expect(db.facture.create).not.toHaveBeenCalled();
  });

  it("rejette un clientId absent (aucun client sélectionné)", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await createFacture(
      null,
      buildFormData({ clientId: "", amount: "100", status: "BROUILLON" })
    );

    expect(result?.error).toBe("Veuillez sélectionner un client.");
    expect(db.facture.create).not.toHaveBeenCalled();
  });

  it("refuse la création si le client n'appartient pas à l'utilisateur connecté", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue(null);

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "100", status: "BROUILLON" })
    );

    expect(result).toEqual({ error: "Client introuvable." });
    expect(db.facture.create).not.toHaveBeenCalled();
  });

  it("crée la facture avec un numéro généré et les bonnes données", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue({ id: "client-1", userId: "user-1" });
    db.facture.create.mockResolvedValue({});

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "150.5", status: "ENVOYE" })
    );

    expect(result).toEqual({ success: true, message: "La facture a été créée avec succès." });
    expect(db.facture.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        number: expect.stringMatching(/^FAC-\d{8}-\d{4}$/),
        amount: 150.5,
        status: "ENVOYE",
        userId: "user-1",
        clientId: "client-1",
      }),
    });
  });

  it("retourne une erreur générique et notifie Sentry si la création échoue", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue({ id: "client-1", userId: "user-1" });
    db.facture.create.mockRejectedValue(new Error("DB down"));

    const result = await createFacture(
      null,
      buildFormData({ clientId: "client-1", amount: "100", status: "BROUILLON" })
    );

    expect(result).toEqual({
      success: false,
      error: "Une erreur technique est survenue. L'équipe a été notifiée.",
    });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});

describe("updateFacture", () => {
  it("refuse la mise à jour si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await updateFacture(
      "facture-1",
      null,
      buildFormData({ amount: "100", status: "PAYE" })
    );

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.facture.updateMany).not.toHaveBeenCalled();
  });

  it("rejette un montant invalide", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await updateFacture(
      "facture-1",
      null,
      buildFormData({ amount: "-10", status: "PAYE" })
    );

    expect(result?.error).toBe("Le montant de la facture doit être un nombre positif supérieur à zéro.");
    expect(db.facture.updateMany).not.toHaveBeenCalled();
  });

  it("retourne 'Facture introuvable.' si la facture n'appartient pas à l'utilisateur", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.updateMany.mockResolvedValue({ count: 0 });

    const result = await updateFacture(
      "facture-1",
      null,
      buildFormData({ amount: "100", status: "PAYE" })
    );

    expect(result).toEqual({ error: "Facture introuvable." });
    expect(db.facture.updateMany).toHaveBeenCalledWith({
      where: { id: "facture-1", userId: "user-1" },
      data: { amount: 100, status: "PAYE" },
    });
  });

  it("met à jour la facture avec succès", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateFacture(
      "facture-1",
      null,
      buildFormData({ amount: "200", status: "PAYE" })
    );

    expect(result).toEqual({ success: true, message: "La facture a été mise à jour avec succès." });
  });

  it("retourne une erreur générique et notifie Sentry si la mise à jour échoue", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.updateMany.mockRejectedValue(new Error("DB down"));

    const result = await updateFacture(
      "facture-1",
      null,
      buildFormData({ amount: "100", status: "PAYE" })
    );

    expect(result).toEqual({
      success: false,
      error: "Une erreur technique est survenue. L'équipe a été notifiée.",
    });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});

describe("deleteFacture", () => {
  it("refuse la suppression si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await deleteFacture("facture-1", null, new FormData());

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.facture.deleteMany).not.toHaveBeenCalled();
  });

  it("retourne 'Facture introuvable.' si la facture n'appartient pas à l'utilisateur", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.deleteMany.mockResolvedValue({ count: 0 });

    const result = await deleteFacture("facture-1", null, new FormData());

    expect(result).toEqual({ error: "Facture introuvable." });
    expect(db.facture.deleteMany).toHaveBeenCalledWith({
      where: { id: "facture-1", userId: "user-1" },
    });
  });

  it("supprime la facture avec succès", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.deleteMany.mockResolvedValue({ count: 1 });

    const result = await deleteFacture("facture-1", null, new FormData());

    expect(result).toBeNull();
  });

  it("retourne une erreur et notifie Sentry si la suppression échoue en base", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.facture.deleteMany.mockRejectedValue(new Error("DB down"));

    const result = await deleteFacture("facture-1", null, new FormData());

    expect(result).toEqual({ error: "Une erreur technique est survenue. L'équipe a été notifiée." });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
