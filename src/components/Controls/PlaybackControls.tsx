import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Gauge } from 'lucide-react';
import type { PlaybackState } from '../../types/config';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  speedMs: number;
  pauseAtEveryStep: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onTogglePauseAtEveryStep: (val: boolean) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  speedMs,
  pauseAtEveryStep,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  onTogglePauseAtEveryStep,
}) => {
  const isRunning = playbackState === 'running';

  return (
    <div className="action-controls">
      {isRunning ? (
        <button
          id="btn-pause"
          className="primary-btn pause-btn"
          onClick={onPause}
          title="Pause animation"
        >
          <Pause size={16} fill="#ffffff" />
          Pause
        </button>
      ) : (
        <button
          id="btn-play"
          className="primary-btn"
          onClick={onPlay}
          title={pauseAtEveryStep ? "Advance 1 step (Pause at every step is enabled)" : "Start continuous animation in lockstep"}
        >
          <Play size={16} fill="#ffffff" />
          {playbackState === 'completed' ? 'Restart' : 'Play'}
        </button>
      )}

      <button
        id="btn-step"
        className="secondary-btn"
        onClick={onStep}
        disabled={isRunning}
        title="Advance 1 step across all algorithms"
      >
        <StepForward size={15} />
        Step
      </button>

      <button
        id="btn-reset"
        className="secondary-btn"
        onClick={onReset}
        title="Stop animation and reset to initial state"
      >
        <RotateCcw size={15} />
        Reset
      </button>

      {/* Speed Slider */}
      <div className="control-group speed-slider-group" style={{ marginLeft: 6 }}>
        <Gauge size={15} color="var(--text-muted)" />
        <span className="control-label">Speed</span>
        <input
          id="slider-speed"
          type="range"
          min="1"
          max="100"
          value={Math.round(151 - speedMs)}
          onChange={(e) => {
            const inverted = 151 - Number(e.target.value);
            onSpeedChange(Math.max(1, inverted));
          }}
          className="speed-slider"
          title="Playback speed"
        />
      </div>

      {/* Stepwise analysis option */}
      <label className="stepwise-toggle" title="When checked, playback pauses after each step instead of proceeding continuously">
        <input
          id="checkbox-pause-every-step"
          type="checkbox"
          checked={pauseAtEveryStep}
          onChange={(e) => onTogglePauseAtEveryStep(e.target.checked)}
          className="stepwise-checkbox"
        />
        <span className="stepwise-label">Pause at every step</span>
      </label>
    </div>
  );
};
