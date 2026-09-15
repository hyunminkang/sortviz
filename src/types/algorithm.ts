export type StepType =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'set-pivot'
  | 'clear-pivot'
  | 'set-range'
  | 'clear-range'
  | 'mark-partially-sorted'
  | 'mark-sorted';

export type RangeVariant = 'active' | 'partition' | 'left-merge' | 'right-merge';

export interface RangeSpan {
  start: number;
  end: number;
  label?: string;
  variant?: RangeVariant;
}

export interface SortStep {
  type: StepType;
  indices?: number[];
  value?: number;
  range?: RangeSpan;
  description?: string;
}

export type BarStatus =
  | 'default'
  | 'comparing'
  | 'swapping'
  | 'pivot'
  | 'locally-sorted'    // Partially sorted within sub-range (Purple)
  | 'globally-sorted';   // Completely sorted in final position (Green)

export interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface AlgorithmMetadata {
  id: string;
  name: string;
  shortName: string;
  timeComplexity: TimeComplexity;
  spaceComplexity: string;
  stable: boolean;
  defaultSelected: boolean;
  description: string;
  run: (array: number[]) => Generator<SortStep, void, unknown>;
}

export interface VisualizerCardState {
  id: string;
  array: number[];
  barStatuses: BarStatus[];
  activeRanges: RangeSpan[];
  pivotIndex: number | null;
  activeSwapIndices: [number, number] | null;
  activeCompareIndices: [number, number] | null;
  currentActionDescription: string;
  metrics: {
    comparisons: number;
    swaps: number;
    steps: number;
  };
  isCompleted: boolean;
  statusText: string;
}
