"use client";
import { useEffect, useState } from "react";
import styles from "./material-catalogue.module.css";

const origin = "https://client.yvexor.com";
type Product = {name:string;slug:string;sku:string;category:string;short_description:string;description:string;price_cents:number;credits_cents:number;tax_percent:string;shipping_cents:number;features:Record<string,string>;availability:string;available:boolean;images:{url:string;alt:string}[];url:string};
type Catalogue = {products:Product[];categories:{name:string;slug:string}[];pages:number;page:number};
// API amounts are integers. Formatting is not used for any financial calculation.
const amount = (cents:number) => `${Math.trunc(cents/100).toLocaleString("fr-FR")},${String(cents%100).padStart(2,"0")}`;

export function MaterialCatalogue({featured=false}:{featured?:boolean}) {
  const [data,setData]=useState<Catalogue|null>(null),[error,setError]=useState(false),[query,setQuery]=useState(""),[category,setCategory]=useState(""),[page,setPage]=useState(1);
  const [slug,setSlug]=useState("");
  useEffect(()=>{if(!featured)setSlug(new URLSearchParams(location.search).get("article")||"");},[featured]);
  useEffect(()=>{const controller=new AbortController();setError(false);setData(null);
    const params=new URLSearchParams({q:query,category,page:String(page)});if(featured)params.set("featured","1");if(slug)params.set("slug",slug);
    fetch(`${origin}/api/catalogue/?${params}`,{signal:controller.signal,credentials:"omit",cache:"no-store"})
      .then(r=>{if(!r.ok)throw Error();return r.json();}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(true);});
    return()=>controller.abort();
  },[featured,query,category,page,slug]);
  return <section className={styles.catalogue} aria-label="Catalogue matériel">
    {!featured&&!slug&&<form className={styles.filters} onSubmit={e=>{e.preventDefault();setPage(1);setQuery(String(new FormData(e.currentTarget).get("q")||""));}}>
      <label>Rechercher du matériel<input name="q" maxLength={160} type="search"/></label>
      <label>Catégorie<select value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}}><option value="">Toutes</option>{data?.categories.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><button type="submit">Rechercher</button>
    </form>}
    {error?<p role="status">Le catalogue est momentanément indisponible. <a href={`${origin}/catalogue/`}>Ouvrir la boutique YVEXOR</a></p>:!data?<p role="status">Chargement du catalogue…</p>:<>
      <div className={styles.grid}>{data.products.map(p=><article key={p.slug} className={styles.card}>
        {p.images[0]&&<img src={origin+p.images[0].url} alt={p.images[0].alt} width={1000} height={830} loading="lazy"/>}
        <div><p className="eyebrow">{p.category}</p><h2>{p.name}</h2><p>{p.short_description}</p><p className={styles.price}>{amount(p.price_cents)} € TTC</p><p>{amount(p.credits_cents)} crédits YVEXOR · TVA {p.tax_percent} % incluse</p><p>{p.shipping_cents===0?"Livraison offerte":`Livraison : ${amount(p.shipping_cents)} € par unité`}</p><p>{p.availability}</p>
        {slug&&<><p>{p.description}</p><p>Référence : {p.sku}</p><dl>{Object.entries(p.features).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>{p.images.slice(1).map(photo=><img key={photo.url} src={origin+photo.url} alt={photo.alt} width={1000} height={830} loading="lazy"/>)}</>}
        <div className={styles.actions}>{!slug&&<a href={`/materiel/?article=${encodeURIComponent(p.slug)}`}>Voir l’article →</a>}<a className="action-link primary" href={`${origin}/auth/login/?next=${encodeURIComponent(p.url)}`}>{p.available?"Se connecter pour acheter":"Consulter dans mon espace"}</a></div></div>
      </article>)}</div>{data.products.length===0&&<p>Aucun article disponible pour cette sélection.</p>}
      {!featured&&!slug&&data.pages>1&&<div className={styles.actions}><button disabled={page<=1} onClick={()=>setPage(page-1)}>Précédent</button><span>{page} / {data.pages}</span><button disabled={page>=data.pages} onClick={()=>setPage(page+1)}>Suivant</button></div>}
    </>}
    {featured?<p><a className="action-link" href="/materiel/">Voir le matériel →</a></p>:slug?<p><a href="/materiel/">Tous les articles</a></p>:null}
    <noscript><a href={`${origin}/catalogue/`}>Consulter le catalogue dans l’espace YVEXOR</a></noscript>
  </section>;
}
