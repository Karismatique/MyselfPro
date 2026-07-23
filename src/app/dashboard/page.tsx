import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import CreateInvoiceForm from "./create-invoice-form";

// Fonction d'extraction des métriques avec résilience et nouveaux KPIs
async function getMetrics(userId: string) {
  try {
    const clientCount = await db.client.count({ where: { userId } });
    const factureCount = await db.facture.count({ where: { userId } });
    
    // CA Cumulé
    const sumResult = await db.facture.aggregate({
      _sum: { amount: true },
      where: { userId },
    });
    const totalAmount = sumResult._sum.amount ?? 0;

    // En attente d'encaissement (statut différent de PAYE)
    const pendingResult = await db.facture.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        status: { not: "PAYE" },
      },
    });
    const pendingAmount = pendingResult._sum.amount ?? 0;

    // CA du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthCAResult = await db.facture.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });
    const currentMonthCA = monthCAResult._sum.amount ?? 0;

    const latestFactures = await db.facture.findMany({
      where: { userId },
      take: 5,
      orderBy: { date: "desc" },
      include: { client: true },
    });

    return {
      clientCount,
      factureCount,
      totalAmount,
      pendingAmount,
      currentMonthCA,
      latestFactures,
      dbStatus: "connected" as const,
    };
  } catch (error) {
    console.warn("Connexion BDD inactive, utilisation de données simulées :", error);
    // Données de secours pour la démo initiale
    return {
      clientCount: 10,
      factureCount: 10,
      totalAmount: 24750.00,
      pendingAmount: 11050.00,
      currentMonthCA: 12500.00,
      latestFactures: [
        {
          id: "demo-1",
          number: "F-2026-001",
          amount: 2400.00,
          status: "PAYE",
          date: new Date("2026-07-15"),
          client: { name: "AeroSpace Tech" },
        },
        {
          id: "demo-2",
          number: "F-2026-002",
          amount: 4800.00,
          status: "ENVOYE",
          date: new Date("2026-07-18"),
          client: { name: "Global Logistics" },
        },
        {
          id: "demo-3",
          number: "F-2026-003",
          amount: 1500.00,
          status: "BROUILLON",
          date: new Date("2026-07-20"),
          client: { name: "SaaS Dev Corp" },
        },
      ],
      dbStatus: "mocked" as const,
    };
  }
}

export const metadata = {
  title: "Dashboard - MySelfPro",
};

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const { 
    clientCount, 
    totalAmount, 
    pendingAmount, 
    currentMonthCA, 
    latestFactures, 
    dbStatus 
  } = await getMetrics(user?.id || "");

  // Règle de gestion URSSAF (21.1%) et Reste à vivre
  const cotisationsURSSAF = totalAmount * 0.211;
  const resteAVivre = totalAmount - cotisationsURSSAF;

  // Calcul TVA Collectée (20% du CA total)
  const tvaCollectee = totalAmount * 0.20;

  return (
    <div className="space-y-8">
      {/* Message de bienvenue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Ravi de vous revoir, {user?.name || "Freelance"} 👋
          </h1>
          <p className="text-zinc-300 mt-1">
            Voici l'aperçu de votre activité avec MySelfPro pour ce mois-ci.
          </p>
        </div>

        {dbStatus === "mocked" && (
          <div 
            role="status" 
            className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-lg flex items-center gap-2 self-start md:self-auto"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true"></span>
            Mode démo (PostgreSQL non connecté dans .env)
          </div>
        )}
      </div>

      {/* 1. CARTES PRINCIPALES : Aperçu Financier (RGAA sémantique et contrastes élevés) */}
      <section aria-label="Aperçu financier principal" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chiffre d'Affaires & Reste à vivre */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-zinc-300 text-sm font-semibold">
              <h2>Chiffre d'Affaires Cumulé (H.T.)</h2>
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalAmount)}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/60">
            <p className="text-xs text-zinc-300 font-medium">
              Reste à vivre estimé : <strong className="text-indigo-300 font-semibold">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(resteAVivre)}</strong>
            </p>
          </div>
        </div>

        {/* Cotisations URSSAF Estimées */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-zinc-300 text-sm font-semibold">
              <h2>Cotisations URSSAF Estimées</h2>
              <svg className="h-5 w-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cotisationsURSSAF)}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/60">
            <p className="text-xs text-zinc-300 font-medium">
              Taux appliqué : <strong className="text-zinc-200">21,1%</strong> (Services B2B)
            </p>
          </div>
        </div>

        {/* Clients Actifs */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-zinc-300 text-sm font-semibold">
              <h2>Nombre de Clients</h2>
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white">{clientCount}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/60">
            <p className="text-xs text-zinc-300 font-medium">
              Clients enregistrés uniques
            </p>
          </div>
        </div>
      </section>

      {/* 2. CARTES SECONDAIRES (Nouveaux KPIs demandés : CA Mois, TVA, En Attente) */}
      <section aria-label="Indicateurs financiers secondaires" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* CA Mois en Cours */}
        <div className="p-4 bg-zinc-900 border border-zinc-800/60 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">CA du mois</h3>
            <p className="text-xl font-bold text-white mt-1">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(currentMonthCA)}
            </p>
          </div>
          <div className="h-9 w-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* TVA Collectée */}
        <div className="p-4 bg-zinc-900 border border-zinc-800/60 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">TVA collectée (20%)</h3>
            <p className="text-xl font-bold text-white mt-1">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(tvaCollectee)}
            </p>
          </div>
          <div className="h-9 w-9 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
        </div>

        {/* En attente d'encaissement */}
        <div className="p-4 bg-zinc-900 border border-zinc-800/60 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">En attente d'encaissement</h3>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(pendingAmount)}
            </p>
          </div>
          <div className="h-9 w-9 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Grid Layout pour Activité Récente (Tableau) et Formulaire CRM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Colonne Factures Récentes (2/3 sur grand écran) */}
        <section aria-labelledby="section-recent-invoices" className="lg:col-span-2 p-6 bg-zinc-950/20 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 id="section-recent-invoices" className="text-lg font-bold text-white">Activité Récente</h3>
            <Link
              href="/dashboard/factures"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Voir toutes les factures <span className="sr-only">émises</span> →
            </Link>
          </div>

          {latestFactures.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              Aucune facture enregistrée pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Liste des 5 dernières factures créées et leur statut de paiement.
                </caption>
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-300 text-xs font-bold uppercase">
                    <th scope="col" className="py-3 px-4">Numéro</th>
                    <th scope="col" className="py-3 px-4">Client</th>
                    <th scope="col" className="py-3 px-4">Date</th>
                    <th scope="col" className="py-3 px-4">Montant</th>
                    <th scope="col" className="py-3 px-4">Statut</th>
                    <th scope="col" className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm">
                  {latestFactures.map((facture) => (
                    <tr key={facture.id} className="hover:bg-zinc-800/10 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-indigo-400">{facture.number}</td>
                      <td className="py-4 px-4 text-white font-semibold">{facture.client.name}</td>
                      <td className="py-4 px-4 text-zinc-300">
                        {new Date(facture.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                          facture.amount
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            facture.status === "PAYE"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : facture.status === "ENVOYE"
                              ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                              : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          }`}
                        >
                          {facture.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={`/api/factures/${facture.id}/pdf`}
                          aria-label={`Télécharger le PDF pour la facture ${facture.number}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 border border-zinc-700 text-indigo-400 hover:bg-zinc-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Colonne Formulaire de Création (1/3 sur grand écran) */}
        <div>
          <CreateInvoiceForm />
        </div>
      </div>
    </div>
  );
}
