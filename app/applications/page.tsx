import type { Metadata } from "next";
import { SiteHeader } from "../../components/navigation";
import { SiteFooter } from "../../components/site-footer";
import { PageData } from "../../components/structured-data";
import { businessToolCategories } from "../../data/business-tool-categories";
import { seoPages } from "../../data/seo-pages";
import { getApplicationCatalogTools } from "../../lib/content";
import { pageMetadata } from "../../lib/seo";
import { ApplicationCatalogue } from "./application-catalogue";
import { ApplicationFlow } from "./application-flow";
import styles from "./applications.module.css";

const title = "Applications YVEXOR — Les outils pour votre activité";
const description = "Explorez les applications YVEXOR pour gérer, vendre, automatiser et faire évoluer votre activité : CRM, caisse, facturation, planning et univers métier.";

export const metadata: Metadata = pageMetadata("/applications/", title, description);

const featuredIds = [
  "cash-register", "business-management-app", "business-website", "crm",
  "invoicing", "planning",
];
const flowIds = ["crm", "quotes-sales", "invoicing", "analytics-pilotage"];

// The path from one application to a full system. No prices here: they stay in the offers.
const ladder = [
  { title: "Essayer", text: "Vous testez l’application avant de décider.", tag: "Gratuit · sans engagement" },
  { title: "Une application", text: "Elle fait une chose, et elle la fait bien.", tag: "Petit abonnement · sans engagement" },
  { title: "Des applications reliées", text: "La caisse parle au stock, le stock parle au site. Vous payez la connexion, pas un outil de plus.", tag: "Abonnement connecté" },
  { title: "Votre système", text: "Ventes, équipe, gestion et IA circulent ensemble. On le construit avec vous.", tag: "Nos solutions · sur devis", href: "/solutions/" },
];

export default function ApplicationsPage() {
  const source = getApplicationCatalogTools();
  const featuredRank = new Map(featuredIds.map((id, index) => [id, index]));
  const tools = source.filter((tool) => tool.kind !== "business-suite").sort((a, b) =>
    (featuredRank.get(a.id) ?? featuredIds.length) - (featuredRank.get(b.id) ?? featuredIds.length));
  const packs = source.filter((tool) => tool.kind === "business-suite");
  const byId = new Map(source.map((tool) => [tool.id, tool]));
  const flowTools = flowIds.map((id) => byId.get(id)).filter((tool) => tool !== undefined);
  const knownPagePaths = new Set(seoPages.map((page) => `/${page.slug}/`));
  const existingCanonicalPaths = source.filter((tool) => knownPagePaths.has(tool.canonicalPath)).map((tool) => tool.canonicalPath);

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path="/applications/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.main}>
      <section className={styles.hero} aria-labelledby="applications-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}><span className={styles.kickerMark} aria-hidden="true" /> Nos applications</p>
            <h1 id="applications-title" className={styles.heroTitle}>Applications<span> YVEXOR.</span></h1>
            <p className={styles.heroLead}>Les outils pour gérer, vendre, automatiser et faire évoluer votre activité.</p>
            <a className={styles.heroJump} href="#bibliotheque">Parcourir les {tools.length} applications <span aria-hidden="true">↓</span></a>
          </div>
          <ApplicationFlow tools={flowTools} />
        </div>
      </section>

      <section className={styles.ladder} aria-labelledby="ladder-title">
        <div className={styles.ladderHead}>
          <h2 id="ladder-title" className={styles.libraryTitle}>Commencez petit. Grandissez quand vous voulez.</h2>
          <p>Le prix suit ce que vous reliez, pas ce que vous essayez.</p>
        </div>
        <ol className={styles.ladderSteps}>
          {ladder.map((step, index) => <li key={step.title} style={{ "--step": index } as React.CSSProperties}>
            <span className={styles.ladderNumber} aria-hidden="true">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {step.href
              ? <a className={styles.ladderTag} href={step.href}>{step.tag} <span aria-hidden="true">→</span></a>
              : <span className={styles.ladderTag}>{step.tag}</span>}
          </li>)}
        </ol>
      </section>

      <section id="bibliotheque" className={styles.library} aria-labelledby="library-title">
        <div className={styles.libraryHead}>
          <h2 id="library-title" className={styles.libraryTitle}>La bibliothèque</h2>
          <p>Chaque application s’adapte à votre activité et se relie aux autres.</p>
        </div>
        <ApplicationCatalogue
          tools={tools}
          packs={packs}
          categories={businessToolCategories}
          existingCanonicalPaths={existingCanonicalPaths}
        />
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <h2 id="closing-title">Vous ne trouvez pas l’outil qu’il vous faut&nbsp;?</h2>
        <p>YVEXOR peut l’adapter ou le construire avec vous.</p>
        <a className={styles.closingLink} href="/solutions/">Construire une solution adaptée <span aria-hidden="true">→</span></a>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
