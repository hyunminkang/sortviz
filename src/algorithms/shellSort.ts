import type { SortStep } from '../types/algorithm';

export function* shellSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  const gaps: number[] = [];
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    gaps.push(gap);
  }

  for (const gap of gaps) {
    yield {
      type: 'set-range',
      range: {
        start: 0,
        end: n - 1,
        label: `Shell Sort (Gap = ${gap})`,
        variant: 'partition',
      },
      description: `Shell pass with gap = ${gap}`,
    };

    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap) {
        yield {
          type: 'compare',
          indices: [j - gap, j],
          description: `Comparing gap-separated arr[${j - gap}] (${arr[j - gap]}) vs arr[${j}] (${arr[j]})`,
        };

        if (arr[j - gap] > arr[j]) {
          const valNear = arr[j - gap];
          const valFar = arr[j];
          [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
          yield {
            type: 'swap',
            indices: [j - gap, j],
            description: `⇄ Swapping arr[${j - gap}] (${valNear}) ↔ arr[${j}] (${valFar}) across gap ${gap}`,
          };
          j -= gap;
        } else {
          break;
        }
      }
    }

    // Gap pass makes array partially sorted
    yield {
      type: 'mark-partially-sorted',
      indices: Array.from({ length: n }, (_, k) => k),
      description: `Array is now ${gap}-sorted`,
    };
  }

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Shell Sort completed: Entire array is permanently sorted',
  };
}
