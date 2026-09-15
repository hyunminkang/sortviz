import React from 'react';
import { ALGORITHMS } from '../../algorithms/registry';
import type { VisualizerCardState } from '../../types/algorithm';
import { VisualizerCard } from './VisualizerCard';

interface ComparisonGridProps {
  selectedAlgoIds: string[];
  cardStates: Record<string, VisualizerCardState>;
  isRunning: boolean;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({
  selectedAlgoIds,
  cardStates,
  isRunning,
}) => {
  const activeAlgorithms = ALGORITHMS.filter((algo) => selectedAlgoIds.includes(algo.id));

  return (
    <main className={`visualizer-grid ${activeAlgorithms.length >= 4 ? 'four-or-more' : ''}`}>
      {activeAlgorithms.map((algo) => {
        const cardState = cardStates[algo.id];
        if (!cardState) return null;

        return (
          <VisualizerCard
            key={algo.id}
            algorithm={algo}
            cardState={cardState}
            isRunning={isRunning}
          />
        );
      })}
    </main>
  );
};
