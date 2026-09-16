"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import type { FactureFormState } from "@/app/actions/factures";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "BROUILLON", label: "Brouillon" },
  { value: "ENVOYE", label: "Envoyée" },
  { value: "PAYE", label: "Payée" },
  { value: "PAIE_RETARD", label: "Payée en retard" },
];

type FactureFormProps = {
  action: (prevState: FactureFormState, formData: FormData) => Promise<FactureFormState>;
  title: string;
  submitLabel: string;
  pendingLabel?: string;
  mode: "create" | "edit";
  clients?: { id: string; name: string }[];
  defaultValues?: { clientName?: string; amount: number; status: string };
  resetOnSuccess?: boolean;
};

export default function FactureForm({
  action,
  title,
  submitLabel,
  pendingLabel = "Enregistrement...",
  mode,
  clients = [],
  defaultValues,
  resetOnSuccess = true,
}: FactureFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Vider le formulaire en cas de succès (uniquement pour la création)
  useEffect(() => {
    if (state?.success && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [state, resetOnSuccess]);

  const hasError = !!state?.error;
  const noClientsAvailable = mode === "create" && clients.length === 0;

  return (
    <section
      aria-labelledby="facture-form-title"
      className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-lg transition-colors duration-200"
    >
      {/* Zone d'annonce vocale dynamique pour lecteur d'écran (RGAA 11.1.1 / WAI-ARIA) */}
      <div aria-live="polite" role="status" className="sr-only">
        {state?.success ? state.message : state?.error ? state.error : ""}
      </div>

      <div className="mb-6">
        <h3 id="facture-form-title" className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {!noClientsAvailable && (
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            Les champs marqués d&apos;une astérisque (*) sont obligatoires.
          </p>
        )}
      </div>

      {noClientsAvailable ? (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-sm text-amber-700 dark:text-amber-300">
          Ajoutez d&apos;abord un client avant de créer une facture.{" "}
          <Link href="/dashboard/clients" className="font-semibold underline hover:no-underline">
            Gérer les clients
          </Link>
        </div>
      ) : (
        <form ref={formRef} action={formAction} className="space-y-4">
          {/* Client (uniquement à la création) */}
          {mode === "create" ? (
            <div>
              <label htmlFor="clientId" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Client <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
                <span className="sr-only">(champ requis)</span>
              </label>
              <select
                id="clientId"
                name="clientId"
                required
                disabled={isPending}
                aria-invalid={hasError ? "true" : "false"}
                aria-describedby={hasError ? "facture-form-feedback" : undefined}
                defaultValue=""
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
              >
                <option value="" disabled>
                  Sélectionner un client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                Client
              </span>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                {defaultValues?.clientName}
              </p>
            </div>
          )}

          {/* Montant de la Facture */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Montant (€ H.T.) <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
              <span className="sr-only">(champ requis)</span>
            </label>
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                defaultValue={defaultValues?.amount}
                disabled={isPending}
                aria-invalid={hasError ? "true" : "false"}
                aria-describedby={hasError ? "facture-form-feedback" : undefined}
                placeholder="0.00"
                className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-300 text-sm font-medium"
                aria-hidden="true"
              >
                EUR
              </div>
            </div>
          </div>

          {/* Statut de la Facture */}
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Statut <span className="text-teal-600 dark:text-teal-400" aria-hidden="true">*</span>
              <span className="sr-only">(champ requis)</span>
            </label>
            <select
              id="status"
              name="status"
              required
              disabled={isPending}
              defaultValue={defaultValues?.status ?? "BROUILLON"}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-transparent transition-all disabled:opacity-50 text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Retours d'erreurs et de succès visibles */}
          {state?.error && (
            <div
              id="facture-form-feedback"
              className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold text-center transition-all"
            >
              {state.error}
            </div>
          )}

          {state?.success && (
            <div
              id="facture-form-feedback"
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
      )}
    </section>
  );
}
