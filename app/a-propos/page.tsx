import type { Metadata } from "next";
import { MigrationRedirect } from "../../components/migration-redirect";

const destination = "https://yvexor.com/#yvexor";

export const metadata: Metadata = {
  title: "YVEXOR — À propos",
  robots: { index: false, follow: true },
  alternates: { canonical: destination },
};

export default function AProposPage() {
  return <MigrationRedirect destination={destination} label="Découvrir YVEXOR" />;
}
