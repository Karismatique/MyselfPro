import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import ClientForm from "./client-form";
import DeleteClientButton from "./delete-client-button";
import { createClient } from "@/app/actions/clients";

export const metadata = {
  title: "Clients - MySelfPro",
};

export default async function ClientsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const clients = userId
    ? await db.client.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { factures: true } } },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Gestion des Clients</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Retrouvez la liste et ajoutez de nouveaux clients pour vos factures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Tableau des clients */}
        <section
          aria-labelledby="clients-list-title"
          className="lg:col-span-2 p-5 bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 rounded-lg shadow-sm"
        >
          <h2 id="clients-list-title" className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-5">
            {clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}
          </h2>

          {clients.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              Aucun client enregistré pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Consultez la liste de vos clients et gérez leurs informations.
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">
                    <th scope="col" className="py-2.5 px-3">Nom</th>
                    <th scope="col" className="py-2.5 px-3">Email</th>
                    <th scope="col" className="py-2.5 px-3">Adresse</th>
                    <th scope="col" className="py-2.5 px-3">Factures</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">{client.name}</td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{client.email}</td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{client.address || "—"}</td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{client._count.factures}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/dashboard/clients/${client.id}/edit`}
                            className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/40 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                          >
                            Modifier
                            <span className="sr-only"> le client {client.name}</span>
                          </Link>
                          <DeleteClientButton
                            clientId={client.id}
                            clientName={client.name}
                            hasFactures={client._count.factures > 0}
                          />
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
          <ClientForm
            action={createClient}
            title="Nouveau Client"
            submitLabel="Créer le Client"
            pendingLabel="Création en cours..."
          />
        </div>
      </div>
    </div>
  );
}
