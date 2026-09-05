type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><img src="/yvexor-logo-officiel-v2.jpg" alt="YVEXOR" width="680" height="440"/></span>}
