type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><img src={compact?"/app-icon-512.png":"/yvexor-header-logo.jpg"} alt="YVEXOR" width={compact?512:800} height={compact?512:160}/></span>}
