type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><img src="/yvexor-header-logo.jpg" alt="YVEXOR" width="800" height="160"/></span>}
