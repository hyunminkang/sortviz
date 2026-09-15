import React from 'react';
import type { RangeSpan } from '../../types/algorithm';

interface RangeIndicatorProps {
  ranges: RangeSpan[];
  totalElements: number;
}

export const RangeIndicator: React.FC<RangeIndicatorProps> = ({ ranges, totalElements }) => {
  const activeRange = ranges.length > 0 ? ranges[0] : null;

  if (!activeRange || totalElements <= 0) {
    return (
      <div className="range-track-container" title="Active Subarray & Partition Track">
        <span className="range-idle-text">Entire Array [0..{totalElements - 1}]</span>
      </div>
    );
  }

  const leftPercent = Math.max(0, (activeRange.start / totalElements) * 100);
  const widthPercent = Math.min(
    100 - leftPercent,
    ((activeRange.end - activeRange.start + 1) / totalElements) * 100
  );

  const isPartition = activeRange.variant === 'partition';

  return (
    <div className="range-track-container" title="Active Subarray & Partition Track">
      <div
        className={`range-span-bracket ${isPartition ? 'partition' : ''}`}
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
        }}
      >
        <span className="range-label-tag">
          {activeRange.label || `[${activeRange.start}..${activeRange.end}]`}
        </span>
      </div>
    </div>
  );
};
