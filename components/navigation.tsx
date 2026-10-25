"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { ThemeControl } from "./theme-control";

const primaryLinks = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "/solutions/" },
  { label: "Applications", href: "/applications/" },
  { label: "Métiers", href: "/metiers/" },
  { label: "Projets", href: "/projets/" },
  { label: "À propos", href: "/a-propos/" },
  { label: "Contact", href: "/contact/" },
];

const secondaryLinks = [
  { label: "On en parle ?", href: "/contact/" },
  { label: "Budget", href: "/tarifs-partenariat/" },
  { label: "Boutique", href: "/boutique/" },
  { label: "Questions fréquentes", href: "/faq/" },
  { label: "Espace client", href: "https://client.yvexor.com/" },
];

export function SiteHeader({ root: _root = false, immersiveHero = false }: { root?: boolean; immersiveHero?: boolean }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!immersiveHero) return;
    const update = () => setIsScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [immersiveHero]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);

  return <header className={`site-header v2-header${immersiveHero ? " v2-header--immersive" : ""}${isScrolled ? " is-scrolled" : ""}`}>
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
