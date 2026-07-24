"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "../actions/auth";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-2xl transition-colors duration-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          MySelf<span className="text-teal-600 dark:text-teal-400">Pro</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Créer un compte freelance sur le réseau MesIndep
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {/* Nom & Prénom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Nom et prénom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isPending}
            placeholder="Ex: Jean Dupont"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            placeholder="Ex: jean.dupont@mesindep.fr"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            disabled={isPending}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            8 caractères minimum requis.
          </p>
        </div>

        {/* Erreur si présente */}
        {state?.error && (
          <div 
            role="alert"
            className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium text-center"
          >
            {state.error}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold transition-all shadow-md shadow-teal-600/20 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Création du compte...
            </>
          ) : (
            "Créer mon compte"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Déjà inscrit ?{" "}
        <Link 
          href="/login" 
          className="font-semibold text-teal-600 dark:text-teal-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
