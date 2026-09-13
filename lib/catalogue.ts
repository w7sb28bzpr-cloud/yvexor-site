export type Product = {name:string;slug:string;sku:string;category:string;short_description:string;description:string;price_cents:number;credits_cents:number;tax_percent:string;shipping_cents:number;features:Record<string,string>;availability:string;available:boolean;images:{url:string;alt:string}[];url:string};
export type Catalogue = {products:Product[];categories:{name:string;slug:string}[];pages:number;page:number};

// Build-time public snapshot from the same source as the live catalogue.
// Fail the build on outage rather than publish an empty, unindexable catalogue.
export async function getCatalogue(featured=false):Promise<Catalogue>{
 const response=await fetch(`https://client.yvexor.com/api/catalogue/${featured?'?featured=1':''}`,{cache:"force-cache",signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error(`Catalogue unavailable at build time: ${response.status}`);
 const data=await response.json();
 if(!Array.isArray(data.products)||!Array.isArray(data.categories))throw new Error("Invalid catalogue response");
 return data;
}
