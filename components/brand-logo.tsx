type BrandLogoProps={compact?:boolean;className?:string};
export function BrandLogo({compact=false,className=""}:BrandLogoProps){return <span className={`brand-logo ${compact?"brand-logo--compact":""} ${className}`.trim()}><span className="brand-logo__crop" aria-hidden="true"/>{!compact&&<span className="brand-logo__name">YVEXOR</span>}<span className="sr-only">YVEXOR</span></span>}
