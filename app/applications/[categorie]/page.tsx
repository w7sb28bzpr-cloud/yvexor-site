import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/navigation";
import { SiteFooter } from "../../../components/site-footer";
import { PageData } from "../../../components/structured-data";
import { allApplicationsSlug, businessToolCategories } from "../../../data/business-tool-categories";
import { pageMetadata } from "../../../lib/seo";
import { ApplicationCatalogue } from "../application-catalogue";
import { getApplicationsCatalog } from "../catalog-data";
import styles from "../applications.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...businessToolCategories.map(({ slug }) => ({ categorie: slug })), { categorie: allApplicationsSlug }];
}

type CategoryPageProps = { params: Promise<{ categorie: string }> };

function getPage(slug: string) {
  const { tools, packs, existingCanonicalPaths } = getApplicationsCatalog();
  if (slug === allApplicationsSlug) {
    return {
      label: "Toutes les applications",
      description: "Toute la bibliothèque YVEXOR, avec les packs métier.",
      tools, packs, showFilters: true, existingCanonicalPaths,
    };
  }
  const category = businessToolCategories.find((item) => item.slug === slug);
  if (!category) return undefined;
  const items = category.id === "business" ? packs : tools.filter((tool) => tool.categoryId === category.id);
  if (items.length === 0) return undefined;
  return { label: category.label, description: category.description, tools: items, packs: [], showFilters: false, existingCanonicalPaths };
}

const metaTitle = (label: string) => `${label} — Applications YVEXOR`;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorie } = await params;
  const page = getPage(categorie);
  if (!page) notFound();
  return pageMetadata(`/applications/${categorie}/`, metaTitle(page.label), `${page.description} ${page.tools.map((tool) => tool.name).join(", ")}.`);
}

export default async function ApplicationCategoryPage({ params }: CategoryPageProps) {
  const { categorie } = await params;
  const page = getPage(categorie);
  if (!page) notFound();
  const path = `/applications/${categorie}/`;
  const { tools, packs } = getApplicationsCatalog();
  const others = businessToolCategories.filter((category) => category.slug !== categorie
    && (category.id === "business" ? packs.length > 0 : tools.some((tool) => tool.categoryId === category.id)));

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path={path} title={metaTitle(page.label)} description={page.description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.main}>
      <section className={styles.categoryHead} aria-labelledby="category-title">
        <a className={styles.backLink} href="/applications/#rubriques"><span aria-hidden="true">←</span> Applications</a>
        <h1 id="category-title" className={styles.categoryTitle}>{page.label}</h1>
        <p>{page.description}</p>
      </section>

      <section className={styles.library} aria-label={page.label}>
        <ApplicationCatalogue
          tools={page.tools}
          packs={page.packs}
          categories={businessToolCategories}
          existingCanonicalPaths={page.existingCanonicalPaths}
          showFilters={page.showFilters}
        />
      </section>

      <nav className={styles.closing} aria-labelledby="others-title">
        <h2 id="others-title" className={styles.othersTitle}>Les autres rubriques</h2>
        <ul className={styles.otherRubrics}>
          {others.map((category) => <li key={category.id}><a href={`/applications/${category.slug}/`}>{category.label}</a></li>)}
          {categorie !== allApplicationsSlug && <li><a href={`/applications/${allApplicationsSlug}/`}>Toutes les applications</a></li>}
        </ul>
        <a className={styles.packsLink} href="/solutions/">Un système complet, sur mesure&nbsp;? Nos solutions <span aria-hidden="true">→</span></a>
      </nav>
    </main>
    <SiteFooter />
  </div>;
}
