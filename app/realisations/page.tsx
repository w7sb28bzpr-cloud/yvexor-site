import type { Metadata } from "next";
import { MigrationRedirect } from "../../components/migration-redirect";

const destination = "https://yvexor.com/#exemples";

export const metadata: Metadata = {
  title: "YVEXOR — Exemples de solutions",
  robots: { index: false, follow: true },
  alternates: { canonical: destination },
};

export default function RealisationsPage() {
  return <MigrationRedirect destination={destination} label="Voir les exemples" />;
}
