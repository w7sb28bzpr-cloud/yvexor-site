"use client";
import {useState} from "react";
import {ShopProduct} from "../lib/boutique";
import {SmsLink} from "./sms-link";
import s from "./boutique.module.css";
export function ProductInquiry({product:p}:{product:ShopProduct}){
 const [quantity,setQuantity]=useState(1);
 return <div className={s.inquiry}><label>Quantité souhaitée<input type="number" min={1} max={999} value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(999,Math.trunc(Number(e.target.value)||1))))}/></label><SmsLink className={s.cta} message={`Bonjour YVEXOR, je souhaite un devis pour ${p.name}, quantité : ${quantity}. Prix catalogue : ${p.priceLabel}. https://yvexor.com/boutique/${p.slug}/`}>{p.category==="Robotique"?"Étudier mon projet sur mesure":"Demander un devis par SMS"}</SmsLink><a href="tel:+33756913013">Ou appelez-nous au 07 56 91 30 13</a><p>Configuration, disponibilité, livraison et conditions tarifaires confirmées avec votre devis.</p></div>;
}
