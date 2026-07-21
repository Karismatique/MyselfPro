"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createClientAndInvoice(prevState: any, formData: FormData) {
  // 1. Vérification de la session utilisateur
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Vous devez être connecté pour effectuer cette action." };
  }

  // 2. Récupération et validation des données du formulaire
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const amountStr = formData.get("amount")?.toString();

  if (!name || !email || !amountStr) {
    return { error: "Veuillez remplir tous les champs obligatoires (Nom, Email, Montant)." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Le montant de la facture doit être un nombre positif supérieur à zéro." };
  }

  // Validation simple du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Veuillez entrer une adresse email valide." };
  }

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
        address,
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

    // 4. Revalidation de la page du tableau de bord pour rafraîchir les métriques et la liste
    revalidatePath("/dashboard");

    return { success: true, message: "Le client et la facture ont été créés avec succès !" };
  } catch (error) {
    console.error("Erreur lors de la création du client/facture:", error);
    return { error: "Une erreur interne est survenue lors de la création. Veuillez réessayer." };
  }
}
