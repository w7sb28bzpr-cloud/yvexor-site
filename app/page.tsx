"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";

const services = [
  { n:"01", title:"Produit digital", text:"Sites, PWA et outils métier conçus pour convertir et durer.", tag:"Dès 39 € HT/mois" },
  { n:"02", title:"IA utile", text:"Des agents privés qui lisent, classent et accélèrent vos opérations.", tag:"Dès 350 € HT" },
  { n:"03", title:"Automatisation", text:"Moins de copier-coller. Plus de temps pour décider et vendre.", tag:"Sur devis" },
  { n:"04", title:"YVEXOR POS", text:"Une caisse claire, rapide et adaptée à votre métier.", tag:"Dès 49 € HT/mois" }
];
const projects = [
  { name:"YVEXOR POS", type:"Retail system", metric:"−38% de temps en caisse", color:"#c8ff33" },
  { name:"AI Core", type:"Private intelligence", metric:"7 h gagnées / semaine", color:"#9d7cff" },
  { name:"Hotel Flow", type:"Hospitality OS", metric:"24/7 sans friction", color:"#33d6ff" }
];

function Orb() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mount.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el=mount.current, scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(45,1,.1,100);
    camera.position.z=4;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); el.appendChild(renderer.domElement);
    const group=new THREE.Group(); scene.add(group);
    const geo=new THREE.IcosahedronGeometry(1.25,4); const mat=new THREE.MeshBasicMaterial({color:0xc8ff33,wireframe:true,transparent:true,opacity:.24}); group.add(new THREE.Mesh(geo,mat));
    const count=220, pos=new Float32Array(count*3); for(let i=0;i<count*3;i++) pos[i]=(Math.random()-.5)*5;
    const pgeo=new THREE.BufferGeometry(); pgeo.setAttribute("position",new THREE.BufferAttribute(pos,3)); group.add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xc8ff33,size:.018,transparent:true,opacity:.7})));
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix()}; resize();
    let id=0; const loop=()=>{ group.rotation.y+=.0018; group.rotation.x+=.0007; renderer.render(scene,camera); id=requestAnimationFrame(loop)}; loop();
    addEventListener("resize",resize); return()=>{cancelAnimationFrame(id);removeEventListener("resize",resize);renderer.dispose();el.replaceChildren()};
  },[]);
  return <div className="orb" ref={mount} aria-hidden="true"/>;
}

