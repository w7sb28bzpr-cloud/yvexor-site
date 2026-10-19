export type ThemeMode = "auto" | "light" | "dark";
export function resolveTheme(mode: ThemeMode, hour: number) {
  return mode === "auto" ? (hour >= 7 && hour < 19 ? "light" : "dark") : mode;
}
export function readThemeMode(): ThemeMode {
  try { const value = localStorage.getItem("yvexor-theme"); return value === "light" || value === "dark" ? value : "auto"; } catch { return "auto"; }
}
export const themeBootstrap = `(()=>{let m='auto';try{m=localStorage.getItem('yvexor-theme')||'auto'}catch{}const h=new Date().getHours();const t=m==='light'||m==='dark'?m:h>=7&&h<19?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()`;
