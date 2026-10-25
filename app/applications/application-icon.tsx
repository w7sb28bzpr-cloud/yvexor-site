import type { PublicBusinessTool } from "../../data/content-types";
import { BusinessToolIcon } from "../../components/business-tool-icon";

/** Library-only glyphs for entries whose shared icon is used more than once in this catalogue
 * (receipt, boxes, workflow, cart, truck). Same 24px grid and stroke as BusinessToolIcon, so
 * the set stays coherent; every other entry keeps its shared icon from the data. */
const libraryGlyphs: Record<string, React.ReactNode> = {
  "quotes-sales": <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.5M14 3l4 4v3.5M14 3v4h4M8.5 11h6m-6 3.5h3.5"/><path d="m15.2 20.6 5-5a1.45 1.45 0 0 0-2.05-2.05l-5 5-.7 2.75z"/></>,
  catalogue: <><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.5 6.5a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.6"/></>,
  "business-management-app": <><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><path d="M17 13.5v7m-3.5-3.5h7"/></>,
  automations: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z"/>,
  "commerce-suite": <><path d="M4.5 10v10h15V10M10 20v-5h4v5"/><path d="M3 9.2 4.6 4h14.8L21 9.2a2.4 2.4 0 0 1-4.5 1.2 2.4 2.4 0 0 1-4.5 0 2.4 2.4 0 0 1-4.5 0A2.4 2.4 0 0 1 3 9.2z"/></>,
  "online-store": <><path d="M5 8h14l-1.1 12.5H6.1z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></>,
  logistics: <><path d="m12 2.8 7 3.9v7.8l-7 3.9-7-3.9V6.7z"/><path d="m5 6.7 7 3.9 7-3.9M12 10.6v7.8"/><path d="M3 21h4m3 0h4m3 0h4"/></>,
  "fleet-tracking": <><path d="M12 21s-6-5.2-6-10.2a6 6 0 0 1 12 0C18 15.8 12 21 12 21z"/><path d="M8.8 11.3h6.4l-.8-2.3H9.6zM9.6 13.2h.01m4.8 0h.01"/></>,
};

export function ApplicationIcon({ tool, className }: { tool: Pick<PublicBusinessTool, "id" | "icon">; className?: string }) {
  const glyph = libraryGlyphs[tool.id];
  if (!glyph) return <BusinessToolIcon icon={tool.icon} className={className} />;
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{glyph}</svg>;
}
