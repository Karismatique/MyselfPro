"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

// Schéma de validation strict avec Zod (Sécurisation Backend)
const clientSchema = z.object({
  name: z.string().trim().min(1, "Veuillez renseigner le nom du client."),
  email: z.string().trim().email("Veuillez entrer une adresse email valide."),
  address: z.string().trim().optional(),
});

export type ClientFormState = {
  success?: boolean;
  message?: string;
  error?: string;
} | null;

export async function createClient(
  prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validationResult = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address"),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { name, email, address } = validationResult.data;

  try {
    await db.client.create({
      data: { name, email, address: address || null, userId },
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");

    return { success: true, message: "Le client a été créé avec succès." };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "client-management" } });
    return { success: false, error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}

export async function updateClient(
  clientId: string,
  prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const validationResult = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address"),
  });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { name, email, address } = validationResult.data;

  try {
    const { count } = await db.client.updateMany({
      where: { id: clientId, userId },
      data: { name, email, address: address || null },
    });

    if (count === 0) {
      return { error: "Client introuvable." };
    }

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");

    return { success: true, message: "Le client a été mis à jour avec succès." };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "client-management" } });
    return { success: false, error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}

export type DeleteClientState = { error?: string } | null;

export async function deleteClient(
  clientId: string,
  prevState: DeleteClientState,
  formData: FormData
): Promise<DeleteClientState> {
  void formData;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  const client = await db.client.findFirst({
    where: { id: clientId, userId },
    include: { _count: { select: { factures: true } } },
  });

  if (!client) {
    return { error: "Client introuvable." };
  }

  if (client._count.factures > 0) {
    return { error: "Impossible de supprimer un client ayant des factures associées." };
  }

  try {
    await db.client.delete({ where: { id: clientId } });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard");

    return null;
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "client-management" } });
    return { error: "Une erreur technique est survenue. L'équipe a été notifiée." };
  }
}
