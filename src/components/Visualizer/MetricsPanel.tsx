import React from 'react';

interface MetricsPanelProps {
  comparisons: number;
  swaps: number;
  steps: number;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ comparisons, swaps, steps }) => {
  return (
    <div className="metrics-panel">
      <div className="metric-chip">
        <span className="metric-label">Comparisons</span>
        <span className="metric-value">{comparisons.toLocaleString()}</span>
      </div>
      <div className="metric-chip">
        <span className="metric-label">Swaps / Writes</span>
        <span className="metric-value">{swaps.toLocaleString()}</span>
      </div>
      <div className="metric-chip">
        <span className="metric-label">Operations</span>
        <span className="metric-value">{steps.toLocaleString()}</span>
      </div>
    </div>
  );
};
