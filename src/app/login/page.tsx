import Link from "next/link";
import LoginForm from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";

export const metadata = {
  title: "Connexion - MySelfPro",
  description: "Accédez à votre tableau de bord MySelfPro pour gérer vos factures.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      {/* Barre supérieure d'actions (Retour & Thème) */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l&apos;accueil
        </Link>
        <ThemeToggle />
      </div>

      <Suspense fallback={<div className="text-sm text-slate-500">Chargement...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
