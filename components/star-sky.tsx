import type { CSSProperties } from "react";

export function StarSky() {
  return <div className="star-sky" aria-hidden="true">
    {[0, 1, 2].map(layer => <div className={`star-sky__layer star-sky__layer--${layer}`} key={layer}>
      {Array.from({ length: 36 }, (_, index) => {
        const seed = index + layer * 37;
        return <i key={index} style={{ left: `${(seed * 61.803 + 7) % 100}%`, top: `${(seed * 37.719 + 11) % 100}%`, "--star-size": `${seed % 9 === 0 ? 2.4 : 1.2}px` } as CSSProperties} />;
      })}
    </div>)}
  </div>;
}
