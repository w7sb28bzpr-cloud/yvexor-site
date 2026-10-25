import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPage } from "../../components/seo-page";
import { seoPageBySlug, seoPages } from "../../data/seo-pages";
import { pageMetadata } from "../../lib/seo";
import { CaissePage } from "../../components/caisse-page";
import { IndustryDetailPage } from "../../components/industry-detail-page";
import { industries } from "../../data/industries";

export const dynamicParams=false;
export function generateStaticParams(){return seoPages.map(({slug})=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params,page=seoPageBySlug[slug];
  if(!page)return {};
  return pageMetadata(`/${slug}/`,page.metaTitle??page.title,page.description);
}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params,page=seoPageBySlug[slug];if(!page)notFound();if(slug==="logiciel-caisse-marseille")return <CaissePage local/>;const industry=industries.find((item)=>item.canonicalPath===`/${slug}/`);return industry?<IndustryDetailPage industry={industry} page={page}/>:<SeoPage page={page}/>;}
