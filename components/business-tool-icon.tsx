import type { ToolIconId } from "../data/content-types";

const iconPaths: Record<ToolIconId, React.ReactNode> = {
  "cash-register": <><path d="M4 10h16v10H4z"/><path d="M7 10V6h10v4M8 14h3m2 0h3M8 17h2m3 0h3M7 20v2m10-2v2"/><path d="M6 6h2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
  workflow: <><rect x="3.5" y="4" width="7" height="6" rx="1.5"/><rect x="13.5" y="14" width="7" height="6" rx="1.5"/><path d="M10.5 7h3a2 2 0 0 1 2 2v5m-5 3H7a2 2 0 0 1-2-2v-5"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1zM16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20h-4"/></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7 3v4m10-4v4M4 9h16M8 13h2m4 0h2m-8 4h2m4 0h2"/></>,
  clipboard: <><rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8 10h8m-8 4h8m-8 4h5"/></>,
  wrench: <><path d="M14.5 6.5a5 5 0 0 0-6.7 6.7l-4.6 4.6a2 2 0 0 0 2.8 2.8l4.6-4.6a5 5 0 0 0 6.7-6.7l-3.1 3.1-3.5-3.5z"/></>,
  "life-buoy": <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m5.6 5.6 3.9 3.9m5 5 3.9 3.9m0-12.8-3.9 3.9m-5 5-3.9 3.9"/></>,
  receipt: <><path d="M6 3.5 8 5l2-1.5L12 5l2-1.5L16 5l2-1.5v17l-2-1.5-2 1.5-2-1.5-2 1.5L8 19l-2 1.5zM9 9h6m-6 4h6m-6 4h3"/></>,
  calculator: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7.5 6.5h9v4h-9zm0 8h2m4 0h2m-8 3h2m4 0h2"/></>,
  boxes: <><path d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5M12 12v9"/></>,
  truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  repeat: <><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/></>,
  restaurant: <><path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3m-3 7v11m10-18v18m0-18c3 2 3 6 0 8"/></>,
  trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4"/></>,
  "shopping-cart": <><path d="M3 4h2l2.3 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.5L22 8H6"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>,
  sparkles: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z"/></>,
  chart: <><path d="M4 20V4m0 16h17M7 16l4-5 4 2 5-7"/><path d="M17 6h3v3"/></>,
};

export function BusinessToolIcon({ icon, className }: { icon: ToolIconId; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{iconPaths[icon]}</svg>;
}
