import React, { useMemo } from 'react';
import type { BarStatus } from '../../types/algorithm';

interface ArrayBarsProps {
  array: number[];
  barStatuses: BarStatus[];
  pivotIndex: number | null;
  activeSwapIndices: [number, number] | null;
  activeCompareIndices: [number, number] | null;
}

export const ArrayBars: React.FC<ArrayBarsProps> = ({
  array,
  barStatuses,
  pivotIndex,
  activeSwapIndices,
  activeCompareIndices,
}) => {
  const maxVal = useMemo(() => Math.max(...array, 1), [array]);
  const n = array.length;
  const showLabels = n <= 32;

  const isSwapping = (idx: number) =>
    activeSwapIndices !== null &&
    (idx === activeSwapIndices[0] || idx === activeSwapIndices[1]);

  const isComparing = (idx: number) =>
    activeCompareIndices !== null &&
    (idx === activeCompareIndices[0] || idx === activeCompareIndices[1]);

  return (
    <div className="bars-canvas-wrapper">
      <div className="bars-container">
        {array.map((val, idx) => {
          const heightPercent = Math.max(8, (val / maxVal) * 92);
          const isPivot = idx === pivotIndex;
          const swapping = isSwapping(idx);
          const comparing = isComparing(idx);
          const status = isPivot ? 'pivot' : swapping ? 'swapping' : comparing ? 'comparing' : barStatuses[idx] || 'default';

          return (
            <div key={idx} className="bar-wrapper">
              {/* Floating Role Markers above the bar */}
              <div className="bar-marker-slot">
                {isPivot && (
                  <span className="marker-badge marker-pivot" title={`Pivot element: value ${val} at index ${idx}`}>
                    ⚑ PIVOT
                  </span>
                )}
                {!isPivot && swapping && (
                  <span className="marker-badge marker-swap" title={`Swapping element: value ${val}`}>
                    ⇄ SWAP
                  </span>
                )}
                {!isPivot && !swapping && comparing && (
                  <span className="marker-badge marker-compare" title={`Comparing: value ${val}`}>
                    ▲
                  </span>
                )}
              </div>

              {/* The Visual Bar */}
              <div
                className={`bar-column ${status} ${swapping ? 'pulse-swap' : ''} ${isPivot ? 'glow-pivot' : ''}`}
                style={{ height: `${heightPercent}%` }}
                title={`Index: ${idx} | Value: ${val} | State: ${status}`}
              >
                {/* Value displayed inside the bar if wide enough */}
                {showLabels && heightPercent > 20 && (
                  <span className="bar-val-text">{val}</span>
                )}
              </div>

              {/* Index label below the bar */}
              {showLabels && (
                <span className={`bar-index-label ${swapping ? 'label-swap' : isPivot ? 'label-pivot' : ''}`}>
                  {idx}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
