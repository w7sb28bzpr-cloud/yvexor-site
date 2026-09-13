import type { Metadata } from "next";
import { MigrationRedirect } from "../../components/migration-redirect";

const destination = "https://yvexor.com/histoire/";

export const metadata: Metadata = {
  title: "YVEXOR — À propos",
  description: "Découvrez l’approche et l’origine de YVEXOR sur la page Notre approche.",
  robots: { index: false, follow: true },
  alternates: { canonical: destination },
};

export default function AProposPage() {
  return <MigrationRedirect destination={destination} label="Découvrir YVEXOR" />;
}
