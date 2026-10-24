import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageData } from "../../../components/structured-data";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/navigation";
import { SolutionPricing } from "../../../components/solution-pricing";
import { getGeneratedSolutionPages, getPublicSolutionBySlug, getPublishedProjects, industryById } from "../../../lib/content";
import { pageMetadata } from "../../../lib/seo";
import styles from "./solution-page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGeneratedSolutionPages();
}

type SolutionPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getPublicSolutionBySlug(slug);
  if (!solution || solution.canonicalPath !== `/solutions/${slug}/`) notFound();

  const title = solution.page.metaTitle ?? `${solution.page.title} | YVEXOR`;
  return pageMetadata(solution.canonicalPath, title, solution.page.description);
}

export default async function SolutionDetailPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = getPublicSolutionBySlug(slug);
  if (!solution || solution.canonicalPath !== `/solutions/${slug}/`) notFound();

  const title = solution.page.metaTitle ?? `${solution.page.title} | YVEXOR`;
  const industries = solution.industryIds.map((id) => industryById[id]).filter(Boolean);
  const projects = getPublishedProjects().filter((project) => solution.projectIds.includes(project.id));

  return <div className="site-foundation">
    <PageData path={solution.canonicalPath} title={title} description={solution.page.description} service={solution.page.title} faq={solution.page.faq} />
    <SiteHeader />
    <main id="contenu" className={`site-container ${styles.page}`}>
      <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><a className="site-link" href="/solutions/">Solutions</a><span aria-hidden="true">/</span><span aria-current="page">{solution.page.title}</span></nav>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{solution.eyebrow}</p>
        <h1 className="site-display site-heading-xl">{solution.page.title}</h1>
        <p className={`site-copy ${styles.lead}`}>{solution.page.intro}</p>
        <SolutionPricing pricing={solution.pricing} />
        <a className={`site-button ${styles.primaryAction}`} href={solution.primaryAction.href}>{solution.primaryAction.label}</a>
      </header>

      {industries.length > 0 && <nav className={`site-surface ${styles.industryLinks}`} aria-label={`Métiers concernés par ${solution.page.title}`}>
        <strong>Cette solution peut s’adapter à</strong>
        {industries.map((industry) => <a className="site-link" href={industry.canonicalPath} key={industry.id}>{industry.name}</a>)}
      </nav>}

      <div className={styles.sections}>
        {solution.page.sections.map((section, index) => <section className={styles.section} key={`${section.title}-${index}`}>
          <p className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</p>
          <div><h2 className="site-display">{section.title}</h2><p className="site-copy">{section.text}</p>
            {section.items && (solution.id === "equipment-retrofit" ? <ol className={styles.flow} aria-label="Étapes possibles pour connecter un équipement">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ol> : <ul className={styles.list}>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>)}
          </div>
        </section>)}
      </div>

      {projects.length > 0 && <section className={styles.projects} aria-labelledby="solution-projects-title">
        <p className={styles.eyebrow}>Projets approuvés</p><h2 id="solution-projects-title" className="site-display site-heading-lg">Des projets réels liés à cette solution</h2>
        <div className={styles.projectList}>{projects.map((project) => <article className="site-surface" key={project.id}><h3>{project.title}</h3><p>{project.need}</p><p>{project.outcome}</p><a className="site-link" href="/projets/">Voir les projets</a></article>)}</div>
      </section>}

      <aside className={`site-surface site-surface--elevated ${styles.contact}`}>
        <div><p className={styles.eyebrow}>Une première étape</p><h2 className="site-display">On part de votre besoin.</h2><p className="site-copy">Le périmètre et la manière d’avancer se définissent avec votre projet.</p></div>
        <a className="site-button" href="/contact/">Étudier mon projet</a>
      </aside>
    </main>
    <SiteFooter />
  </div>;
}
