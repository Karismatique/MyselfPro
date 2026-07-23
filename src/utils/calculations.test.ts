import { describe, it, expect } from "vitest";
import { calculateInvoiceAmounts } from "./calculations";

describe("Billing Calculations Suite", () => {
  // 1. Cas nominal
  it("devrait calculer les bons montants pour un cas nominal (100€ H.T.)", () => {
    const result = calculateInvoiceAmounts(100);
    expect(result.amountHT).toBe(100);
    expect(result.tvaAmount).toBe(20);
    expect(result.amountTTC).toBe(120);
  });

  // 2. Cas limite
  it("devrait renvoyer des valeurs à zéro pour un montant de 0€ H.T.", () => {
    const result = calculateInvoiceAmounts(0);
    expect(result.amountHT).toBe(0);
    expect(result.tvaAmount).toBe(0);
    expect(result.amountTTC).toBe(0);
  });

  // 3. Cas d'erreur (montant négatif)
  it("devrait lever une RangeError pour un montant H.T. négatif", () => {
    expect(() => calculateInvoiceAmounts(-45.50)).toThrow(RangeError);
    expect(() => calculateInvoiceAmounts(-100)).toThrow("Le montant H.T. ne peut pas être négatif.");
  });

  // 4. Cas de précision décimale (vérification des arrondis)
  it("devrait arrondir correctement les centimes pour éviter les erreurs de virgule flottante", () => {
    const result = calculateInvoiceAmounts(10.25);

    expect(result.amountHT).toBe(10.25);
    expect(result.tvaAmount).toBe(2.05);
    expect(result.amountTTC).toBe(12.30);
  });
});
