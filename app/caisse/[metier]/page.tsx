import {notFound} from "next/navigation";
import {CaissePage} from "../../../components/caisse-page";
import {professions,professionBySlug} from "../../../data/caisse-professions";
import {pageMetadata} from "../../../lib/seo";
export const dynamicParams=false;
export function generateStaticParams(){return professions.map(p=>({metier:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{metier:string}>}){const {metier}=await params,p=professionBySlug[metier];return p?pageMetadata(`/caisse/${metier}/`,`Caisse ${p.name} | YVEXOR`,p.intro):{}}
export default async function Page({params}:{params:Promise<{metier:string}>}){const {metier}=await params,p=professionBySlug[metier];if(!p)notFound();return <CaissePage profession={p}/>}
