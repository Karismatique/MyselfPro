import { auth } from "@/auth";

export const metadata = {
  title: "Clients - MySelfPro",
};

export default async function ClientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Clients</h1>
      <p className="text-zinc-400">
        Retrouvez la liste et ajoutez de nouveaux clients pour vos factures.
      </p>
      <div className="p-8 bg-zinc-950/20 border border-zinc-800 rounded-xl text-center text-zinc-500">
        Fonctionnalité de gestion des clients en cours de développement.
      </div>
    </div>
  );
}
