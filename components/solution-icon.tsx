const paths: Record<number, React.ReactNode> = {
  0: <><line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2" /><line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="11" cy="18" r="2" /></>,
  1: <><rect x="7" y="7" width="10" height="10" rx="1.5" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="2" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="22" /><line x1="2" y1="12" x2="7" y2="12" /><line x1="17" y1="12" x2="22" y2="12" /></>,
  2: <><path d="M4 5h2l2.2 10.2a2 2 0 0 0 2 1.6h6.6a2 2 0 0 0 2-1.6L20 8H7" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>,
  3: <><rect x="4" y="5" width="16" height="15" rx="2" /><line x1="4" y1="10" x2="20" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></>,
  4: <><rect x="3" y="5" width="18" height="14" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><circle cx="6.2" cy="7" r="0.6" fill="currentColor" stroke="none" /><circle cx="8.6" cy="7" r="0.6" fill="currentColor" stroke="none" /></>,
  5: <><rect x="4" y="5" width="16" height="6" rx="1.5" /><rect x="4" y="13" width="16" height="6" rx="1.5" /><circle cx="8" cy="8" r="0.8" fill="currentColor" stroke="none" /><circle cx="8" cy="16" r="0.8" fill="currentColor" stroke="none" /></>,
  6: <><rect x="6" y="9" width="12" height="11" rx="1" /><path d="M9 13h.01M12 13h.01M15 13h.01" /><path d="M9 6a4 4 0 0 1 6 0" /><path d="M7 4a7 7 0 0 1 10 0" /></>,
  7: <><path d="M12 3l7 4v10l-7 4-7-4V7z" /><circle cx="12" cy="12" r="2.5" /></>,
};

export function SolutionIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[index % 8]}</svg>;
}
