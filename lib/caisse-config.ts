import catalogue from "../data/caisses.json";
import {professionBySlug} from "../data/caisse-professions";
export type CaisseSelection={profession:string;plan:string;hardware:string;website:boolean;mobile:boolean;kiosk:number;kitchen:number;tpe:boolean;license:boolean};
export const defaultSelection=(profession="commerce"):CaisseSelection=>({profession,plan:professionBySlug[profession]?.family==="salon"?"salon":"stock",hardware:"own",website:false,mobile:false,kiosk:0,kitchen:0,tpe:false,license:false});
export function normalizeSelection(raw:Partial<CaisseSelection>):CaisseSelection{
 const profession=professionBySlug[raw.profession??""]?raw.profession!:"commerce",family=professionBySlug[profession].family;
 const count=(n:unknown)=>typeof n==="number"&&Number.isFinite(n)?Math.max(0,Math.min(20,Math.floor(n))):0;
 return {profession,plan:catalogue.plans.find(p=>p.id===raw.plan&&p.families.includes(family))?.id??(family==="salon"?"salon":"stock"),hardware:raw.hardware==="post"?"post":"own",website:raw.website===true&&family!=="other",mobile:raw.mobile===true&&family==="snack",kiosk:family==="snack"?count(raw.kiosk):0,kitchen:family==="snack"?count(raw.kitchen):0,tpe:raw.tpe===true,license:raw.license===true};
}
export function selectionTotals(selection:CaisseSelection){
 const s=normalizeSelection(selection),family=professionBySlug[s.profession].family;
 const plan=catalogue.plans.find(p=>p.id===s.plan)!;
 const lines=catalogue.options.filter(o=>o.families.includes(family)).map(o=>({name:o.name,quantity:o.id==="website"?Number(s.website):o.id==="mobile"?Number(s.mobile):o.id==="kiosk"?s.kiosk:s.kitchen,monthly:o.monthly})).filter(o=>o.quantity>0);
 return {base:family==="other"?null:plan.monthly,monthly:family==="other"||s.license?null:plan.monthly+lines.reduce((n,o)=>n+o.quantity*o.monthly,0),hardware:catalogue.hardware.find(h=>h.id===s.hardware)!.once,lines};
}
export function selectionQuery(selection:CaisseSelection){const s=normalizeSelection(selection);return new URLSearchParams(Object.entries(s).map(([k,v])=>[k,String(v)])).toString();}