export default function Home() {
  const [sent,setSent]=useState(false); const [menu,setMenu]=useState(false);
  useEffect(()=>{
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    const ctx=gsap.context(()=>gsap.from("[data-rise]",{y:30,opacity:0,duration:.8,stagger:.08,ease:"power3.out"}));
    let lenis:{raf:(t:number)=>void;destroy:()=>void}|undefined; let raf=0;
    import("@studio-freight/lenis").then(({default:Lenis})=>{lenis=new Lenis({duration:1.05,smoothWheel:true}); const tick=(t:number)=>{lenis?.raf(t);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)});
    return()=>{ctx.revert();cancelAnimationFrame(raf);lenis?.destroy()};
  },[]);
  const submit=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault(); setSent(true); e.currentTarget.reset();};
  return <main>
    <header className="nav"><a className="logo" href="#top" aria-label="YVEXOR accueil"><i/>YVEXOR</a><nav className={menu?"open":""}><a href="#services" onClick={()=>setMenu(false)}>Services</a><a href="#tarifs" onClick={()=>setMenu(false)}>Tarifs</a><a href="#projets" onClick={()=>setMenu(false)}>Projets</a></nav><a className="navCta" href="#contact">Parler du projet <span>↗</span></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>{menu?"×":"="}</button></header>
    <section className="hero" id="top"><Orb/><div className="eyebrow" data-rise><span/> Agence tech · France entière</div><h1 data-rise>LA TECH<br/><em>QUI FAIT</em><br/>AVANCER.</h1><p className="lead" data-rise>Produits digitaux, IA et automatisation pour entreprises ambitieuses. Zéro théâtre. Un résultat mesurable.</p><div className="heroActions" data-rise><a className="primary" href="#contact">Démarrer un projet <b>↗</b></a><a className="textLink" href="#projets">Voir nos preuves ↓</a></div><div className="heroPrice" data-rise><small>POINT DE DÉPART</small><strong>39 €</strong><span>HT / mois<br/>Site professionnel</span></div><div className="scrollMark">SCROLL <i/></div></section>
    <section className="ticker" aria-label="Expertises"><div>WEBGL ✦ INTELLIGENCE ARTIFICIELLE ✦ PWA ✦ AUTOMATISATION ✦ PRODUIT DIGITAL ✦ WEBGL ✦ INTELLIGENCE ARTIFICIELLE ✦ PWA ✦</div></section>
    <section className="services section" id="services"><div className="sectionTop"><div><span className="index">01 / SERVICES</span><h2>UNE TECH<br/>QUI SERT <em>VRAIMENT.</em></h2></div><p>On ne vend pas des features. On retire les frictions qui coûtent du temps, des clients et de l’énergie.</p></div><div className="serviceGrid">{services.map((s,i)=><motion.article key={s.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.06}}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p><b>{s.tag}</b><details><summary>Détails +</summary><p>Audit court, périmètre clair, livraison rapide et suivi humain. Chaque fonction doit justifier sa place.</p></details></motion.article>)}</div></section>
    <section className="pricing section" id="tarifs"><span className="index">02 / TARIFS</span><div className="pricingHead"><h2>DES PRIX.<br/><em>PAS DE MYSTÈRE.</em></h2><p>Commencez petit. Faites évoluer uniquement ce qui crée de la valeur.</p></div><div className="priceGrid"><article><small>PRÉSENCE</small><h3>Site pro</h3><div><strong>39</strong><sup>€ HT</sup><span>/ mois</span></div><p>Design, hébergement, maintenance et SEO essentiel.</p><a href="#contact">Choisir cette base ↗</a></article><article className="featured"><small>LE PLUS CHOISI</small><h3>Digital Partner</h3><div><strong>350</strong><sup>€ HT</sup><span>/ mois</span></div><p>Développement continu, corrections et évolutions cadrées.</p><a href="#contact">Accélérer maintenant ↗</a></article><article><small>PRODUIT</small><h3>Sur mesure</h3><div><strong>5 400</strong><sup>€ HT</sup><span>achat</span></div><p>Conception, développement, livraison et formation.</p><a href="#contact">Cadrer le produit ↗</a></article></div><p className="fine">Tarifs indicatifs hors taxes. Les intégrations, matériels et services tiers sont chiffrés avant engagement.</p></section>
    <section className="projects section" id="projets"><div className="sectionTop"><div><span className="index">03 / PORTFOLIO</span><h2>ÇA TOURNE.<br/><em>ÇA PERFORME.</em></h2></div><p>Des interfaces rapides, installables et pensées pour le terrain — pas pour une galerie.</p></div><div className="projectList">{projects.map((p,i)=><article key={p.name} style={{"--accent":p.color} as React.CSSProperties}><span>0{i+1}</span><div className="projectVisual"><div className="miniUi"><i/><i/><i/></div><b>{p.metric}</b></div><div><small>{p.type}</small><h3>{p.name}</h3></div><span className="arrow">↗</span></article>)}</div></section>
    <section className="contact section" id="contact"><div className="contactCopy"><span className="index">04 / CONTACT</span><h2>ON LE<br/><em>CONSTRUIT ?</em></h2><p>Décrivez l’objectif. Réponse directe, sans pitch interminable.</p><a href="tel:+33756913013">07 56 91 30 13 ↗</a></div><form onSubmit={submit}><label>Votre nom<input name="name" required placeholder="Prénom, nom"/></label><label>Votre e-mail<input name="email" type="email" required placeholder="vous@entreprise.fr"/></label><label>Votre entreprise<input name="company" required placeholder="Nom de l’entreprise"/></label><label>Votre besoin<select name="need" required defaultValue=""><option value="" disabled>Choisir un sujet</option><option>Site / PWA</option><option>IA / automatisation</option><option>YVEXOR POS</option><option>Produit sur mesure</option></select></label><label>Votre message<textarea name="message" required placeholder="Le résultat que vous voulez obtenir…" rows={3}/></label><button className="primary" type="submit">{sent?"Message prêt ✓":"Envoyer la demande ↗"}</button><small>En envoyant, vous acceptez d’être recontacté par YVEXOR.</small></form></section>
    <footer><a className="logo" href="#top"><i/>YVEXOR</a><p>Technologie utile. Expérience radicalement claire.</p><div><a href="#services">Services</a><a href="#tarifs">Tarifs</a><a href="#contact">Contact</a></div><span>© 2026 YVEXOR</span></footer>
    <div className="mobileCta"><a href="tel:+33756913013">Appeler</a><a href="#contact">Mon projet ↗</a></div>
  </main>;
}
