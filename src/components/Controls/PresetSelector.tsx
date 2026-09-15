import React from 'react';
import { Shuffle } from 'lucide-react';
import { type DistributionPreset, PRESET_LABELS } from '../../types/config';

interface PresetSelectorProps {
  currentPreset: DistributionPreset;
  disabled: boolean;
  onSelectPreset: (preset: DistributionPreset) => void;
  onRegenerate: () => void;
}

const PRESETS: DistributionPreset[] = ['random', 'reversed', 'almost-sorted', 'few-unique'];

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  disabled,
  onSelectPreset,
  onRegenerate,
}) => {
  return (
    <div className="control-group">
      <span className="control-label">Distribution:</span>
      <div className="pill-group">
        {PRESETS.map((p) => (
          <button
            key={p}
            id={`btn-preset-${p}`}
            className={`pill-btn ${currentPreset === p ? 'active' : ''}`}
            onClick={() => onSelectPreset(p)}
            disabled={disabled}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>

      <button
        id="btn-shuffle"
        className="secondary-btn"
        onClick={onRegenerate}
        disabled={disabled}
        title="Generate fresh array with current preset"
      >
        <Shuffle size={14} />
        New Array
      </button>
    </div>
  );
};
