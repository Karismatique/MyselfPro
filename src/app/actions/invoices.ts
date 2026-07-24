"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schéma de validation strict avec Zod (Sécurisation Backend)
const createInvoiceSchema = z.object({
  name: z.string().trim().min(1, "Veuillez renseigner le nom du client."),
  email: z.string().trim().email("Veuillez entrer une adresse email valide."),
  address: z.string().trim().optional(),
  amount: z.coerce
    .number()
    .gt(0, "Le montant de la facture doit être un nombre positif supérieur à zéro."),
});

export async function createClientAndInvoice(prevState: unknown, formData: FormData) {
  // 1. Vérification de la session utilisateur (protection de la route)
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  // 2. Extraction et validation des données via le schéma Zod
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address"),
    amount: formData.get("amount"),
  };

  const validationResult = createInvoiceSchema.safeParse(rawData);

  if (!validationResult.success) {
    // Retourne le premier message d'erreur de schéma rencontré
    return {
      error: validationResult.error.issues[0].message,
    };
  }

  const { name, email, address, amount } = validationResult.data;

  try {
    // 3. Exécution de la transaction Prisma pour créer le Client et sa Facture liée
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `FAC-${formattedDate}-${randomSuffix}`;

    await db.client.create({
      data: {
        name,
        email,
        address: address || null,
        userId,
        factures: {
          create: {
            number: invoiceNumber,
            amount,
            status: "BROUILLON",
            userId,
          },
        },
      },
    });

    // 4. Revalidation de la page du tableau de bord pour rafraîchir les métriques
    revalidatePath("/dashboard");

    return { success: true, message: "Le client et la facture ont été créés avec succès !" };
  } catch (error) {
    console.error("Erreur lors de la création du client/facture:", error);
    return { error: "Une erreur interne est survenue lors de la création. Veuillez réessayer." };
  }
}
