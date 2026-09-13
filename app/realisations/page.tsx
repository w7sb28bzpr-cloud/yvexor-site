import type { Metadata } from "next";
import { MigrationRedirect } from "../../components/migration-redirect";

const destination = "https://yvexor.com/#exemples";

export const metadata: Metadata = {
  title: "YVEXOR — Exemples de solutions",
  description: "Retrouvez les exemples conceptuels de solutions YVEXOR sur la page principale.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://yvexor.com/" },
};

export default function RealisationsPage() {
  return <MigrationRedirect destination={destination} label="Voir les exemples" />;
}
