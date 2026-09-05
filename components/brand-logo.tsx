type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><img src="/yvexor-logo-officiel.jpg" alt="YVEXOR" width="655" height="470"/></span>}
