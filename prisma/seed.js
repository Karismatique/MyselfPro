import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Début du seed de la base de données...");

  // 1. Création ou récupération de l'utilisateur de test principal
  const testEmail = "freelance@mesindep.fr";
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      name: "Casis MesIndep",
      email: testEmail,
      password: hashedPassword,
    },
  });

  console.log(`Utilisateur de test disponible : ${user.email} (Mot de passe: Password123!)`);

  // Nettoyage optionnel des anciennes données associées pour éviter les doublons sur répétition
  await prisma.facture.deleteMany({ where: { userId: user.id } });
  await prisma.client.deleteMany({ where: { userId: user.id } });

  // 2. Définition des 10 clients fictifs
  const mockClients = [
    { name: "TechStart Solutions", email: "contact@techstart.com", address: "42 Rue de l'Innovation, 75002 Paris" },
    { name: "InnovDesign Studio", email: "hello@innovdesign.fr", address: "15 Avenue des Arts, 69001 Lyon" },
    { name: "Horizon Cloud", email: "finance@horizoncloud.com", address: "88 Boulevard Digital, 33000 Bordeaux" },
    { name: "Quantum Labs", email: "contact@quantumlabs.de", address: "7 Einstein Strasse, 80331 München" },
    { name: "Apex Marketing", email: "apex@apexmkt.com", address: "102 Place de la Bourse, 44000 Nantes" },
    { name: "Solar Green Energy", email: "billing@solargreen.fr", address: "3 Avenue du Soleil, 34000 Montpellier" },
    { name: "ByteForce Consultants", email: "info@byteforce.io", address: "12 Marina Boulevard, Singapore 018982" },
    { name: "Alpha Construction", email: "alpha@alphaconst.com", address: "55 Rue du Chantier, 59000 Lille" },
    { name: "Zenith Delivery", email: "contact@zenithdeliv.fr", address: "20 Cours Gambetta, 13001 Marseille" },
    { name: "Omega Finance", email: "admin@omegafinance.com", address: "5th Avenue, New York, NY 10001" },
  ];

  // 3. Création des clients et génération des factures associées
  const invoiceData = [
    { num: "FAC-20260701-1001", amount: 1500.00, status: "PAYE", date: new Date("2026-07-01") },
    { num: "FAC-20260705-1002", amount: 2400.00, status: "PAYE", date: new Date("2026-07-05") },
    { num: "FAC-20260710-1003", amount: 4200.00, status: "PAYE", date: new Date("2026-07-10") },
    { num: "FAC-20260712-1004", amount: 850.00,  status: "PAYE", date: new Date("2026-07-12") },
    { num: "FAC-20260715-1005", amount: 3200.00, status: "ENVOYE", date: new Date("2026-07-15") },
    { num: "FAC-20260718-1006", amount: 1250.00, status: "ENVOYE", date: new Date("2026-07-18") },
    { num: "FAC-20260720-1007", amount: 5600.00, status: "ENVOYE", date: new Date("2026-07-20") },
    { num: "FAC-20260721-1008", amount: 450.00,  status: "BROUILLON", date: new Date("2026-07-21") },
    { num: "FAC-20260722-1009", amount: 1900.00, status: "BROUILLON", date: new Date("2026-07-22") },
    { num: "FAC-20260723-1010", amount: 3100.00, status: "PAIE_RETARD", date: new Date("2026-07-23") },
  ];

  for (let i = 0; i < mockClients.length; i++) {
    const clientDef = mockClients[i];
    const invDef = invoiceData[i];

    // Création du client
    const client = await prisma.client.create({
      data: {
        name: clientDef.name,
        email: clientDef.email,
        address: clientDef.address,
        userId: user.id,
      },
    });

    // Création de la facture rattachée au client
    await prisma.facture.create({
      data: {
        number: invDef.num,
        amount: invDef.amount,
        status: invDef.status,
        date: invDef.date,
        userId: user.id,
        clientId: client.id,
      },
    });
  }

  console.log("Seed terminé avec succès ! 10 clients et 10 factures ont été créés.");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
