import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";

// Fonction d'extraction des métriques avec résilience
async function getMetrics(userId: string) {
  try {
    const clientCount = await db.client.count({ where: { userId } });
    const factureCount = await db.facture.count({ where: { userId } });
    const sumResult = await db.facture.aggregate({
      _sum: { amount: true },
      where: { userId },
    });
    const totalAmount = sumResult._sum.amount ?? 0;

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
      latestFactures,
      dbStatus: "connected" as const,
    };
  } catch (error) {
    console.warn("Connexion BDD inactive, utilisation de données simulées :", error);
    // Données de secours pour la démo initiale
    return {
      clientCount: 4,
      factureCount: 8,
      totalAmount: 14200.00,
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

  const { clientCount, factureCount, totalAmount, latestFactures, dbStatus } =
    await getMetrics(user?.id || "");

  return (
    <div className="space-y-8">
      {/* Message de bienvenue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Ravi de vous revoir, {user?.name || "Freelance"} 👋
          </h1>
          <p className="text-zinc-400 mt-1">
            Voici l'aperçu de votre activité avec MySelfPro pour ce mois-ci.
          </p>
        </div>

        {dbStatus === "mocked" && (
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg flex items-center gap-2 self-start md:self-auto">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Mode démo (PostgreSQL non connecté dans .env)
          </div>
        )}
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chiffre d'Affaires */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl">
          <div className="flex justify-between items-center text-zinc-400 text-sm font-medium">
            <span>Chiffre d'Affaires</span>
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalAmount)}
            </span>
          </div>
        </div>

        {/* Clients Actifs */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl">
          <div className="flex justify-between items-center text-zinc-400 text-sm font-medium">
            <span>Clients</span>
            <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{clientCount}</span>
            <span className="text-zinc-500 text-sm ml-2">clients enregistrés</span>
          </div>
        </div>

        {/* Factures émise */}
        <div className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl">
          <div className="flex justify-between items-center text-zinc-400 text-sm font-medium">
            <span>Factures</span>
            <svg className="h-5 w-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white">{factureCount}</span>
            <span className="text-zinc-500 text-sm ml-2">factures au total</span>
          </div>
        </div>
      </div>

      {/* Section des factures récentes */}
      <div className="p-6 bg-zinc-950/20 border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Factures récentes</h3>
          <Link
            href="/dashboard/factures"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Voir toutes les factures →
          </Link>
        </div>

        {latestFactures.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            Aucune facture enregistrée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-semibold uppercase">
                  <th className="py-3 px-4">Numéro</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-sm">
                {latestFactures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-indigo-400">{facture.number}</td>
                    <td className="py-4 px-4 text-white font-medium">{facture.client.name}</td>
                    <td className="py-4 px-4 text-zinc-400">
                      {new Date(facture.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 px-4 text-white font-semibold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        facture.amount
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          facture.status === "PAYE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : facture.status === "ENVOYE"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        }`}
                      >
                        {facture.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
