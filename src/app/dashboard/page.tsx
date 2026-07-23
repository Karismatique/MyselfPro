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

const euro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

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
      {/* En-tête de bienvenue */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            Tableau de bord
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Bonjour, {user?.name || "Freelance"}
          </h1>
        </div>

        {dbStatus === "mocked" && (
          <div 
            role="status" 
            className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 text-xs rounded-md flex items-center gap-2 self-start md:self-auto"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" aria-hidden="true"></span>
            Mode démo
          </div>
        )}
      </div>

      {/* KPI principaux */}
      <section aria-label="Aperçu financier principal" className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* CA Cumulé */}
        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Chiffre d'Affaires Cumulé
          </h2>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-3 font-mono">
            {euro(totalAmount)}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/40">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reste à vivre : <span className="text-teal-600 dark:text-teal-400 font-semibold">{euro(resteAVivre)}</span>
            </p>
          </div>
        </div>

        {/* URSSAF */}
        <div className="md:col-span-2 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Cotisations URSSAF
          </h2>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-3 font-mono">
            {euro(cotisationsURSSAF)}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/40">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Taux : <span className="text-slate-700 dark:text-slate-200 font-semibold">21,1 %</span> (Services B2B)
            </p>
          </div>
        </div>

        {/* Clients */}
        <div className="md:col-span-1 p-5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm flex flex-col justify-between">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Clients
          </h2>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-50 mt-3 font-mono">
            {clientCount}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-auto pt-3">
            enregistrés
          </p>
        </div>
      </section>

      {/* KPIs secondaires */}
      <section aria-label="Indicateurs financiers secondaires" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="px-4 py-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">CA du mois</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {euro(currentMonthCA)}
            </p>
          </div>
          <div className="h-8 w-8 bg-teal-50 dark:bg-teal-600/15 text-teal-600 dark:text-teal-400 rounded flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="px-4 py-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">TVA collectée (20 %)</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {euro(tvaCollectee)}
            </p>
          </div>
          <div className="h-8 w-8 bg-violet-50 dark:bg-violet-600/15 text-violet-600 dark:text-violet-400 rounded flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
        </div>

        <div className="px-4 py-3 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">En attente</h3>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {euro(pendingAmount)}
            </p>
          </div>
          <div className="h-8 w-8 bg-amber-50 dark:bg-amber-600/15 text-amber-600 dark:text-amber-400 rounded flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Activité récente + Formulaire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tableau des factures récentes */}
        <section aria-labelledby="section-recent-invoices" className="lg:col-span-2 p-5 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 id="section-recent-invoices" className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Activité récente
            </h3>
            <Link
              href="/dashboard/factures"
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
            >
              Tout voir <span className="sr-only">les factures émises</span>→
            </Link>
          </div>

          {latestFactures.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              Aucune facture enregistrée pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Liste des 5 dernières factures créées et leur statut de paiement.
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">
                    <th scope="col" className="py-2.5 px-3">Numéro</th>
                    <th scope="col" className="py-2.5 px-3">Client</th>
                    <th scope="col" className="py-2.5 px-3">Date</th>
                    <th scope="col" className="py-2.5 px-3">Montant</th>
                    <th scope="col" className="py-2.5 px-3">Statut</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
                  {latestFactures.map((facture) => (
                    <tr key={facture.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-3 font-mono text-sm text-teal-600 dark:text-teal-400">{facture.number}</td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">{facture.client.name}</td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {new Date(facture.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-3 text-slate-900 dark:text-slate-100 font-mono font-medium">
                        {euro(facture.amount)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            facture.status === "PAYE"
                              ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40"
                              : facture.status === "ENVOYE"
                              ? "bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700/40"
                              : "bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/40"
                          }`}
                        >
                          {facture.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={`/api/factures/${facture.id}/pdf`}
                          aria-label={`Télécharger le PDF pour la facture ${facture.number}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

        {/* Formulaire de création */}
        <div>
          <CreateInvoiceForm />
        </div>
      </div>
    </div>
  );
}
