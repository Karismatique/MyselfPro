import { auth } from "@/auth";
import { logout } from "../actions/auth";
import Link from "next/link";
import Image from "next/image";
import SidebarNav from "./sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Lien d'évitement / Skip link pour l'accessibilité clavier (RGAA 12.8.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:font-semibold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Passer au contenu principal
      </a>

      {/* Barre de navigation latérale (Sidebar) */}
      <aside
        aria-label="Volet latéral de navigation et profil"
        className="w-64 border-l-2 border-l-teal-600 border-r border-r-slate-200 dark:border-r-slate-700/50 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 transition-colors duration-200"
      >
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="px-2">
            <Link
              href="/dashboard"
              className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white block hover:text-teal-600 dark:hover:text-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
            >
              MySelf<span className="text-teal-600 dark:text-teal-400">Pro</span>
            </Link>
            <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 mt-1 inline-block">
              MesIndep B2B
            </span>
          </div>

          {/* Liens de navigation dynamiques */}
          <SidebarNav />
        </div>

        {/* Profil de l'utilisateur et bouton Déconnexion */}
        <div className="border-t border-slate-200 dark:border-slate-700/60 pt-4 space-y-4">
          <div className="flex items-center gap-3 px-2">
            {user?.image ? (
              <Image
                src={user.image}
                alt={`Photo de profil de ${user.name || "l'utilisateur"}`}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-teal-500/40"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full bg-teal-600 dark:bg-teal-700 flex items-center justify-center text-white font-semibold"
                aria-hidden="true"
              >
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name || "Freelance"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              aria-label="Se déconnecter du compte freelance"
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 focus:outline-none transition-colors duration-200"
      >
        <header className="h-14 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors duration-200">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Espace Freelance</h2>
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">
              Freelance ID: <span className="font-mono text-slate-700 dark:text-slate-200">{user?.id || "N/A"}</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
