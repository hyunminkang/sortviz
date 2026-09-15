import React from 'react';
import { ALGORITHMS } from '../../algorithms/registry';

interface AlgorithmFilterProps {
  selectedIds: string[];
  disabled: boolean;
  onToggle: (id: string) => void;
}

export const AlgorithmFilter: React.FC<AlgorithmFilterProps> = ({
  selectedIds,
  disabled,
  onToggle,
}) => {
  return (
    <div className="control-group" style={{ width: '100%', alignItems: 'flex-start' }}>
      <span className="control-label" style={{ marginTop: 6 }}>
        Compare Algorithms:
      </span>
      <div className="algo-chips-container">
        {ALGORITHMS.map((algo) => {
          const isSelected = selectedIds.includes(algo.id);
          const isOnlyOneSelected = isSelected && selectedIds.length === 1;

          return (
            <button
              key={algo.id}
              id={`chip-algo-${algo.id}`}
              className={`algo-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggle(algo.id)}
              disabled={disabled || isOnlyOneSelected}
              title={
                isOnlyOneSelected
                  ? 'At least one algorithm must remain active'
                  : `Toggle ${algo.name}`
              }
            >
              <span className="chip-dot" />
              {algo.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
