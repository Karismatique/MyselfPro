"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginWithCredentials, loginWithGithub } from "../actions/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, null);
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-2xl transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          MySelf<span className="text-teal-600 dark:text-teal-400">Pro</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          La plateforme de facturation dédiée aux freelances de MesIndep
        </p>
      </div>

      {isRegistered && (
        <div 
          role="status"
          className="mb-6 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-medium text-center"
        >
          Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      {/* Bouton de connexion GitHub */}
      <form action={loginWithGithub} className="mb-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer text-sm"
        >
          <svg className="h-5 w-5 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          Se connecter avec GitHub
        </button>
      </form>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">ou</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
      </div>

      {/* Formulaire classique */}
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Ex: freelance@mesindep.fr"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        {state?.error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 text-center font-medium">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold transition-all shadow-md shadow-teal-600/20 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Pas encore de compte ?{" "}
        <Link 
          href="/register" 
          className="font-semibold text-teal-600 dark:text-teal-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
