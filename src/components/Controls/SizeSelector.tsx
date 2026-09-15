import React from 'react';
import { ALLOWED_ARRAY_SIZES, type ArraySize } from '../../types/config';

interface SizeSelectorProps {
  currentSize: ArraySize;
  disabled: boolean;
  onSelectSize: (size: ArraySize) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  currentSize,
  disabled,
  onSelectSize,
}) => {
  return (
    <div className="control-group">
      <span className="control-label">Size (N):</span>
      <div className="pill-group">
        {ALLOWED_ARRAY_SIZES.map((size) => (
          <button
            key={size}
            id={`btn-size-${size}`}
            className={`pill-btn ${currentSize === size ? 'active' : ''}`}
            onClick={() => onSelectSize(size)}
            disabled={disabled}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
