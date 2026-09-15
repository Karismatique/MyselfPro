"use client";

import { useActionState } from "react";
import { deleteClient } from "@/app/actions/clients";

type DeleteClientButtonProps = {
  clientId: string;
  clientName: string;
  hasFactures: boolean;
};

export default function DeleteClientButton({ clientId, clientName, hasFactures }: DeleteClientButtonProps) {
  const deleteClientWithId = deleteClient.bind(null, clientId);
  const [state, formAction, isPending] = useActionState(deleteClientWithId, null);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Supprimer le client "${clientName}" ? Cette action est irréversible.`)) {
          event.preventDefault();
        }
      }}
      className="inline-block"
    >
      <button
        type="submit"
        disabled={isPending || hasFactures}
        aria-disabled={isPending || hasFactures}
        title={hasFactures ? "Impossible de supprimer un client ayant des factures associées." : undefined}
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
