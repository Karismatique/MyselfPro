import { auth } from "@/auth";
import { logout } from "../actions/auth";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* Barre de navigation latérale (Sidebar) */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="px-2">
            <Link href="/dashboard" className="text-2xl font-extrabold tracking-tight text-white block">
              MySelf<span className="text-indigo-400">Pro</span>
            </Link>
            <span className="text-xs text-indigo-400/80 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 mt-1 inline-block">
              MesIndep B2B
            </span>
          </div>

          {/* Liens de navigation */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-zinc-800 text-white hover:bg-zinc-800 transition-colors"
            >
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Tableau de bord
            </Link>

            <Link
              href="/dashboard/clients"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Clients
            </Link>

            <Link
              href="/dashboard/factures"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Factures
            </Link>
          </nav>
        </div>

        {/* Profil de l'utilisateur et bouton Déconnexion */}
        <div className="border-t border-zinc-800 pt-4 space-y-4">
          <div className="flex items-center gap-3 px-2">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Avatar"}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-indigo-500/30"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || "Freelance"}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || ""}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg text-xs font-semibold border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col min-h-screen bg-zinc-900/50">
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/20 px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Espace Freelance</h2>
          <div className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-md border border-zinc-700">
            Freelance ID: <span className="font-mono text-zinc-200">{user?.id || "N/A"}</span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
