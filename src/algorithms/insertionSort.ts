import type { SortStep } from '../types/algorithm';

export function* insertionSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  if (n <= 1) {
    if (n === 1) yield { type: 'mark-sorted', indices: [0], description: 'Single element is sorted' };
    return;
  }

  // First element is partially sorted prefix
  yield {
    type: 'mark-partially-sorted',
    indices: [0],
    description: 'Initial prefix [0] is partially sorted',
  };

  for (let i = 1; i < n; i++) {
    yield {
      type: 'set-range',
      range: {
        start: 0,
        end: i,
        label: `Inserting arr[${i}] into sorted prefix [0..${i - 1}]`,
        variant: 'active',
      },
      description: `Inserting arr[${i}] (${arr[i]}) into sorted prefix [0..${i - 1}]`,
    };

    let j = i;
    while (j > 0) {
      yield {
        type: 'compare',
        indices: [j - 1, j],
        description: `Comparing arr[${j - 1}] (${arr[j - 1]}) vs arr[${j}] (${arr[j]})`,
      };

      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        yield {
          type: 'swap',
          indices: [j - 1, j],
          description: `⇄ Swapping arr[${j - 1}] (${arr[j]}) and arr[${j}] (${arr[j - 1]})`,
        };
        j--;
      } else {
        break;
      }
    }

    // Indices [0..i] are PARTIALLY sorted (not globally sorted until all n are inserted)
    yield {
      type: 'mark-partially-sorted',
      indices: Array.from({ length: i + 1 }, (_, k) => k),
      description: `Subarray [0..${i}] is partially sorted`,
    };
  }

  yield { type: 'clear-range' };
  // Now the entire array is globally sorted
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Insertion Sort completed: Entire array is permanently sorted',
  };
}
