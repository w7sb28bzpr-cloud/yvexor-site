import type { ReactNode } from "react";
import { ArrowIcon, ChevronIcon } from "./ui";

const icons: Record<string, ReactNode> = {
  cart: <><path d="M3 4h3l3 12h10l3-9H7"/><circle cx="10" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></>,
  restaurant: <><path d="M5 3v6c0 3 6 3 6 0V3M8 3v19M20 22V3c-5 3-5 11 0 11"/></>,
  bed: <><path d="M3 8v14M21 8v14M3 18h18M3 15h18V9H3z"/><path d="M6 9V5h5v4M13 9V5h5v4"/></>,
  home: <><path d="m2 11 10-9 10 9M5 9v13h14V9M9 22v-8h6v8"/></>,
  apps: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  network: <><circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="m8 10 8-4M8 14l8 4"/></>,
  cloud: <path d="M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-1 5.5 5.5 0 0 1 0 11H6Z"/>,
  printer: <><path d="M7 8V2h10v6M7 17H3V8h18v9h-4M7 14h10v8H7z"/><path d="M17 11h1"/></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4M9 6h6M9 10h6"/></>,
};
function SolutionIcon({name}:{name:string}) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>; }

const solutions = [
  { title: "Caisse & Commerce", description: "Solutions de caisse, gestion des ventes, stocks, clients et statistiques.", icon: "cart", image: "commerce", href: "/logiciel-caisse-marseille/" },
  { title: "Restauration", description: "Tables, commandes, cuisine, réservations et fidélité selon vos besoins.", icon: "restaurant", image: "restaurant", href: "/solutions-restaurants/" },
  { title: "Hôtels & Hébergement", description: "Réservations, séjour, équipes et chambres connectées : un ensemble adapté à votre établissement.", icon: "bed", image: "hotel", href: "/solutions-hotels/" },
  { title: "Domotique & Bâtiments", description: "Électricité et domotique de A à Z avec nos électriciens, ou adaptation de votre installation.", icon: "home", image: "maison", href: "/domotique-batiments/" },
  { title: "Applications métier", description: "Web, iPhone ou Android : vos outils métier, avec publication sur les stores selon le projet.", icon: "apps", image: "logiciel", href: "/applications-metier/" },
  { title: "Systèmes connectés", description: "Relier logiciels, messages, API et équipements, jusqu’au suivi de votre flotte.", icon: "network", image: null, href: "/systemes-connectes/" },
  { title: "Site & présence web", description: "Présenter votre activité, recevoir des demandes ou proposer un service en ligne.", icon: "apps", image: "web", href: "/site-presence-web/" },
  { title: "Automatisation & IA", description: "Messages, documents, données : relier vos outils et simplifier vos tâches selon vos règles.", icon: "network", image: "automation", href: "/automatisation-entreprise/" },
  { title: "Votre idée sur mesure", description: "Location, plateforme, nouveau service… Partons de votre idée, même si elle ne rentre dans aucune case.", icon: "cloud", image: "earth", href: "/logiciel-sur-mesure/" },
] as const;

export function SolutionDoors() {
  return <section className="section solution-doors" id="solutions" aria-labelledby="solution-doors-title">
    <header className="solution-doors-heading">
      <p className="eyebrow">Vous savez déjà ce qu’il vous faut ?</p>
      <h2 id="solution-doors-title">Accédez directement<br/>à votre <span>point de départ.</span></h2>
      <p>Vos messages, vos outils, vos idées : ces exemples sont des points de départ, pas des limites.<br/>Nous étudions ce qui peut être relié, simplifié ou créé sur mesure selon votre besoin.</p>
    </header>
    <div className="solution-doors-list">
      {solutions.map((solution,index)=><a className={`solution-door ${index===0?"solution-door-featured":""} solution-door-${solution.image||"network"}`} href={solution.href} key={solution.title} aria-labelledby={`solution-door-title-${index}`}>
        {solution.image ? <img className="solution-door-photo" src={solution.image==="automation"?"/yvexor-automation-768-v1.webp":solution.image==="earth"?"/yvexor-connected-earth-768-v1.webp":`/solution-${solution.image}-v1.webp`} width="960" height={solution.image==="restaurant"?1440:solution.image==="hotel"?540:640} alt="" loading="lazy" decoding="async"/> : <div className="solution-network-diagram" aria-hidden="true"><svg className="solution-network-links" viewBox="0 0 300 180"><path d="M65 50 150 125 235 50"/></svg><span className="network-printer"><SolutionIcon name="printer"/></span><span className="network-cloud"><SolutionIcon name="cloud"/></span><span className="network-phone"><SolutionIcon name="phone"/></span></div>}
        <div className="solution-door-badge"><span>{String(index+1).padStart(2,"0")}</span><div><SolutionIcon name={solution.icon}/></div></div>
        <div className="solution-door-copy"><h3 id={`solution-door-title-${index}`}>{solution.title}</h3><p>{solution.description}</p><span className="solution-door-discover">Découvrir <ArrowIcon/></span></div>
        <span className="solution-door-chevron"><ChevronIcon/></span>
      </a>)}
    </div>
    <p className="solution-photos-note">Visuels d’illustration, non contractuels. Les logiciels et équipements sont définis selon votre projet.</p>
  </section>;
}
