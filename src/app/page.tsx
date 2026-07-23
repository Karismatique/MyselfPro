import Link from "next/link";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "MySelfPro - Facturation Simplifiée pour les Freelances",
  description: "La plateforme de gestion de clients et de facturation conçue spécialement pour le collectif de freelances MesIndep.",
};

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-200">
      {/* Ligne d'accent supérieure */}
      <div className="h-1 w-full bg-teal-600" aria-hidden="true"></div>

      {/* Header / Barre de navigation supérieure */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            MySelf<span className="text-teal-600 dark:text-teal-400">Pro</span>
          </span>
          <span className="text-xs text-teal-700 dark:text-teal-300 font-semibold px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-500/20 bg-teal-50 dark:bg-teal-500/10 hidden sm:inline-block">
            MesIndep B2B
          </span>
        </div>

        <nav aria-label="Navigation principale" className="flex items-center gap-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
              >
                Connexion
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Essai Gratuit
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Section Héro */}
      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400 mb-4">
            Plateforme freelance
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Gérez votre facturation freelance en toute{" "}
            <span className="text-teal-600 dark:text-teal-400">sérénité</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            Pensée pour le collectif{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">MesIndep</strong>,
            MySelfPro réunit votre CRM, vos devis, la facturation réglementaire
            et l&apos;estimation de vos cotisations URSSAF au même endroit.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-base transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                Aller sur mon Espace Freelance
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-base transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  Démarrer maintenant
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  Se connecter avec GitHub
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Section Fonctionnalités Clés */}
        <section aria-label="Fonctionnalités clés" className="mt-24 sm:mt-32">
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-10">
              Ce que MySelfPro vous apporte
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 01 */}
              <article className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center mb-4">
                  <svg className="h-5 w-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Factures professionnelles
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Générez vos factures au format PDF en un clic. Calcul automatique de la TVA et application des mentions légales requises.
                </p>
              </article>

              {/* Feature 02 */}
              <article className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center mb-4">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Estimation URSSAF
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Visualisez instantanément vos charges estimées à 21,1% et votre reste à vivre réel pour anticiper vos obligations fiscales.
                </p>
              </article>

              {/* Feature 03 */}
              <article className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center mb-4">
                  <svg className="h-5 w-5 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  CRM Intégré
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Conservez les dossiers de vos clients professionnels au même endroit. Suivez l&apos;historique de vos transactions en temps réel.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} MySelfPro. Tous droits réservés. Créé pour le collectif MesIndep.
          </p>
          <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500">
            <Link href="/login" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Accessibilité : conformité partielle
            </Link>
            <Link href="/login" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Mentions légales
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
