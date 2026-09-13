import { areas, homeDescription, siteUrl } from "../lib/seo";

export function JsonLd({data}:{data:unknown}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
export function OrganizationData() {
  return <JsonLd data={{"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":`${siteUrl}/#organization`,name:"YVEXOR",url:siteUrl+"/",logo:`${siteUrl}/yvexor-logo-officiel-v2.jpg`,telephone:"+33756913013",description:homeDescription,areaServed:areas},
    {"@type":"WebSite","@id":`${siteUrl}/#website`,name:"YVEXOR",url:siteUrl+"/",inLanguage:"fr-FR",publisher:{"@id":`${siteUrl}/#organization`}}
  ]}}/>;
}
export function PageData({path,title,description,service,faq,type="WebPage"}:{path:string;title:string;description:string;service?:string;faq?:{title:string;text:string}[];type?:string}) {
  const url=siteUrl+path;
  const graph:Record<string,unknown>[]=[{"@type":type,"@id":url+"#webpage",url,name:title,description,inLanguage:"fr-FR",isPartOf:{"@id":siteUrl+"/#website"},about:{"@id":siteUrl+"/#organization"}}];
  if(path!=="/")graph.push({"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Accueil",item:siteUrl+"/"},{"@type":"ListItem",position:2,name:title,item:url}]});
  if(service)graph.push({"@type":"Service","@id":url+"#service",name:service,description,url,provider:{"@id":siteUrl+"/#organization"},areaServed:areas});
  // Semantic FAQ markup only; no promise of a Google FAQ rich result.
  if(faq?.length)graph.push({"@type":"FAQPage","@id":url+"#faq",mainEntity:faq.map(q=>({"@type":"Question",name:q.title,acceptedAnswer:{"@type":"Answer",text:q.text}}))});
  return <JsonLd data={{"@context":"https://schema.org","@graph":graph}}/>;
}
