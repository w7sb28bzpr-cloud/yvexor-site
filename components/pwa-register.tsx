"use client";
import { useEffect } from "react";
export function PwaRegister(){useEffect(()=>{if(!("serviceWorker" in navigator))return;const register=()=>navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"}).then(r=>r.update()).catch(()=>undefined);if(document.readyState==="complete")void register();else window.addEventListener("load",register,{once:true});return()=>window.removeEventListener("load",register)},[]);return null}
