import type { ToolIconId } from "../data/content-types";

const iconPaths: Record<ToolIconId, React.ReactNode> = {
  "cash-register": <><path d="M4 10h16v10H4z"/><path d="M7 10V6h10v4M8 14h3m2 0h3M8 17h2m3 0h3M7 20v2m10-2v2"/><path d="M6 6h2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
  workflow: <><rect x="3.5" y="4" width="7" height="6" rx="1.5"/><rect x="13.5" y="14" width="7" height="6" rx="1.5"/><path d="M10.5 7h3a2 2 0 0 1 2 2v5m-5 3H7a2 2 0 0 1-2-2v-5"/></>,
};

export function BusinessToolIcon({ icon, className }: { icon: ToolIconId; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{iconPaths[icon]}</svg>;
}
