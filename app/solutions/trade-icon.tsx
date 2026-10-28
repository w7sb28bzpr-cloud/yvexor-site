/** One glyph per trade id of data/trades.ts, on the same 24px grid and stroke as the other site icons. */
const paths: Record<string, React.ReactNode> = {
  hotel: <><path d="M3 19V6M21 19v-5a3 3 0 0 0-3-3h-7v8"/><path d="M3 15h18"/><circle cx="7" cy="11" r="1.8"/></>,
  restaurant: <><path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3m-3 7v11m10-18v18m0-18c3 2 3 6 0 8"/></>,
  snack: <><path d="M4.5 11a7.5 5 0 0 1 15 0z"/><path d="M4 14h16"/><path d="M5 17.5h14a1 1 0 0 1-1 2.5H6a1 1 0 0 1-1-2.5z"/></>,
  commerce: <><path d="M4.5 10v10h15V10M10 20v-5h4v5"/><path d="M3 9.2 4.6 4h14.8L21 9.2a2.4 2.4 0 0 1-4.5 1.2 2.4 2.4 0 0 1-4.5 0 2.4 2.4 0 0 1-4.5 0A2.4 2.4 0 0 1 3 9.2z"/></>,
  beauty: <><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M8.5 16 18 4M15.5 16 6 4"/></>,
  sport: <><circle cx="10" cy="9" r="6"/><path d="M6 13l-3.5 3.5a1.4 1.4 0 0 0 2 2L8 15"/><path d="M7.5 6.5l5 5M12.5 6.5l-5 5"/><circle cx="18.5" cy="18.5" r="2"/></>,
  garage: <><path d="M4 16v-3l2-5h12l2 5v3"/><path d="M3.5 13h17"/><path d="M4 16h16v2H4z"/><circle cx="7.5" cy="16" r="1"/><circle cx="16.5" cy="16" r="1"/></>,
  craft: <><path d="M4 18a8 8 0 0 1 16 0"/><path d="M3 18h18v2H3z"/><path d="M10 10V6h4v4"/></>,
  office: <><rect x="3.5" y="7" width="17" height="12" rx="2"/><path d="M9 7V5h6v2"/><path d="M3.5 12h17"/></>,
  realestate: <><path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><circle cx="12" cy="13" r="1.8"/><path d="M12 14.8V18"/></>,
  transport: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  association: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1zM16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6V20h-4"/></>,
  industry: <><path d="M3 20V10l5 3V10l5 3V5h4v15z"/><path d="M3 20h18"/><path d="M8 17h1m3 0h1m3 0h1"/></>,
  leisure: <><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" strokeDasharray="1.5 2"/></>,
  camping: <><path d="M12 4 3 20h18z"/><path d="M12 4v16"/><path d="m9.5 20 2.5-5 2.5 5"/></>,
  building: <><rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 7.5h2m2 0h2M9 11h2m2 0h2M9 14.5h2m2 0h2M10.5 20.5v-3h3v3"/></>,
  public: <><path d="M3 10 12 5l9 5"/><path d="M5 10v8m4.7-8v8m4.6-8v8M19 10v8"/><path d="M3 20h18"/></>,
  business: <><path d="M12 3c3.5 2 5 5.5 5 9l-2.5 3h-5L7 12c0-3.5 1.5-7 5-9z"/><circle cx="12" cy="9.5" r="1.6"/><path d="M9.5 15 8 20l3-2h2l3 2-1.5-5"/></>,
};

export function TradeIcon({ id, className }: { id: string; className?: string }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[id] ?? paths.business}</svg>;
}
