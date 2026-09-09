import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage } from "../../components/seo-page";
import { seoPageBySlug, seoPages } from "../../data/seo-pages";

export const dynamicParams=false;
export function generateStaticParams(){return seoPages.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params,page=seoPageBySlug[slug];
  if(!page)return {};
  const url=`https://yvexor.com/${slug}/`;
  return {title:page.title,description:page.description,alternates:{canonical:url},openGraph:{title:page.title,description:page.description,url,type:"website",siteName:"YVEXOR",images:[{url:"https://yvexor.com/yvexor-social-v1.jpg",width:1200,height:630,alt:"YVEXOR — Solutions digitales sur mesure"}]},twitter:{card:"summary_large_image",title:page.title,description:page.description,images:["https://yvexor.com/yvexor-social-v1.jpg"]}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params,page=seoPageBySlug[slug];if(!page)notFound();return <SeoPage page={page}/>;}
