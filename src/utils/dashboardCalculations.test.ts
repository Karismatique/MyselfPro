import { describe, it, expect } from "vitest";
import {
  calculateTotalCA,
  calculateURSSAF,
  calculateResteAVivre,
  calculateTVA,
  calculatePendingAmount,
  calculateCurrentMonthCA,
  SimpleFacture,
} from "./dashboardCalculations";

describe("KPIs Dashboard - Tests Métier", () => {
  const referenceDate = new Date("2026-07-23");

  const mockFactures: SimpleFacture[] = [
    { amount: 1500.00, status: "PAYE",        date: "2026-07-01" }, // Ce mois
    { amount: 3200.00, status: "ENVOYE",      date: "2026-07-15" }, // Ce mois
    { amount: 4200.00, status: "PAYE",        date: "2026-06-10" }, // Mois précédent
    { amount: 1900.00, status: "BROUILLON",   date: "2026-07-22" }, // Ce mois
    { amount: 3100.00, status: "PAIE_RETARD", date: "2026-07-23" }, // Ce mois
  ];

  it("calcule la somme de tous les montants (CA Total H.T.)", () => {
    expect(calculateTotalCA(mockFactures)).toBe(13900.00);
  });

  it("calcule l'estimation URSSAF (21.1%) et le reste à vivre", () => {
    const totalCA = 13900.00;
    const urssaf = calculateURSSAF(totalCA);
    
    expect(urssaf).toBe(2932.90);
    expect(calculateResteAVivre(totalCA, urssaf)).toBe(10967.10);
  });

  it("calcule l'estimation de la TVA collectée (20%)", () => {
    expect(calculateTVA(13900.00)).toBe(2780.00);
  });

  it("somme le CA du mois en cours uniquement", () => {
    expect(calculateCurrentMonthCA(mockFactures, referenceDate)).toBe(9700.00);
  });

  it("somme le montant des factures non payées (en attente)", () => {
    expect(calculatePendingAmount(mockFactures)).toBe(8200.00);
  });

  it("retourne 0 si la liste de factures est vide", () => {
    expect(calculateTotalCA([])).toBe(0);
    expect(calculateURSSAF(0)).toBe(0);
    expect(calculateTVA(0)).toBe(0);
    expect(calculatePendingAmount([])).toBe(0);
    expect(calculateCurrentMonthCA([], referenceDate)).toBe(0);
  });

  it("gère les exceptions sur les montants négatifs", () => {
    expect(() => calculateURSSAF(-100)).toThrow(RangeError);
    expect(() => calculateTVA(-50)).toThrow(RangeError);
  });

  it("garantit la précision des arrondis décimaux", () => {
    const decimalFactures = [{ amount: 10.25 }, { amount: 20.43 }, { amount: 5.11 }];
    const totalCA = calculateTotalCA(decimalFactures);

    expect(totalCA).toBe(35.79);
    expect(calculateURSSAF(totalCA)).toBe(7.55); // 35.79 * 0.211 = 7.55169 -> 7.55
    expect(calculateTVA(totalCA)).toBe(7.16);     // 35.79 * 0.20 = 7.158 -> 7.16
  });
});
