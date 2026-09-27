"use client";
import {useRef,useState} from "react";
import {ShopProduct} from "../lib/boutique";
import s from "./boutique.module.css";
export function ProductGallery({product}:{product:ShopProduct}){
 const [index,setIndex]=useState(0),[zoomed,setZoomed]=useState(false),dialog=useRef<HTMLDialogElement>(null);const photo=product.images[index];
 return <div className={s.gallery}><button className={s.mainPhoto} onClick={()=>{setZoomed(true);dialog.current?.showModal();}} aria-label="Agrandir l’image"><img src={photo.medium} srcSet={`${photo.small} 480w, ${photo.medium} 960w, ${photo.src} ${photo.width}w`} sizes="(max-width: 800px) 95vw, 50vw" alt={photo.alt} width={photo.width} height={photo.height}/><span>Agrandir ↗</span></button>{product.images.length>1&&<div className={s.thumbnails} aria-label="Galerie produit">{product.images.map((p,i)=><button key={p.src} aria-label={`Voir la vue ${i+1}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={p.small} alt={p.alt} width={96} height={80}/></button>)}</div>}<dialog ref={dialog} className={s.zoom} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-label={photo.alt}><button autoFocus onClick={()=>dialog.current?.close()}>Fermer ×</button>{zoomed&&<img src={photo.src} alt={photo.alt}/>}</dialog></div>;
}
