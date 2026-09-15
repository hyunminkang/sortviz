import React from 'react';

export const Legend: React.FC = () => {
  return (
    <div className="glass-panel legend-bar">
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-default)' }} />
        <span>Unsorted</span>
      </div>
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-comparing)' }} />
        <span>Comparing (Amber)</span>
      </div>
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-swapping)' }} />
        <span>Swapping (Red)</span>
      </div>
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-pivot)' }} />
        <span>⚑ Pivot (Cyan)</span>
      </div>
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-locally-sorted)' }} />
        <span>Partially Sorted in Subarray (Purple)</span>
      </div>
      <div className="legend-item">
        <span className="legend-color-dot" style={{ background: 'var(--bar-sorted)' }} />
        <span>Completely Sorted in Final Position (Green)</span>
      </div>
      <div className="legend-item">
        <span
          className="legend-color-dot"
          style={{
            background: 'var(--range-band-active)',
            border: '1px solid var(--range-border-active)',
          }}
        />
        <span>Active Subarray Track</span>
      </div>
    </div>
  );
};
