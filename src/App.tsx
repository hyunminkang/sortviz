import React from 'react';
import { useSortEngine } from './engine/useSortEngine';
import { Header } from './components/Header';
import { PlaybackControls } from './components/Controls/PlaybackControls';
import { SizeSelector } from './components/Controls/SizeSelector';
import { PresetSelector } from './components/Controls/PresetSelector';
import { AlgorithmFilter } from './components/Controls/AlgorithmFilter';
import { ComparisonGrid } from './components/Visualizer/ComparisonGrid';
import { Legend } from './components/Visualizer/Legend';
import { AlertCircle } from 'lucide-react';
import './styles/index.css';

export const App: React.FC = () => {
  const {
    arraySize,
    preset,
    selectedAlgoIds,
    playbackState,
    speedMs,
    pauseAtEveryStep,
    cardStates,
    isLocked,
    play,
    pause,
    step,
    reset,
    regenerate,
    changeArraySize,
    changePreset,
    toggleAlgorithm,
    setSpeed,
    setPauseAtEveryStep,
  } = useSortEngine();

  const isRunning = playbackState === 'running';

  return (
    <div className="app-container">
      <Header />

      {/* Control Hub Toolbar */}
      <section className="glass-panel control-hub">
        <div className="control-row">
          <PlaybackControls
            playbackState={playbackState}
            speedMs={speedMs}
            pauseAtEveryStep={pauseAtEveryStep}
            onPlay={play}
            onPause={pause}
            onStep={step}
            onReset={reset}
            onSpeedChange={setSpeed}
            onTogglePauseAtEveryStep={setPauseAtEveryStep}
          />

          <SizeSelector
            currentSize={arraySize}
            disabled={isLocked}
            onSelectSize={changeArraySize}
          />

          <PresetSelector
            currentPreset={preset}
            disabled={isLocked}
            onSelectPreset={changePreset}
            onRegenerate={() => regenerate(arraySize, preset)}
          />
        </div>

        {isLocked && (
          <div className="lockout-hint">
            <AlertCircle size={14} />
            <span>
              Playback active: Configuration controls (Size, Preset, Algorithms) are locked. Click Pause or Reset to adjust parameters.
            </span>
          </div>
        )}

        <div className="control-row">
          <AlgorithmFilter
            selectedIds={selectedAlgoIds}
            disabled={isLocked}
            onToggle={toggleAlgorithm}
          />
        </div>
      </section>

      {/* Visualizer Cards Grid */}
      <ComparisonGrid
        selectedAlgoIds={selectedAlgoIds}
        cardStates={cardStates}
        isRunning={isRunning}
      />

      {/* Visual Legend */}
      <Legend />
    </div>
  );
};

export default App;
