import type { SortStep } from '../types/algorithm';

export function* selectionSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    yield {
      type: 'set-range',
      range: {
        start: i,
        end: n - 1,
        label: `Searching minimum in [${i}..${n - 1}]`,
        variant: 'active',
      },
      description: `Searching for minimum element in unsorted range [${i}..${n - 1}]`,
    };

    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'compare',
        indices: [minIdx, j],
        description: `Comparing current min arr[${minIdx}] (${arr[minIdx]}) vs arr[${j}] (${arr[j]})`,
      };
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const valI = arr[i];
      const valMin = arr[minIdx];
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield {
        type: 'swap',
        indices: [i, minIdx],
        description: `⇄ Swapping minimum arr[${minIdx}] (${valMin}) into sorted position arr[${i}] (was ${valI})`,
      };
    }

    // Index i is now permanently sorted
    yield {
      type: 'mark-sorted',
      indices: [i],
      description: `★ Minimum element arr[${i}] = ${arr[i]} is permanently sorted`,
    };
  }

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Selection Sort completed: Entire array is permanently sorted',
  };
}
