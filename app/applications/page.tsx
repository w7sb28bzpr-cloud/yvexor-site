import type { Metadata } from "next";
import { BusinessToolIcon } from "../../components/business-tool-icon";
import { SiteHeader } from "../../components/navigation";
import { SiteFooter } from "../../components/site-footer";
import { PageData } from "../../components/structured-data";
import { allApplicationsSlug, businessToolCategories } from "../../data/business-tool-categories";
import { pageMetadata } from "../../lib/seo";
import { ApplicationFlow } from "./application-flow";
import { getApplicationsCatalog } from "./catalog-data";
import styles from "./applications.module.css";

const title = "Applications YVEXOR — Les outils pour votre activité";
const description = "Explorez les applications YVEXOR pour gérer, vendre, automatiser et faire évoluer votre activité : CRM, caisse, facturation, planning et univers métier.";

export const metadata: Metadata = pageMetadata("/applications/", title, description);

const flowIds = ["crm", "quotes-sales", "invoicing", "analytics-pilotage"];

export default function ApplicationsPage() {
  const { source, tools, packs } = getApplicationsCatalog();
  const byId = new Map(source.map((tool) => [tool.id, tool]));
  const flowTools = flowIds.map((id) => byId.get(id)).filter((tool) => tool !== undefined);
  // The hub only shows doors: each rubric opens its own page with the matching applications.
  const rubrics = businessToolCategories
    .map((category) => ({ ...category, items: category.id === "business" ? packs : tools.filter((tool) => tool.categoryId === category.id) }))
    .filter((category) => category.items.length > 0);

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path="/applications/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.main}>
      <section className={styles.hero} aria-labelledby="applications-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="applications-title" className={styles.heroTitle}>Nos applications</h1>
            <p className={styles.heroLead}>Les outils pour gérer, vendre, automatiser et faire évoluer votre activité.</p>
            <a className={styles.heroJump} href="#rubriques">Choisir une rubrique <span aria-hidden="true">↓</span></a>
          </div>
          <ApplicationFlow tools={flowTools} />
        </div>
      </section>

      <section id="rubriques" className={styles.rubrics} aria-labelledby="rubrics-title">
        <h2 id="rubrics-title" className={styles.libraryTitle}>Que voulez-vous faire&nbsp;?</h2>
        <ul className={styles.rubricGrid}>
          {rubrics.map((rubric) => <li key={rubric.id}>
            <a className={`${styles.rubric} ${rubric.id === "business" ? styles.rubricPacks : ""}`} href={`/applications/${rubric.slug}/`}>
              <span className={styles.appIcon} data-tone={rubric.id}><BusinessToolIcon icon={rubric.icon} /></span>
              <span className={styles.rubricText}>
                <span className={styles.rubricName}>{rubric.label}</span>
                <span className={styles.rubricDescription}>{rubric.description}</span>
                <span className={styles.rubricApps}>{rubric.items.map((item) => item.name).join(" · ")}</span>
              </span>
              <span className={styles.rubricCount}>{rubric.items.length}</span>
              <span className={styles.rubricArrow} aria-hidden="true">→</span>
            </a>
          </li>)}
        </ul>
        <div className={styles.rubricsEnd}>
          <a className={styles.closingLink} href={`/applications/${allApplicationsSlug}/`}>Voir toutes les applications <span aria-hidden="true">→</span></a>
          <a className={styles.packsLink} href="/solutions/">Un système complet, sur mesure&nbsp;? Nos solutions <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
