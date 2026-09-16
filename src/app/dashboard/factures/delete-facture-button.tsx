"use client";

import { useActionState } from "react";
import { deleteFacture } from "@/app/actions/factures";

type DeleteFactureButtonProps = {
  factureId: string;
  factureNumber: string;
};

export default function DeleteFactureButton({ factureId, factureNumber }: DeleteFactureButtonProps) {
  const deleteFactureWithId = deleteFacture.bind(null, factureId);
  const [state, formAction, isPending] = useActionState(deleteFactureWithId, null);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer la facture "${factureNumber}" ? Cette action est irréversible.`)) {
          event.preventDefault();
        }
      }}
      className="inline-block"
    >
      <button
        type="submit"
        disabled={isPending}
        aria-disabled={isPending}
        className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Suppression..." : "Supprimer"}
      </button>
      {state?.error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[16rem]">
          {state.error}
        </p>
      )}
    </form>
  );
}
