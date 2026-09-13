type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><img src="/yvexor-logo-340.webp" alt="YVEXOR" width="340" height="220" decoding="async"/></span>}
