"use client";
import{CSSProperties,useEffect,useState}from"react";import{usePathname}from"next/navigation";import{BrandLogo}from"./brand-logo";import{Icon}from"./ui";
const items=[{label:"Accueil",href:"#accueil",icon:"home"},{label:"Solutions",href:"#solutions",icon:"solutions"},{label:"Projet",href:"/contact/",icon:"project",featured:true},{label:"Exemples",href:"#exemples",icon:"sectors"},{label:"YVEXOR",href:"#yvexor",icon:"brand"}];
export function SiteHeader({root=false}:{root?:boolean}) {
  const [scrolled,setScrolled]=useState(false);
  const to=(hash:string)=>root&&hash.startsWith("#")?`/${hash}`:hash;
  const links=[["Solutions","#solutions"],["Caisse & Commerce","/logiciel-caisse-marseille/"],["Budgets","#budgets"],["Exemples","#exemples"],["YVEXOR","#yvexor"]];
  useEffect(()=>{const onScroll=()=>setScrolled(scrollY>12);onScroll();addEventListener("scroll",onScroll,{passive:true});return()=>removeEventListener("scroll",onScroll)},[]);
  return <header className={`site-header ${scrolled?"is-scrolled":""}`}>
    <a href={to("#accueil")} aria-label="YVEXOR — Accueil"><BrandLogo/></a>
    <nav aria-label="Navigation principale">{links.map(([label,href])=><a key={href} href={to(href)}>{label}</a>)}</nav>
    <a className="header-cta" href={to("/contact/")}>Parler de mon projet</a>
    <details className="header-menu" onKeyDown={event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus()}}}>
      <summary aria-label="Menu de navigation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></summary>
      <nav aria-label="Accès rapides mobile">{links.map(([label,href])=><a key={href} href={to(href)} onClick={event=>{event.currentTarget.closest("details")?.removeAttribute("open")}}>{label}</a>)}</nav>
    </details>
  </header>;
}
export function MobileTabBar({root=false}:{root?:boolean}){const pathname=usePathname();const[active,setActive]=useState("#accueil");const selected=root?(pathname==="/contact/"||pathname==="/contact" ? "/contact/" : "#solutions"):active;useEffect(()=>{if(root)return;const ids=items.filter(i=>i.href.startsWith("#")).map(i=>i.href.slice(1)),observer=new IntersectionObserver(es=>{const visible=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible)setActive(`#${visible.target.id}`)},{rootMargin:"-30% 0px -55%",threshold:[0,.2,.5]});ids.forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});return()=>observer.disconnect()},[root]);return <nav className="mobile-tabs" aria-label="Navigation mobile"><i className="mobile-active-light" style={{"--active-index":items.findIndex(item=>item.href===selected)} as CSSProperties}/>{items.map(item=><a key={item.href} href={root&&item.href.startsWith("#")?`/${item.href}`:item.href} className={`${selected===item.href?"is-active":""} ${item.featured?"is-featured":""}`} aria-current={!root&&selected===item.href?"location":root&&selected===item.href&&item.href==="/contact/"?"page":undefined} onClick={()=>setActive(item.href)}><span><Icon name={item.icon}/></span><small>{item.label}</small></a>)}</nav>}
