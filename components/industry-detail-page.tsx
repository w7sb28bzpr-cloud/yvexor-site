import type { Industry } from "../data/content-types";
import { seoPageBySlug, type SeoPage } from "../data/seo-pages";
import { solutionById } from "../data/solutions";
import { getPublicToolsForIndustry } from "../lib/content";
import { PageData } from "./structured-data";
import { SiteHeader } from "./navigation";
import { SiteFooter } from "./site-footer";
import { BusinessToolIcon } from "./business-tool-icon";
import styles from "./industry-detail-page.module.css";

export function IndustryDetailPage({ industry, page }: { industry: Industry; page: SeoPage }) {
  const tools = getPublicToolsForIndustry(industry);
  const solutions = industry.solutionIds.map((id) => solutionById[id]).filter(Boolean);
  const fieldSolutions = solutions.filter((solution) => ["connected-systems", "equipment-retrofit"].includes(solution.id));

  return <div className="site-foundation">
    <PageData path={industry.canonicalPath} title={page.title} description={page.description} service={page.title} faq={page.faq} />
    <SiteHeader root />
    <main id="contenu" className={`site-container ${styles.page}`}>
      <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><a href="/metiers/">Métiers</a><span aria-hidden="true">/</span><span aria-current="page">{industry.name}</span></nav>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>YVEXOR · {industry.name}</p>
        <h1 className="site-display site-heading-xl">{industry.name}</h1>
        <p className={styles.promise}>{industry.heroPromise}</p>
        <p className={styles.lead}>{page.intro}</p>
        <a className="site-button" href="/contact/">Parler de mon activité</a>
      </header>

      <section className={styles.tools} aria-labelledby="industry-tools-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>Des applications adaptées à votre quotidien</p><h2 id="industry-tools-title" className="site-display site-heading-lg">Les outils pour votre activité.</h2></div>
        <div className={styles.toolGrid}>
          {tools.map((tool) => <a className={styles.tool} href={tool.canonicalPath} key={tool.id}>
            <span className={styles.toolIcon}><BusinessToolIcon icon={tool.icon} /></span>
            <span className={styles.toolName}>{tool.name}</span>
            <span className={styles.toolDescription}>{tool.shortDescription}</span>
            <span className={styles.toolLink}>Découvrir <span aria-hidden="true">↗</span></span>
          </a>)}
        </div>
      </section>

      <section className={styles.capabilities} aria-labelledby="industry-capabilities-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>À partir de votre fonctionnement</p><h2 id="industry-capabilities-title" className="site-display site-heading-lg">Ce que YVEXOR peut adapter.</h2></div>
        <div className={styles.solutionGrid}>{solutions.map((solution) => <article className={styles.solution} key={solution.id}>
          <h3>{solution.page.title}</h3><p>{solution.page.intro}</p><a href={solution.canonicalPath}>En savoir plus <span aria-hidden="true">↗</span></a>
        </article>)}</div>
      </section>

      {fieldSolutions.length > 0 && <section className={styles.field} aria-labelledby="industry-field-title">
        <div><p className={styles.eyebrow}>Du logiciel au terrain</p><h2 id="industry-field-title" className="site-display site-heading-lg">Relier vos outils aux équipements utiles.</h2>
          <p className={styles.fieldCopy}>Selon les systèmes et matériels en place, YVEXOR peut étudier les connexions, l’automatisation et l’ajout de fonctions à des équipements existants.</p></div>
        <div className={styles.fieldLinks}>{fieldSolutions.map((solution) => <a href={solution.canonicalPath} key={solution.id}><strong>{solution.page.title}</strong><span>{solution.page.intro}</span></a>)}</div>
      </section>}

      <section className={styles.editorial} aria-labelledby="industry-editorial-title">
        <p className={styles.eyebrow}>Comprendre les possibilités</p><h2 id="industry-editorial-title" className="site-display site-heading-lg">Une solution qui suit votre organisation.</h2>
        {page.sections.map((section, index) => <article className={styles.editorialSection} key={`${section.title}-${index}`}><h3>{section.title}</h3><p>{section.text}</p>{section.items?.length ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</article>)}
      </section>

      {!!page.faq?.length && <section className={styles.faq} aria-labelledby="industry-faq-title"><h2 id="industry-faq-title" className="site-display site-heading-lg">Questions fréquentes</h2>{page.faq.map((item) => <details key={item.title}><summary>{item.title}</summary><p>{item.text}</p>{item.items?.length ? <ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null}</details>)}</section>}

      <nav className={styles.related} aria-label="Pages utiles"><p className={styles.eyebrow}>Continuer votre recherche</p>{page.related.map((slug) => <a href={`/${slug}/`} key={slug}>{seoPageBySlug[slug]?.title ?? slug.replaceAll("-", " ")} <span aria-hidden="true">↗</span></a>)}</nav>

      <aside className={styles.contact}><p className={styles.eyebrow}>Un besoin particulier ?</p><h2 className="site-display">Votre fonctionnement est différent ?</h2><p>Nous pouvons construire la solution autour de votre organisation.</p><a className="site-button" href="/contact/">Étudier mon projet</a></aside>
    </main>
    <SiteFooter />
  </div>;
}
