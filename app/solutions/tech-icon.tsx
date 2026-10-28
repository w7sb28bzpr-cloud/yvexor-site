import type { TechIconId } from "../../data/trades";

/** Glyphs for connected technologies, on the same 24px grid and stroke as BusinessToolIcon. */
export type SceneIconId = TechIconId | "door" | "bulb" | "thermo";

const paths: Record<SceneIconId, React.ReactNode> = {
  home: <><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M12 13.2v2.3"/><path d="M9.6 11.4a3.4 3.4 0 0 1 4.8 0"/></>,
  badge: <><rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M10 3.5v2h4v-2"/><circle cx="12" cy="11" r="2.3"/><path d="M8.5 17a3.7 3.7 0 0 1 7 0"/></>,
  barrier: <><path d="M4 20V9.5"/><rect x="2.5" y="17.5" width="3" height="2.5" rx=".6"/><path d="M4 11.5 21 7.5"/><path d="M8 10.6l1.2 1.4M12.3 9.6l1.2 1.4M16.6 8.6l1.2 1.4"/></>,
  camera: <><path d="M3.5 8.5 15 5l1.5 5-11.5 3.5z"/><path d="m16 7.5 4-1.5v5l-3.6-.6"/><path d="M8 13v3.5H4.5V20"/></>,
  sensor: <><circle cx="12" cy="12" r="2.2"/><path d="M8.3 8.3a5.2 5.2 0 0 0 0 7.4M15.7 8.3a5.2 5.2 0 0 1 0 7.4"/><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13"/></>,
  ai: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4z"/><path d="m18.5 15.5.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z"/></>,
  screen: <><rect x="3.5" y="4" width="17" height="12" rx="2"/><path d="M9 20h6M12 16v4"/><path d="M7.5 8.5h5M7.5 11.5h3"/></>,
  app: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/><path d="M9.5 7h5M9.5 10h5M9.5 13h3"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
  door:<><path d="M5.5 21V4.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1V21"/><path d="M3.5 21h17"/><circle cx="15" cy="12.5" r="1"/></>,
  bulb: <><path d="M9 17.5h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.6.5-1 1.2-1 2v1h-5v-1c0-.8-.4-1.5-1-2z"/></>,
  thermo: <><path d="M10 13.6V5a2 2 0 0 1 4 0v8.6a4 4 0 1 1-4 0z"/><path d="M12 9.5v6"/></>,
};

export function TechIcon({ icon, className }: { icon: SceneIconId; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[icon]}</svg>;
}
