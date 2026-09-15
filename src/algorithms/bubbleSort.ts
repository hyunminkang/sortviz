import type { SortStep } from '../types/algorithm';

export function* bubbleSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    const unsortedEnd = n - 1 - i;
    yield {
      type: 'set-range',
      range: {
        start: 0,
        end: unsortedEnd,
        label: `Bubbling max in [0..${unsortedEnd}]`,
        variant: 'active',
      },
      description: `Pass ${i + 1}: Bubbling maximum element to index ${unsortedEnd}`,
    };

    let swapped = false;
    for (let j = 0; j < unsortedEnd; j++) {
      yield {
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing adjacent arr[${j}] (${arr[j]}) vs arr[${j + 1}] (${arr[j + 1]})`,
      };

      if (arr[j] > arr[j + 1]) {
        const valJ = arr[j];
        const valNext = arr[j + 1];
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield {
          type: 'swap',
          indices: [j, j + 1],
          description: `⇄ Swapping out-of-order arr[${j}] (${valJ}) ↔ arr[${j + 1}] (${valNext})`,
        };
        swapped = true;
      }
    }

    // Element at unsortedEnd is now in its finalized sorted position
    yield {
      type: 'mark-sorted',
      indices: [unsortedEnd],
      description: `★ Maximum element arr[${unsortedEnd}] = ${arr[unsortedEnd]} permanently sorted`,
    };

    if (!swapped) {
      // If no swaps occurred, the entire remaining array is already sorted
      yield {
        type: 'mark-sorted',
        indices: Array.from({ length: n }, (_, k) => k),
        description: 'No swaps in pass: Array is completely sorted early',
      };
      break;
    }
  }

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Bubble Sort completed: Entire array is permanently sorted',
  };
}
