import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import FactureForm from "./facture-form";
import DeleteFactureButton from "./delete-facture-button";
import { createFacture } from "@/app/actions/factures";

export const metadata = {
  title: "Factures - MySelfPro",
};

const euro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const STATUS_LABELS: Record<string, string> = {
  BROUILLON: "Brouillon",
  ENVOYE: "Envoyée",
  PAYE: "Payée",
  PAIE_RETARD: "Payée en retard",
};

const STATUS_STYLES: Record<string, string> = {
  PAYE: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40",
  ENVOYE: "bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700/40",
  PAIE_RETARD: "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/40",
  BROUILLON: "bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600/40",
};

export default async function FacturesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [factures, clients] = userId
    ? await Promise.all([
        db.facture.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          include: { client: true },
        }),
        db.client.findMany({
          where: { userId },
          orderBy: { name: "asc" },
          select: { id: true, name: true },
        }),
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Gestion des Factures</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Créez, gérez et suivez le paiement de vos factures clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tableau des factures */}
        <section
          aria-labelledby="factures-list-title"
          className="lg:col-span-2 p-5 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm"
        >
          <h2 id="factures-list-title" className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-5">
            {factures.length} facture{factures.length > 1 ? "s" : ""} enregistrée{factures.length > 1 ? "s" : ""}
          </h2>

          {factures.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              Aucune facture enregistrée pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Consultez l&apos;ensemble de vos factures et suivez leur statut de paiement.
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">
                    <th scope="col" className="py-2.5 px-3">Numéro</th>
                    <th scope="col" className="py-2.5 px-3">Client</th>
                    <th scope="col" className="py-2.5 px-3">Date</th>
                    <th scope="col" className="py-2.5 px-3">Montant</th>
                    <th scope="col" className="py-2.5 px-3">Statut</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
                  {factures.map((facture) => (
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
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[facture.status]}`}
                        >
                          {STATUS_LABELS[facture.status]}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`/api/factures/${facture.id}/pdf`}
                            aria-label={`Télécharger le PDF pour la facture ${facture.number}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                          >
                            PDF
                          </a>
                          <Link
                            href={`/dashboard/factures/${facture.id}/edit`}
                            className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                          >
                            Modifier
                            <span className="sr-only"> la facture {facture.number}</span>
                          </Link>
                          <DeleteFactureButton factureId={facture.id} factureNumber={facture.number} />
                        </div>
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
          <FactureForm
            action={createFacture}
            title="Nouvelle Facture"
            submitLabel="Créer la Facture"
            pendingLabel="Création en cours..."
            mode="create"
            clients={clients}
          />
        </div>
      </div>
    </div>
  );
}
