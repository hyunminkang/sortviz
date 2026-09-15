import type { BarStatus, RangeSpan, SortStep, VisualizerCardState } from '../types/algorithm';

export interface AlgorithmInstance {
  id: string;
  generator: Generator<SortStep, void, unknown>;
  state: VisualizerCardState;
}

/**
 * Initializes a visualizer card state given an initial array.
 */
export function createInitialCardState(id: string, initialArray: number[]): VisualizerCardState {
  return {
    id,
    array: [...initialArray],
    barStatuses: Array<BarStatus>(initialArray.length).fill('default'),
    activeRanges: [],
    pivotIndex: null,
    activeSwapIndices: null,
    activeCompareIndices: null,
    currentActionDescription: 'Ready',
    metrics: {
      comparisons: 0,
      swaps: 0,
      steps: 0,
    },
    isCompleted: false,
    statusText: 'Ready',
  };
}

/**
 * Applies a single SortStep to a VisualizerCardState, returning a new immutable state.
 */
export function applyStepToState(
  prevState: VisualizerCardState,
  step: SortStep | null,
  isDone: boolean
): VisualizerCardState {
  if (prevState.isCompleted) {
    return prevState;
  }

  if (isDone || !step) {
    return {
      ...prevState,
      barStatuses: Array<BarStatus>(prevState.array.length).fill('globally-sorted'),
      activeRanges: [],
      pivotIndex: null,
      activeSwapIndices: null,
      activeCompareIndices: null,
      currentActionDescription: 'Completed: All elements in final sorted order',
      isCompleted: true,
      statusText: 'Completed',
    };
  }

  const nextArray = [...prevState.array];
  let nextPivotIndex = prevState.pivotIndex;

  // Preserve permanently sorted bars, locally sorted bars, and pivot. Reset comparing/swapping.
  const nextBarStatuses: BarStatus[] = prevState.barStatuses.map((status, idx) => {
    if (status === 'globally-sorted') return 'globally-sorted';
    if (status === 'locally-sorted') return 'locally-sorted';
    if (idx === nextPivotIndex) return 'pivot';
    return 'default';
  });

  let nextActiveRanges: RangeSpan[] = [...prevState.activeRanges];
  let activeSwapIndices: [number, number] | null = null;
  let activeCompareIndices: [number, number] | null = null;
  let currentActionDescription = prevState.currentActionDescription;
  let statusText = prevState.statusText;

  const nextMetrics = {
    ...prevState.metrics,
    steps: prevState.metrics.steps + 1,
  };

  switch (step.type) {
    case 'compare': {
      if (step.indices && step.indices.length >= 2) {
        const [i, j] = step.indices;
        activeCompareIndices = [i, j];

        if (i >= 0 && i < nextBarStatuses.length && nextBarStatuses[i] !== 'globally-sorted') {
          // If this index is pivot, keep it as pivot role visually, otherwise comparing
          if (i !== nextPivotIndex) nextBarStatuses[i] = 'comparing';
        }
        if (j >= 0 && j < nextBarStatuses.length && nextBarStatuses[j] !== 'globally-sorted') {
          if (j !== nextPivotIndex) nextBarStatuses[j] = 'comparing';
        }

        currentActionDescription =
          step.description ||
          `Comparing arr[${i}] (${nextArray[i]}) vs arr[${j}] (${nextArray[j]})`;
      }
      nextMetrics.comparisons += 1;
      break;
    }

    case 'swap': {
      if (step.indices && step.indices.length >= 2) {
        const [i, j] = step.indices;
        activeSwapIndices = [i, j];

        const valI = nextArray[i];
        const valJ = nextArray[j];
        nextArray[i] = valJ;
        nextArray[j] = valI;

        // If pivot is one of the swapped indices, track its new index!
        if (nextPivotIndex === i) {
          nextPivotIndex = j;
        } else if (nextPivotIndex === j) {
          nextPivotIndex = i;
        }

        if (nextBarStatuses[i] !== 'globally-sorted') nextBarStatuses[i] = 'swapping';
        if (nextBarStatuses[j] !== 'globally-sorted') nextBarStatuses[j] = 'swapping';

        currentActionDescription =
          step.description ||
          `⇄ Swapping arr[${i}] (${valI}) ↔ arr[${j}] (${valJ})`;
      }
      nextMetrics.swaps += 1;
      break;
    }

    case 'overwrite': {
      if (step.indices && step.indices.length >= 1 && step.value !== undefined) {
        const idx = step.indices[0];
        const oldVal = nextArray[idx];
        nextArray[idx] = step.value;
        activeSwapIndices = [idx, idx];

        if (nextBarStatuses[idx] !== 'globally-sorted') {
          nextBarStatuses[idx] = 'swapping';
        }

        currentActionDescription =
          step.description ||
          `↳ Writing ${step.value} to merged position arr[${idx}] (was ${oldVal})`;
      }
      nextMetrics.swaps += 1;
      break;
    }

    case 'set-pivot': {
      if (step.indices && step.indices.length > 0) {
        nextPivotIndex = step.indices[0];
        nextBarStatuses[nextPivotIndex] = 'pivot';
        currentActionDescription =
          step.description ||
          `⚑ Selected pivot: arr[${nextPivotIndex}] = ${nextArray[nextPivotIndex]}`;
      }
      break;
    }

    case 'clear-pivot': {
      if (nextPivotIndex !== null && nextBarStatuses[nextPivotIndex] === 'pivot') {
        nextBarStatuses[nextPivotIndex] = 'default';
      }
      nextPivotIndex = null;
      break;
    }

    case 'set-range': {
      if (step.range) {
        nextActiveRanges = [step.range];
        statusText = step.range.label || `Active range [${step.range.start}..${step.range.end}]`;
        currentActionDescription = statusText;
      }
      break;
    }

    case 'clear-range': {
      nextActiveRanges = [];
      break;
    }

    case 'mark-partially-sorted': {
      // Partially sorted within subarray (Purple - locally-sorted)
      if (step.indices) {
        for (const idx of step.indices) {
          if (idx >= 0 && idx < nextBarStatuses.length && nextBarStatuses[idx] !== 'globally-sorted') {
            nextBarStatuses[idx] = 'locally-sorted';
          }
        }
      }
      if (step.description) {
        currentActionDescription = step.description;
      }
      break;
    }

    case 'mark-sorted': {
      // Permanently sorted in final position (Green - globally-sorted)
      if (step.indices) {
        for (const idx of step.indices) {
          if (idx >= 0 && idx < nextBarStatuses.length) {
            nextBarStatuses[idx] = 'globally-sorted';
          }
        }
      }
      if (step.description) {
        currentActionDescription = step.description;
      }
      break;
    }
  }

  return {
    ...prevState,
    array: nextArray,
    barStatuses: nextBarStatuses,
    activeRanges: nextActiveRanges,
    pivotIndex: nextPivotIndex,
    activeSwapIndices,
    activeCompareIndices,
    currentActionDescription,
    metrics: nextMetrics,
    statusText,
  };
}
