"use client";

import { useActionState, useEffect, useRef } from "react";
import { createClientAndInvoice } from "../actions/invoices";

export default function CreateInvoiceForm() {
  const [state, formAction, isPending] = useActionState(createClientAndInvoice, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Vider le formulaire en cas de succès
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const hasError = !!state?.error;

  return (
    <section 
      aria-labelledby="form-title" 
      className="p-6 bg-zinc-950/40 border border-zinc-800 rounded-xl shadow-lg"
    >
      {/* Zone d'annonce vocale dynamique pour lecteur d'écran (RGAA 11.1.1 / WAI-ARIA) */}
      <div aria-live="polite" role="status" className="sr-only">
        {state?.success ? state.message : state?.error ? state.error : ""}
      </div>

      <div className="mb-6">
        <h3 id="form-title" className="text-lg font-bold text-white">
          Nouveau Client & Facture
        </h3>
        <p className="text-xs text-zinc-300 mt-1">
          Créez un nouveau client et générez sa facture associée en une seule opération. Les champs marqués d'une astérisque (*) sont obligatoires.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        {/* Nom du Client */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Nom du Client <span className="text-indigo-400" aria-hidden="true">*</span>
            <span className="sr-only">(champ requis)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isPending}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "form-feedback" : undefined}
            placeholder="Ex: SAS Global Tech"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Email du Client */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Email du Client <span className="text-indigo-400" aria-hidden="true">*</span>
            <span className="sr-only">(champ requis)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? "form-feedback" : undefined}
            placeholder="Ex: contact@globaltech.com"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Adresse du Client (Optionnel) */}
        <div>
          <label htmlFor="address" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Adresse du Client
          </label>
          <input
            id="address"
            name="address"
            type="text"
            disabled={isPending}
            placeholder="Ex: 12 Rue de la Paix, 75002 Paris"
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
          />
        </div>

        {/* Montant de la Facture */}
        <div>
          <label htmlFor="amount" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Montant de la Facture (€ H.T.) <span className="text-indigo-400" aria-hidden="true">*</span>
            <span className="sr-only">(champ requis)</span>
          </label>
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              disabled={isPending}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? "form-feedback" : undefined}
              placeholder="0.00"
              className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-300 text-sm font-medium"
              aria-hidden="true"
            >
              EUR
            </div>
          </div>
        </div>

        {/* Retours d'erreurs et de succès visibles */}
        {state?.error && (
          <div 
            id="form-feedback" 
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold text-center transition-all"
          >
            {state.error}
          </div>
        )}

        {state?.success && (
          <div 
            id="form-feedback" 
            className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold text-center transition-all"
          >
            {state.message}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Création en cours...
            </>
          ) : (
            "Créer le Client & Facture"
          )}
        </button>
      </form>
    </section>
  );
}
