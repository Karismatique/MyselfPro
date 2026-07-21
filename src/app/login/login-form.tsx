"use client";

import { useActionState } from "react";
import { loginWithCredentials, loginWithGithub } from "../actions/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginWithCredentials, null);

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          MySelf<span className="text-indigo-400">Pro</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          La plateforme de facturation dédiée aux freelances de MesIndep
        </p>
      </div>

      {/* Bouton de connexion GitHub */}
      <form action={loginWithGithub} className="mb-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 cursor-pointer"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
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
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-zinc-500 text-xs uppercase tracking-wider">ou</span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      {/* Formulaire classique */}
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Ex: freelance@mesindep.fr"
            className="w-full px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {state?.error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
