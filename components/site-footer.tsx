import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return <footer className="footer v2-footer">
    <div className="footer-brand">
      <a href="/" aria-label="YVEXOR — Accueil"><BrandLogo /></a>
      <p>Du logiciel au terrain.<br />La solution part de ton besoin.</p>
      <span>Marseille · France · Suisse<br />À distance ou sur place selon le projet.</span>
    </div>
    <nav aria-label="Explorer YVEXOR">
      <strong>Explorer</strong>
      <a href="/solutions/">Solutions</a>
      <a href="/projets/">Projets</a>
      <a href="/a-propos/">À propos</a>
      <a href="/tarifs-partenariat/">Budget & tarifs</a>
      <a href="/contact/">Contact</a>
    </nav>
    <nav aria-label="Accès directs">
      <strong>Accès directs</strong>
      <a href="/caisse/">Caisses</a>
      <a href="/boutique/">Boutique</a>
      <a href="/materiel/">Catalogue connecté</a>
      <a href="/faq/">Questions fréquentes</a>
      <a href="https://client.yvexor.com/">Espace client ↗</a>
    </nav>
    <div className="footer-bottom">
      <small>© 2026 YVEXOR</small>
      <a href="/mentions-legales/">Mentions légales</a>
      <a href="/politique-confidentialite/">Confidentialité</a>
    </div>
  </footer>;
}
