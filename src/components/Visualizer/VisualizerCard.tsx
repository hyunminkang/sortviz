import React from 'react';
import type { AlgorithmMetadata, VisualizerCardState } from '../../types/algorithm';
import { RangeIndicator } from './RangeIndicator';
import { ArrayBars } from './ArrayBars';
import { MetricsPanel } from './MetricsPanel';
import { CheckCircle2, Play, CircleDot, ArrowLeftRight, Search, Flag, CheckCheck, Sparkles } from 'lucide-react';

interface VisualizerCardProps {
  algorithm: AlgorithmMetadata;
  cardState: VisualizerCardState;
  isRunning: boolean;
}

export const VisualizerCard: React.FC<VisualizerCardProps> = ({
  algorithm,
  cardState,
  isRunning,
}) => {
  const getStatusBadge = () => {
    if (cardState.isCompleted) {
      return (
        <span className="status-badge completed">
          <CheckCheck size={13} />
          Completed
        </span>
      );
    }
    if (isRunning) {
      return (
        <span className="status-badge running">
          <Play size={10} fill="currentColor" />
          Running
        </span>
      );
    }
    return (
      <span className="status-badge idle">
        <CircleDot size={12} />
        Ready
      </span>
    );
  };

  // Determine current operation type for visual styling
  const isSwapping = cardState.activeSwapIndices !== null;
  const isPivotAction = cardState.currentActionDescription.includes('Pivot');
  const isComparing = cardState.activeCompareIndices !== null && !isSwapping;
  const isPartiallySorted = cardState.currentActionDescription.includes('partially');

  return (
    <div
      className={`algo-card glass-panel ${cardState.isCompleted ? 'card-completed' : ''}`}
      id={`card-${algorithm.id}`}
    >
      <div className="card-header">
        <div>
          <div className="card-title-row">
            <h2 className="algo-name">{algorithm.name}</h2>
            <span className="complexity-pill" title={`Average: ${algorithm.timeComplexity.average}`}>
              {algorithm.timeComplexity.average}
            </span>
            <span className="complexity-pill" title={`Space: ${algorithm.spaceComplexity}`}>
              {algorithm.spaceComplexity}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {algorithm.description}
          </p>
        </div>

        {getStatusBadge()}
      </div>

      {/* Subarray & Partition Range Indicator */}
      <RangeIndicator
        ranges={cardState.activeRanges}
        totalElements={cardState.array.length}
      />

      {/* Real-time Operation Callout Banner */}
      <div
        className={`operation-callout ${
          cardState.isCompleted
            ? 'op-completed'
            : isSwapping
            ? 'op-swapping'
            : isPivotAction
            ? 'op-pivot'
            : isComparing
            ? 'op-comparing'
            : isPartiallySorted
            ? 'op-partial'
            : 'op-default'
        }`}
      >
        <span className="op-icon">
          {cardState.isCompleted ? (
            <Sparkles size={14} />
          ) : isSwapping ? (
            <ArrowLeftRight size={14} />
          ) : isPivotAction ? (
            <Flag size={14} />
          ) : isComparing ? (
            <Search size={14} />
          ) : isPartiallySorted ? (
            <CheckCircle2 size={14} />
          ) : (
            <CircleDot size={14} />
          )}
        </span>
        <span className="op-text">{cardState.currentActionDescription}</span>
      </div>

      {/* Array Bars with Floating Pivot and Swap markers */}
      <ArrayBars
        array={cardState.array}
        barStatuses={cardState.barStatuses}
        pivotIndex={cardState.pivotIndex}
        activeSwapIndices={cardState.activeSwapIndices}
        activeCompareIndices={cardState.activeCompareIndices}
      />

      {/* Metrics */}
      <MetricsPanel
        comparisons={cardState.metrics.comparisons}
        swaps={cardState.metrics.swaps}
        steps={cardState.metrics.steps}
      />
    </div>
  );
};
