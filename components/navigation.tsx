"use client";

import {usePathname} from "next/navigation";

import {BrandLogo} from "./brand-logo";

import {ThemeControl} from "./theme-control";

import {Icon} from "./ui";

const links=[["Accueil","/"],["Sur mesure","/logiciel-sur-mesure/"],["Solutions","/#solutions"],["Boutique","/boutique/"],["YVEXOR","/histoire/"],["Contact","/contact/"]];

export function SiteHeader({root=false}:{root?:boolean}) {

 const pathname=usePathname();

 const active=(href:string)=>!href.includes("#")&&pathname.replace(/\/$/,"")===href.replace(/\/$/,"");

 return <header className="site-header"><a href="/" aria-label="YVEXOR — Accueil"><BrandLogo/></a><nav aria-label="Navigation principale">{links.map(([label,href])=><a href={href} key={href} aria-current={active(href)?"page":undefined}>{label}</a>)}</nav><a className="header-cta" href="/contact/">Parler de mon projet</a><ThemeControl/><details className="header-menu" onKeyDown={event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus()}}}><summary aria-label="Menu de navigation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></summary><nav aria-label="Accès rapides mobile">{[...links,["Tarifs","/tarifs-partenariat/"],["Espace client","https://client.yvexor.com/"]].map(([label,href])=><a href={href} key={href} onClick={e=>e.currentTarget.closest("details")?.removeAttribute("open")}>{label}</a>)}</nav></details></header>;

}

const mobile=[{label:"Accueil",href:"/",icon:"home"},{label:"Sur mesure",href:"/logiciel-sur-mesure/",icon:"solutions"},{label:"Matériel",href:"/boutique/",icon:"sectors"},{label:"Contact",href:"/contact/",icon:"project"}];

export function MobileTabBar({root=false}:{root?:boolean}) {

 const pathname=usePathname();

 return <nav className="mobile-tabs" aria-label="Navigation mobile" data-root={root}>{mobile.map(item=>{const active=item.href==="/"?pathname==="/":pathname.startsWith(item.href.replace(/\/$/,""));return <a href={item.href} key={item.href} className={active?"is-active":""} aria-current={active?(pathname.replace(/\/$/,"")===item.href.replace(/\/$/,"")?"page":"true"):undefined}><span><Icon name={item.icon}/></span><small>{item.label}</small></a>})}</nav>;

}
