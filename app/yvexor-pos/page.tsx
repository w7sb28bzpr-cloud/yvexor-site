import type { Metadata } from "next";
import { MigrationRedirect } from "../../components/migration-redirect";

const destination = "https://yvexor.com/logiciel-caisse-marseille/";

export const metadata: Metadata = {
  title: "YVEXOR — Caisse & Commerce",
  robots: { index: false, follow: true },
  alternates: { canonical: destination },
};

export default function YvexorPosPage() {
  return <MigrationRedirect destination={destination} label="Découvrir Caisse & Commerce" />;
}
