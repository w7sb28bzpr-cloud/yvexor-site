"use client";

export function BackLink(){return <a className="detail-back" href="/#solutions" onClick={event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  // Only return within this site; a direct/external arrival has a useful fallback.
  if(document.referrer&&new URL(document.referrer).origin===location.origin&&history.length>1){event.preventDefault();history.back();}
}}>← Retour</a>}
