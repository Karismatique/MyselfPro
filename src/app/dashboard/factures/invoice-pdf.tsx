import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles pour le document PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: "#333",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4f46e5", // Indigo color matching MySelfPro branding
    marginBottom: 5,
  },
  metaText: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  branding: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#18181b",
  },
  subBranding: {
    fontSize: 8,
    color: "#4f46e5",
    marginTop: 2,
  },
  addresses: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  addressBox: {
    width: "45%",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  partyName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 4,
  },
  partyDetails: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.4,
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    padding: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    padding: 8,
    alignItems: "center",
  },
  colDesc: {
    width: "60%",
  },
  colQty: {
    width: "15%",
    textAlign: "right",
  },
  colPrice: {
    width: "25%",
    textAlign: "right",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  totalsBox: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#4f46e5",
    marginTop: 6,
    fontWeight: "bold",
  },
  totalLabel: {
    color: "#666",
    fontSize: 9,
  },
  totalValue: {
    color: "#18181b",
    fontSize: 9,
    fontWeight: "bold",
  },
  totalValueFinal: {
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    paddingTop: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

interface InvoicePDFProps {
  invoice: {
    number: string;
    amount: number;
    date: Date | string;
  };
  client: {
    name: string;
    email: string;
    address: string | null;
  };
  user: {
    name: string | null;
    email: string | null;
  };
}

// Fonction utilitaire de formatage pour nettoyer les espaces insécables buggés dans @react-pdf/renderer
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(amount)
    .replace(/\u00a0/g, " ") // Espace insécable standard
    .replace(/\u202f/g, " "); // Espace insécable fin (qui s'affiche sous forme de / dans react-pdf)
}

export function InvoicePDF({ invoice, client, user }: InvoicePDFProps) {
  const amountHT = invoice.amount;
  const tvaAmount = amountHT * 0.20; // 20% TVA
  const amountTTC = amountHT + tvaAmount;

  const invoiceDate = new Date(invoice.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.branding}>MySelfPro</Text>
            <Text style={styles.subBranding}>Plateforme Freelance MesIndep</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={styles.metaText}>N° {invoice.number}</Text>
            <Text style={styles.metaText}>Date : {invoiceDate}</Text>
          </View>
        </View>

        {/* Adresses Émetteur / Destinataire */}
        <View style={styles.addresses}>
          <View style={styles.addressBox}>
            <Text style={styles.sectionTitle}>Émetteur</Text>
            <Text style={styles.partyName}>{user.name || "Freelance Indépendant"}</Text>
            <Text style={styles.partyDetails}>{user.email || ""}</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.sectionTitle}>Facturé à</Text>
            <Text style={styles.partyName}>{client.name}</Text>
            {client.address && <Text style={styles.partyDetails}>{client.address}</Text>}
            <Text style={styles.partyDetails}>{client.email}</Text>
          </View>
        </View>

        {/* Table des prestations */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, { fontWeight: "bold" }]}>Désignation</Text>
            <Text style={[styles.colQty, { fontWeight: "bold" }]}>Qté</Text>
            <Text style={[styles.colPrice, { fontWeight: "bold" }]}>Montant H.T.</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>Prestations de services et accompagnement freelance</Text>
            <Text style={styles.colQty}>1</Text>
            <Text style={styles.colPrice}>
              {formatCurrency(amountHT)}
            </Text>
          </View>
        </View>

        {/* Totaux */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total H.T.</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(amountHT)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (20%)</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(tvaAmount)}
              </Text>
            </View>
            <View style={styles.totalRowFinal}>
              <Text style={[styles.totalLabel, { fontWeight: "bold", color: "#4f46e5" }]}>Total T.T.C.</Text>
              <Text style={styles.totalValueFinal}>
                {formatCurrency(amountTTC)}
              </Text>
            </View>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Facture générée via le portail MySelfPro du collectif MesIndep.
          </Text>
          <Text style={[styles.footerText, { marginTop: 4, fontSize: 7, color: "#aaa" }]}>
            TVA non applicable, art. 293 B du CGI - Pour toute question, veuillez contacter l&apos;émetteur.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
