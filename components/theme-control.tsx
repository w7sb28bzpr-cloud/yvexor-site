"use client";
import {useEffect,useRef,useState} from "react";
import {readThemeMode,resolveTheme,type ThemeMode} from "../lib/theme";
export function ThemeControl(){
 const [mode,setMode]=useState<ThemeMode>("auto");
 const current=useRef<ThemeMode>("auto");
 useEffect(()=>{
  current.current=readThemeMode();setMode(current.current);
  let timer:ReturnType<typeof setTimeout>;
  const refresh=()=>{clearTimeout(timer);const now=new Date();const theme=resolveTheme(current.current,now.getHours());document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const next=new Date(now);next.setHours(now.getHours()<7?7:now.getHours()<19?19:31,0,0,0);timer=setTimeout(refresh,next.getTime()-now.getTime());};
  const sync=()=>{current.current=readThemeMode();setMode(current.current);refresh();};
  refresh();window.addEventListener("storage",sync);document.addEventListener("visibilitychange",refresh);
  return()=>{clearTimeout(timer);window.removeEventListener("storage",sync);document.removeEventListener("visibilitychange",refresh);};
 },[]);
 function choose(value:ThemeMode){current.current=value;setMode(value);try{localStorage.setItem("yvexor-theme",value)}catch{}const theme=resolveTheme(value,new Date().getHours());document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}
 return <details className="theme-control"><summary aria-label="Choisir le thème">◐</summary><div><strong>Apparence</strong>{([["auto","Automatique · 7 h – 19 h"],["light","Clair"],["dark","Sombre"]] as const).map(([value,label])=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>choose(value)}>{label}</button>)}</div></details>;
}
