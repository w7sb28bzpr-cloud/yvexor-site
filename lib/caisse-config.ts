import catalogue from "../data/caisses.json";
import {professionBySlug} from "../data/caisse-professions";
export type CaisseSelection={profession:string;plan:string;hardware:string;website:boolean;mobile:boolean;kiosk:number;kitchen:number;tpe:boolean;license:boolean};
type Plan=(typeof catalogue.plans)[number]&{fromPrice?:boolean};
const plansFor=(family:string)=>(catalogue.plans as Plan[]).filter(p=>p.families.includes(family));
// The recommended plan of the family is the starting point, as on the offer pages.
const defaultPlan=(family:string)=>{const plans=plansFor(family);return (plans.find(p=>p.recommended)??plans[0])?.id??"";};
// Options only exist when the catalogue prices them; the catalogue currently includes them in the plans.
const hasOption=(id:string)=>(catalogue.options as {id:string}[]).some(o=>o.id===id);
export const defaultSelection=(profession="commerce"):CaisseSelection=>({profession,plan:defaultPlan(professionBySlug[profession]?.family??"commerce"),hardware:"own",website:false,mobile:false,kiosk:0,kitchen:0,tpe:false,license:false});
export function normalizeSelection(raw:Partial<CaisseSelection>):CaisseSelection{
 const profession=professionBySlug[raw.profession??""]?raw.profession!:"commerce",family=professionBySlug[profession].family;
 const count=(n:unknown)=>typeof n==="number"&&Number.isFinite(n)?Math.max(0,Math.min(20,Math.floor(n))):0;
 return {profession,plan:plansFor(family).find(p=>p.id===raw.plan)?.id??defaultPlan(family),hardware:catalogue.hardware.some(h=>h.id===raw.hardware)?raw.hardware!:"own",website:raw.website===true&&family!=="other"&&hasOption("website"),mobile:raw.mobile===true&&family==="snack"&&hasOption("mobile"),kiosk:family==="snack"&&hasOption("kiosk")?count(raw.kiosk):0,kitchen:family==="snack"&&hasOption("kitchen")?count(raw.kitchen):0,tpe:raw.tpe===true,license:raw.license===true};
}
export function selectionTotals(selection:CaisseSelection){
 const s=normalizeSelection(selection),family=professionBySlug[s.profession].family;
 const plan=(catalogue.plans as Plan[]).find(p=>p.id===s.plan);
 const options=catalogue.options as {id:string;name:string;monthly:number;families:string[]}[];
 const lines=options.filter(o=>o.families.includes(family)).map(o=>({name:o.name,quantity:o.id==="website"?Number(s.website):o.id==="mobile"?Number(s.mobile):o.id==="kiosk"?s.kiosk:s.kitchen,monthly:o.monthly})).filter(o=>o.quantity>0);
 const quoted=family==="other"||!plan||s.license||plan.fromPrice===true;
 return {base:family==="other"||!plan?null:plan.monthly,fromPrice:plan?.fromPrice===true,monthly:quoted?null:plan.monthly+lines.reduce((n,o)=>n+o.quantity*o.monthly,0),hardware:catalogue.hardware.find(h=>h.id===s.hardware)!.once,lines};
}
export function selectionQuery(selection:CaisseSelection){const s=normalizeSelection(selection);return new URLSearchParams(Object.entries(s).map(([k,v])=>[k,String(v)])).toString();}
