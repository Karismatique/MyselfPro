import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@/auth";
import { db as realDb } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { createClient, updateClient, deleteClient } from "./clients";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: {
    client: {
      create: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

// Cast pour contourner le typage strict de PrismaClient : à l'exécution ces
// méthodes sont bien les vi.fn() définies par vi.mock ci-dessus.
const db = realDb as unknown as {
  client: {
    create: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
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

describe("createClient", () => {
  it("refuse la création si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await createClient(null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.client.create).not.toHaveBeenCalled();
  });

  it("rejette un email invalide via la validation Zod", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await createClient(
      null,
      buildFormData({ name: "Acme", email: "pas-un-email", address: "" })
    );

    expect(result?.error).toBe("Veuillez entrer une adresse email valide.");
    expect(db.client.create).not.toHaveBeenCalled();
  });

  it("rejette un nom vide via la validation Zod", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);

    const result = await createClient(
      null,
      buildFormData({ name: "   ", email: "a@acme.com", address: "" })
    );

    expect(result?.error).toBe("Veuillez renseigner le nom du client.");
    expect(db.client.create).not.toHaveBeenCalled();
  });

  it("crée le client avec une adresse null quand le champ est vide", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.create.mockResolvedValue({});

    const result = await createClient(
      null,
      buildFormData({ name: "Acme", email: "a@acme.com", address: "" })
    );

    expect(result).toEqual({ success: true, message: "Le client a été créé avec succès." });
    expect(db.client.create).toHaveBeenCalledWith({
      data: { name: "Acme", email: "a@acme.com", address: null, userId: "user-1" },
    });
  });

  it("retourne une erreur générique et notifie Sentry si la création échoue", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.create.mockRejectedValue(new Error("DB down"));

    const result = await createClient(null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({
      success: false,
      error: "Une erreur technique est survenue. L'équipe a été notifiée.",
    });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});

describe("updateClient", () => {
  it("refuse la mise à jour si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await updateClient("client-1", null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.client.updateMany).not.toHaveBeenCalled();
  });

  it("retourne 'Client introuvable.' si le client n'appartient pas à l'utilisateur", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.updateMany.mockResolvedValue({ count: 0 });

    const result = await updateClient("client-1", null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({ error: "Client introuvable." });
    expect(db.client.updateMany).toHaveBeenCalledWith({
      where: { id: "client-1", userId: "user-1" },
      data: { name: "Acme", email: "a@acme.com", address: null },
    });
  });

  it("met à jour le client avec succès", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateClient("client-1", null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({ success: true, message: "Le client a été mis à jour avec succès." });
  });

  it("retourne une erreur générique et notifie Sentry si la mise à jour échoue", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.updateMany.mockRejectedValue(new Error("DB down"));

    const result = await updateClient("client-1", null, buildFormData({ name: "Acme", email: "a@acme.com", address: "" }));

    expect(result).toEqual({
      success: false,
      error: "Une erreur technique est survenue. L'équipe a été notifiée.",
    });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});

describe("deleteClient", () => {
  it("refuse la suppression si l'utilisateur n'est pas authentifié", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await deleteClient("client-1", null, new FormData());

    expect(result).toEqual({ error: "Vous devez être connecté pour effectuer cette action." });
    expect(db.client.findFirst).not.toHaveBeenCalled();
  });

  it("retourne 'Client introuvable.' si le client n'existe pas ou n'appartient pas à l'utilisateur", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue(null);

    const result = await deleteClient("client-1", null, new FormData());

    expect(result).toEqual({ error: "Client introuvable." });
    expect(db.client.delete).not.toHaveBeenCalled();
  });

  it("bloque la suppression d'un client ayant des factures associées", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue({ id: "client-1", _count: { factures: 2 } });

    const result = await deleteClient("client-1", null, new FormData());

    expect(result).toEqual({ error: "Impossible de supprimer un client ayant des factures associées." });
    expect(db.client.delete).not.toHaveBeenCalled();
  });

  it("supprime le client si aucune facture n'y est associée", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue({ id: "client-1", _count: { factures: 0 } });
    db.client.delete.mockResolvedValue({});

    const result = await deleteClient("client-1", null, new FormData());

    expect(result).toBeNull();
    expect(db.client.delete).toHaveBeenCalledWith({ where: { id: "client-1" } });
  });

  it("retourne une erreur et notifie Sentry si la suppression échoue en base", async () => {
    mockedAuth.mockResolvedValue(AUTHENTICATED_SESSION);
    db.client.findFirst.mockResolvedValue({ id: "client-1", _count: { factures: 0 } });
    db.client.delete.mockRejectedValue(new Error("DB down"));

    const result = await deleteClient("client-1", null, new FormData());

    expect(result).toEqual({ error: "Une erreur technique est survenue. L'équipe a été notifiée." });
    expect(Sentry.captureException).toHaveBeenCalled();
  });
});
