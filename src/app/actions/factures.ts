"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

// Statuts métier autorisés pour une facture (alignés sur l'enum Prisma FactureStatus)
const FACTURE_STATUSES = ["BROUILLON", "ENVOYE", "PAYE", "PAIE_RETARD"] as const;

// Schémas de validation stricts avec Zod (Sécurisation Backend)
const createFactureSchema = z.object({
  clientId: z.string().trim().min(1, "Veuillez sélectionner un client."),
  amount: z.coerce
    .number()
    .gt(0, "Le montant de la facture doit être un nombre positif supérieur à zéro."),
  status: z.enum(FACTURE_STATUSES),
});

const updateFactureSchema = z.object({
  amount: z.coerce
    .number()
    .gt(0, "Le montant de la facture doit être un nombre positif supérieur à zéro."),
  status: z.enum(FACTURE_STATUSES),
});

export type FactureFormState = {
  success?: boolean;
  message?: string;
  error?: string;
} | null;

export async function createFacture(
  prevState: FactureFormState,
  formData: FormData
): Promise<FactureFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validationResult = createFactureSchema.safeParse({
    clientId: formData.get("clientId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { clientId, amount, status } = validationResult.data;

  try {
    // Vérification que le client sélectionné appartient bien à l'utilisateur connecté
    const client = await db.client.findFirst({ where: { id: clientId, userId } });

    if (!client) {
      return { error: "Client introuvable." };
    }

    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `FAC-${formattedDate}-${randomSuffix}`;

    await db.facture.create({
      data: {
        number: invoiceNumber,
        amount,
        status,
        userId,
        clientId,
      },
    });

    revalidatePath("/dashboard/factures");
    revalidatePath("/dashboard");

    return { success: true, message: "La facture a été créée avec succès." };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "invoice-management" } });
    return { success: false, error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}

export async function updateFacture(
  factureId: string,
  prevState: FactureFormState,
  formData: FormData
): Promise<FactureFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validationResult = updateFactureSchema.safeParse({
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { amount, status } = validationResult.data;

  try {
    const { count } = await db.facture.updateMany({
      where: { id: factureId, userId },
      data: { amount, status },
    });

    if (count === 0) {
      return { error: "Facture introuvable." };
    }

    revalidatePath("/dashboard/factures");
    revalidatePath("/dashboard");

    return { success: true, message: "La facture a été mise à jour avec succès." };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "invoice-management" } });
    return { success: false, error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}

export type DeleteFactureState = { error?: string } | null;

export async function deleteFacture(
  factureId: string,
  prevState: DeleteFactureState,
  formData: FormData
): Promise<DeleteFactureState> {
  void formData;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  try {
    const { count } = await db.facture.deleteMany({ where: { id: factureId, userId } });

    if (count === 0) {
      return { error: "Facture introuvable." };
    }

    revalidatePath("/dashboard/factures");
    revalidatePath("/dashboard");

    return null;
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "invoice-management" } });
    return { error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}
