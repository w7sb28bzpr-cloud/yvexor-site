import Link from "next/link";
import { ShopProduct, productUrl } from "../lib/boutique";
import s from "./boutique.module.css";
export function ProductCard({product:p}:{product:ShopProduct}) {
 const photo=p.images[0];
 return <article className={s.card} data-product={p.slug}>
  <Link href={productUrl(p)} className={s.cardImage} tabIndex={-1} aria-hidden="true"><img src={photo.small} srcSet={`${photo.small} 480w, ${photo.medium} 960w`} sizes="(max-width: 600px) 90vw, 30vw" alt="" width={photo.width} height={photo.height} loading="lazy"/></Link>
  <div className={s.cardBody}><span className={s.category}>{p.category}{p.category==="Robotique"?" · Projet sur mesure":""}</span><h2><Link href={productUrl(p)}>{p.name}</Link></h2><p>{p.shortDescription}</p><div className={s.cardBottom}><strong>{p.priceLabel}</strong><Link href={productUrl(p)} aria-label={`Voir le produit : ${p.name}`}>Voir le produit <span aria-hidden="true">↗</span></Link></div></div>
 </article>;
}
