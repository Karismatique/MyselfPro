/**
 * Calcule le montant de la TVA et le montant TTC à partir d'un montant HT.
 * 
 * @param amountHT Le montant Hors Taxes (doit être positif ou nul)
 * @param tvaRate Le taux de TVA sous forme décimale (par défaut 0.20 soit 20%)
 * @returns Un objet contenant le montant HT, le montant de la TVA et le montant TTC arrondis à 2 décimales
 * @throws {RangeError} Si le montant HT est négatif
 */
export interface InvoiceAmounts {
  amountHT: number;
  tvaAmount: number;
  amountTTC: number;
}

export function calculateInvoiceAmounts(
  amountHT: number,
  tvaRate: number = 0.20
): InvoiceAmounts {
  if (amountHT < 0) {
    throw new RangeError("Le montant H.T. ne peut pas être négatif.");
  }

  const roundedHT = Math.round(amountHT * 100) / 100;
  const tvaAmount = Math.round(roundedHT * tvaRate * 100) / 100;
  const amountTTC = Math.round((roundedHT + tvaAmount) * 100) / 100;

  return {
    amountHT: roundedHT,
    tvaAmount,
    amountTTC,
  };
}
