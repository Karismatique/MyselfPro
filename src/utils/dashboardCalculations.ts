/**
 /**
 * Fonctions pures de calcul des KPIs financiers pour le tableau de bord.
 * Résout les problèmes d'arrondi de virgule flottante JavaScript en arrondissant à deux décimales.
 */

export interface SimpleFacture {
  amount: number;
  status?: string;
  date?: Date | string;
}

/**
 * Calcule la somme totale du chiffre d'affaires
 */
export function calculateTotalCA(factures: SimpleFacture[]): number {
  const sum = factures.reduce((acc, f) => acc + f.amount, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Calcule l'estimation des cotisations URSSAF (21.1%)
 */
export function calculateURSSAF(totalCA: number): number {
  if (totalCA < 0) {
    throw new RangeError("Le Chiffre d'Affaires ne peut pas être négatif pour le calcul URSSAF.");
  }
  return Math.round(totalCA * 0.211 * 100) / 100;
}

/**
 * Calcule le reste à vivre estimé (CA H.T. - Cotisations URSSAF)
 */
export function calculateResteAVivre(totalCA: number, cotisations: number): number {
  return Math.round((totalCA - cotisations) * 100) / 100;
}

/**
 * Calcule l'estimation de la TVA collectée (20%)
 */
export function calculateTVA(totalCA: number): number {
  if (totalCA < 0) {
    throw new RangeError("Le Chiffre d'Affaires ne peut pas être négatif pour le calcul de la TVA.");
  }
  return Math.round(totalCA * 0.20 * 100) / 100;
}

/**
 * Calcule le montant total en attente d'encaissement (tout statut différent de "PAYE")
 */
export function calculatePendingAmount(factures: SimpleFacture[]): number {
  const pendingSum = factures
    .filter((f) => f.status !== "PAYE")
    .reduce((acc, f) => acc + f.amount, 0);
  return Math.round(pendingSum * 100) / 100;
}

/**
 * Calcule le chiffre d'affaires du mois en cours
 * @param factures Tableau de factures
 * @param referenceDate Date de référence représentant le moment "actuel"
 */
export function calculateCurrentMonthCA(factures: SimpleFacture[], referenceDate: Date): number {
  const refYear = referenceDate.getFullYear();
  const refMonth = referenceDate.getMonth();

  const currentMonthSum = factures
    .filter((f) => {
      if (!f.date) return false;
      const fDate = new Date(f.date);
      return fDate.getFullYear() === refYear && fDate.getMonth() === refMonth;
    })
    .reduce((acc, f) => acc + f.amount, 0);

  return Math.round(currentMonthSum * 100) / 100;
}
