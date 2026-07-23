import { renderToStream } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { InvoicePDF } from "@/app/dashboard/factures/invoice-pdf";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authentification
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new Response("Non autorisé", { status: 401 });
  }

  const { id } = await params;

  try {
    // 2. Recherche de la facture et vérification de la propriété
    const invoice = await db.facture.findUnique({
      where: { id },
      include: {
        client: true,
        user: true,
      },
    });

    if (!invoice || invoice.userId !== userId) {
      return new Response("Facture introuvable ou accès refusé", { status: 404 });
    }

    // 3. Rendu du PDF sous forme de flux (Stream)
    const pdfStream = await renderToStream(
      <InvoicePDF
        invoice={{
          number: invoice.number,
          amount: invoice.amount,
          date: invoice.date,
        }}
        client={{
          name: invoice.client.name,
          email: invoice.client.email,
          address: invoice.client.address,
        }}
        user={{
          name: invoice.user.name,
          email: invoice.user.email,
        }}
      />
    );

    // 4. Renvoi du flux PDF avec les bons headers pour le téléchargement
    return new Response(pdfStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${invoice.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    return new Response("Erreur interne du serveur", { status: 500 });
  }
}
