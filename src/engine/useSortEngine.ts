import { useState, useRef, useEffect, useCallback } from 'react';
import type { ArraySize, DistributionPreset, PlaybackState } from '../types/config';
import type { VisualizerCardState } from '../types/algorithm';
import { ALGORITHMS, DEFAULT_SELECTED_ALGORITHM_IDS } from '../algorithms/registry';
import { generateArray } from './arrayGenerators';
import { applyStepToState, createInitialCardState } from './generatorRunner';

function createInitialSetup(size: ArraySize = 32, preset: DistributionPreset = 'random') {
  const initialArr = generateArray(size, preset);
  const states: Record<string, VisualizerCardState> = {};
  for (const algo of ALGORITHMS) {
    states[algo.id] = createInitialCardState(algo.id, initialArr);
  }
  return { initialArr, states };
}

export function useSortEngine() {
  const [arraySize, setArraySizeState] = useState<ArraySize>(32);
  const [preset, setPresetState] = useState<DistributionPreset>('random');
  const [selectedAlgoIds, setSelectedAlgoIds] = useState<string[]>(DEFAULT_SELECTED_ALGORITHM_IDS);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speedMs, setSpeedMs] = useState<number>(45); // Milliseconds per tick
  const [pauseAtEveryStep, setPauseAtEveryStep] = useState<boolean>(false); // Option to pause at every step

  // Single deterministic initial dataset generated once
  const [initialData] = useState(() => createInitialSetup(32, 'random'));
  const [baseArray, setBaseArray] = useState<number[]>(initialData.initialArr);
  const [cardStates, setCardStates] = useState<Record<string, VisualizerCardState>>(initialData.states);

  // Keep a synchronous ref to current cardStates for reliable step evaluation
  const cardStatesRef = useRef<Record<string, VisualizerCardState>>(initialData.states);
  const generatorsRef = useRef<Map<string, Generator<any, void, unknown>>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync ref whenever cardStates changes
  useEffect(() => {
    cardStatesRef.current = cardStates;
  }, [cardStates]);

  // Initialize generators with a given array
  const initGenerators = useCallback((arr: number[], ids: string[]) => {
    generatorsRef.current.clear();
    for (const id of ids) {
      const algo = ALGORITHMS.find((a) => a.id === id);
      if (algo) {
        generatorsRef.current.set(id, algo.run(arr));
      }
    }
  }, []);

  // Reset states and generators to base array
  const resetToBaseline = useCallback(
    (arr: number[], ids: string[]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPlaybackState('idle');
      initGenerators(arr, ids);
      const next: Record<string, VisualizerCardState> = {};
      for (const algo of ALGORITHMS) {
        next[algo.id] = createInitialCardState(algo.id, arr);
      }
      cardStatesRef.current = next;
      setCardStates(next);
    },
    [initGenerators]
  );

  // Initial mount setup - generators get the EXACT same array as initialData.initialArr
  useEffect(() => {
    initGenerators(baseArray, selectedAlgoIds);
  }, [baseArray, selectedAlgoIds, initGenerators]);

  // Execute one step across all running generators synchronously
  const stepForward = useCallback((): boolean => {
    const currentStates = cardStatesRef.current;
    const nextStates: Record<string, VisualizerCardState> = { ...currentStates };
    let hasMoreSteps = false;

    for (const id of selectedAlgoIds) {
      const currentState = currentStates[id];
      if (!currentState || currentState.isCompleted) {
        continue;
      }

      const gen = generatorsRef.current.get(id);
      if (!gen) {
        continue;
      }

      const stepResult = gen.next();
      if (stepResult.done) {
        nextStates[id] = applyStepToState(currentState, null, true);
      } else {
        hasMoreSteps = true;
        nextStates[id] = applyStepToState(currentState, stepResult.value, false);
      }
    }

    cardStatesRef.current = nextStates;
    setCardStates(nextStates);

    return hasMoreSteps;
  }, [selectedAlgoIds]);

  // Continuous animation playback loop
  useEffect(() => {
    if (playbackState !== 'running') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const tick = () => {
      const hasMore = stepForward();
      if (!hasMore) {
        setPlaybackState('completed');
      } else if (pauseAtEveryStep) {
        setPlaybackState('paused');
      } else {
        timerRef.current = setTimeout(tick, speedMs);
      }
    };

    timerRef.current = setTimeout(tick, speedMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playbackState, speedMs, stepForward, pauseAtEveryStep]);

  // Actions
  const play = useCallback(() => {
    if (playbackState === 'completed') {
      // Re-run on same array
      resetToBaseline(baseArray, selectedAlgoIds);
    }
    setPlaybackState('running');
  }, [playbackState, resetToBaseline, baseArray, selectedAlgoIds]);

  const pause = useCallback(() => {
    setPlaybackState('paused');
  }, []);

  const reset = useCallback(() => {
    resetToBaseline(baseArray, selectedAlgoIds);
  }, [resetToBaseline, baseArray, selectedAlgoIds]);

  const regenerate = useCallback(
    (newSize: ArraySize = arraySize, newPreset: DistributionPreset = preset) => {
      const newArray = generateArray(newSize, newPreset);
      setBaseArray(newArray);
      resetToBaseline(newArray, selectedAlgoIds);
    },
    [arraySize, preset, resetToBaseline, selectedAlgoIds]
  );

  const changeArraySize = useCallback(
    (size: ArraySize) => {
      if (playbackState === 'running') return;
      setArraySizeState(size);
      const newArray = generateArray(size, preset);
      setBaseArray(newArray);
      resetToBaseline(newArray, selectedAlgoIds);
    },
    [playbackState, preset, resetToBaseline, selectedAlgoIds]
  );

  const changePreset = useCallback(
    (newPreset: DistributionPreset) => {
      if (playbackState === 'running') return;
      setPresetState(newPreset);
      const newArray = generateArray(arraySize, newPreset);
      setBaseArray(newArray);
      resetToBaseline(newArray, selectedAlgoIds);
    },
    [playbackState, arraySize, resetToBaseline, selectedAlgoIds]
  );

  const toggleAlgorithm = useCallback(
    (id: string) => {
      if (playbackState === 'running') return;
      setSelectedAlgoIds((prev) => {
        if (prev.includes(id)) {
          if (prev.length <= 1) return prev; // Keep at least 1 algorithm selected
          const next = prev.filter((item) => item !== id);
          resetToBaseline(baseArray, next);
          return next;
        } else {
          const next = [...prev, id];
          resetToBaseline(baseArray, next);
          return next;
        }
      });
    },
    [playbackState, resetToBaseline, baseArray]
  );

  return {
    arraySize,
    preset,
    selectedAlgoIds,
    playbackState,
    speedMs,
    pauseAtEveryStep,
    baseArray,
    cardStates,
    isLocked: playbackState === 'running',
    play,
    pause,
    step: stepForward,
    reset,
    regenerate,
    changeArraySize,
    changePreset,
    toggleAlgorithm,
    setSpeed: setSpeedMs,
    setPauseAtEveryStep,
  };
}
