import { auth } from "@/auth";

export const metadata = {
  title: "Factures - MySelfPro",
};

export default async function FacturesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Factures</h1>
      <p className="text-zinc-400">
        Créez, gérez et suivez le paiement de vos factures clients.
      </p>
      <div className="p-8 bg-zinc-950/20 border border-zinc-800 rounded-xl text-center text-zinc-500">
        Fonctionnalité de gestion des factures en cours de développement.
      </div>
    </div>
  );
}
