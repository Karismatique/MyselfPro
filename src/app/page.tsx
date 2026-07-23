import Link from "next/link";
import { auth } from "@/auth";

export const metadata = {
  title: "MySelfPro - Facturation Simplifiée pour les Freelances",
  description: "La plateforme de gestion de clients et de facturation conçue spécialement pour le collectif de freelances MesIndep.",
};

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between overflow-hidden">
      {/* Effets lumineux de fond décoratifs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Barre de navigation supérieure */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            MySelf<span className="text-indigo-400">Pro</span>
          </span>
          <span className="text-xs text-indigo-300 font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 hidden sm:inline-block">
            MesIndep B2B
          </span>
        </div>

        <nav aria-label="Navigation principale" className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
              >
                Connexion
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Essai Gratuit
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Section Héro (Hero Section) */}
      <main id="main-content" className="relative flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto z-10 py-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none">
          Gérez votre facturation freelance en toute <span className="text-indigo-400">sérénité</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl leading-relaxed">
          Pensée pour le collectif <strong className="text-white font-semibold">MesIndep</strong>, MySelfPro réunit votre CRM, vos devis, la facturation réglementaire et l'estimation de vos cotisations URSSAF au même endroit.
        </p>

        {/* CTA (Call to Action) */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Aller sur mon Espace Freelance
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-indigo-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Démarrer maintenant
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-semibold text-base border border-zinc-800 hover:border-zinc-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
              >
                Se connecter avec GitHub
              </Link>
            </>
          )}
        </div>

        {/* Section Fonctionnalités Clés (Features list) */}
        <section aria-label="Fonctionnalités clés" className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800/80 rounded-xl backdrop-blur-sm">
            <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 border border-indigo-500/20">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white mb-2">Factures professionnelles</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Générez vos factures au format PDF en un clic. Calcul automatique de la TVA et application des mentions légales requises.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800/80 rounded-xl backdrop-blur-sm">
            <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 border border-indigo-500/20">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white mb-2">Estimation URSSAF</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Visualisez instantanément vos charges estimées à 21,1% et votre reste à vivre réel pour anticiper vos obligations fiscales.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800/80 rounded-xl backdrop-blur-sm">
            <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 border border-indigo-500/20">
              <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-white mb-2">CRM Intégré</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Conservez les dossiers de vos clients professionnels au même endroit. Suivez l'historique de vos transactions en temps réel.
            </p>
          </div>
        </section>
      </main>

      {/* Footer / Pied de page */}
      <footer className="relative w-full border-t border-zinc-900 bg-zinc-950 py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} MySelfPro. Tous droits réservés. Créé pour le collectif MesIndep.
          </p>
          <div className="flex gap-6 text-xs text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Accessibilité : conformité partielle
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
