import { existingSolutions } from "../data/public-offer";
import { SmsLink } from "./sms-link";
import { CommercePricing } from "./commerce-pricing";

export function ExistingSolutionDetail({restaurant=false}:{restaurant?:boolean}) {
  const solution=existingSolutions[restaurant?1:0];
  return <section className="section existing-section" aria-label={`Détails ${solution.name}`}>
    <article className="existing-card existing-primary">
      <img src={`/solution-${restaurant?"restaurant":"commerce"}-v1.webp`} width="960" height={restaurant?1440:640} alt="" style={{width:"100%",height:"240px",objectFit:"cover",borderRadius:"20px",marginBottom:"24px"}}/>
      <div className="solution-labels"><span>{solution.status}</span><span>Adaptable</span></div>
      <h2>{solution.name}</h2>
      {"startingPriceLabel" in solution&&<strong className="existing-price">{solution.startingPriceLabel}</strong>}
      <p className="existing-lead">{solution.problem}</p><p>{solution.clients}</p>
      <div className="capability-cloud" aria-label="Fonctions possibles">{solution.capabilities.map(item=><span key={item}>{item}</span>)}</div>
      <p className="configuration-note">Les fonctions disponibles dépendent de la configuration retenue. Le matériel, les options, les intégrations et la mise en service sont étudiés selon votre besoin.</p>
      <div className="model-line">{solution.models.map(model=><span key={model}>{model}</span>)}</div>
      <SmsLink className="action-link primary">{solution.cta} →</SmsLink>
      <p className="configuration-note">Photo d’illustration, non contractuelle : elle ne représente pas nécessairement le logiciel ou le matériel proposé.</p>
    </article>
    {!restaurant&&<CommercePricing/>}
    <a href="/#solutions" className="action-link secondary" style={{marginTop:"24px"}}>← Toutes les solutions</a>
  </section>;
}
