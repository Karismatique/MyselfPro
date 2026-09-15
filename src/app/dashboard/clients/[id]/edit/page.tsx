import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateClient } from "@/app/actions/clients";
import ClientForm from "../../client-form";

export const metadata = {
  title: "Modifier un client - MySelfPro",
};

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    notFound();
  }

  const client = await db.client.findFirst({ where: { id, userId } });

  if (!client) {
    notFound();
  }

  const updateClientWithId = updateClient.bind(null, client.id);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Modifier le client</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Mettez à jour les informations de {client.name}.
        </p>
      </div>

      <ClientForm
        action={updateClientWithId}
        title="Informations du client"
        submitLabel="Enregistrer les modifications"
        defaultValues={{ name: client.name, email: client.email, address: client.address }}
        resetOnSuccess={false}
      />
    </div>
  );
}
