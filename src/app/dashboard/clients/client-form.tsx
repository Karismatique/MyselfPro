"use client";

import { useActionState, useEffect, useRef } from "react";
import type { ClientFormState } from "@/app/actions/clients";

type ClientFormProps = {
  action: (prevState: ClientFormState, formData: FormData) => Promise<ClientFormState>;
  title: string;
  submitLabel: string;
  pendingLabel?: string;
  defaultValues?: { name: string; email: string; address: string | null };
  resetOnSuccess?: boolean;
};

export default function ClientForm({
  action,
  title,
  submitLabel,
  pendingLabel = "Enregistrement...",
  defaultValues,
  resetOnSuccess = true,
}: ClientFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Vider le formulaire en cas de succès (uniquement pour la création)
  useEffect(() => {
    if (state?.success && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [state, resetOnSuccess]);

  const hasError = !!state?.error;

  return (
    <section
      aria-labelledby="client-form-title"
      className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-200"
    >
      {/* Zone d'annonce vocale dynamique pour lecteur d'écran (RGAA 11.1.1 / WAI-ARIA) */}
      <div aria-live="polite" role="status" className="sr-only">
        {state?.success ? state.message : state?.error ? state.error : ""}
      </div>

      <div className="mb-6">
        <h3 id="client-form-title" className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
          Les champs marqués d&apos;une astérisque (*) sont obligatoires.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        {/* Nom du Client */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Nom du Client <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
            <span className="sr-only">(champ requis)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultValues?.name}
            disabled={isPending}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "client-form-feedback" : undefined}
            placeholder="Ex: SAS Global Tech"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Email du Client */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Email du Client <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
            <span className="sr-only">(champ requis)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaultValues?.email}
            disabled={isPending}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "client-form-feedback" : undefined}
            placeholder="Ex: contact@globaltech.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Adresse du Client (Optionnel) */}
        <div>
          <label htmlFor="address" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Adresse du Client
          </label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={defaultValues?.address ?? ""}
            disabled={isPending}
            placeholder="Ex: 12 Rue de la Paix, 75002 Paris"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Retours d'erreurs et de succès visibles */}
        {state?.error && (
          <div
            id="client-form-feedback"
            className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold text-center transition-all"
          >
            {state.error}
          </div>
        )}

        {state?.success && (
          <div
            id="client-form-feedback"
            className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center transition-all"
          >
            {state.message}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-semibold transition-all shadow-lg shadow-teal-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </section>
  );
}
