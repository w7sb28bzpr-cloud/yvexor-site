"use client";

import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { ThemeControl } from "./theme-control";

const primaryLinks = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions/" },
  { label: "Métiers", href: "/metiers/" },
  { label: "Projets", href: "/projets/" },
  { label: "À propos", href: "/a-propos/" },
  { label: "Contact", href: "/contact/" },
];

const secondaryLinks = [
  { label: "Budget", href: "/tarifs-partenariat/" },
  { label: "Boutique", href: "/boutique/" },
  { label: "Espace client", href: "https://client.yvexor.com/" },
];

export function SiteHeader({ root: _root = false }: { root?: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);

  return <header className="site-header v2-header">
    <div className="v2-header__inner">
      <a className="v2-header__brand" href="/" aria-label="YVEXOR — Accueil"><BrandLogo /></a>
      <nav className="v2-header__nav" aria-label="Navigation principale">
        {primaryLinks.map(({ label, href }) => <a key={href} href={href} aria-current={isActive(href) ? "page" : undefined}>{label}</a>)}
      </nav>
      <div className="v2-header__actions">
        <ThemeControl />
        <a className="header-cta" href="/contact/">On en parle ?</a>
        <details className="header-menu" onKeyDown={event => {
          if (event.key === "Escape") {
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary")?.focus();
          }
        }}>
          <summary aria-label="Ouvrir le menu"><span aria-hidden="true" className="v2-menu-icon" /></summary>
          <nav aria-label="Navigation mobile">
            {primaryLinks.map(({ label, href }) => <a key={href} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={event => event.currentTarget.closest("details")?.removeAttribute("open")}>{label}</a>)}
            <div className="v2-header__secondary">
              {secondaryLinks.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
            </div>
          </nav>
        </details>
      </div>
    </div>
  </header>;
}
