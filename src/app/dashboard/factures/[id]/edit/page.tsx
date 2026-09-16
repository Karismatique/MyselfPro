import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { updateFacture } from "@/app/actions/factures";
import FactureForm from "../../facture-form";

export const metadata = {
  title: "Modifier une facture - MySelfPro",
};

export default async function EditFacturePage({
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

  const facture = await db.facture.findFirst({
    where: { id, userId },
    include: { client: true },
  });

  if (!facture) {
    notFound();
  }

  const updateFactureWithId = updateFacture.bind(null, facture.id);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Modifier la facture</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Facture {facture.number} — {facture.client.name}
        </p>
      </div>

      <FactureForm
        action={updateFactureWithId}
        title="Informations de la facture"
        submitLabel="Enregistrer les modifications"
        mode="edit"
        defaultValues={{
          clientName: facture.client.name,
          amount: facture.amount,
          status: facture.status,
        }}
        resetOnSuccess={false}
      />
    </div>
  );
}
