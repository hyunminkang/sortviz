import type { SortStep } from '../types/algorithm';

export function* quickSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  function* partition(low: number, high: number): Generator<SortStep, number, unknown> {
    yield {
      type: 'set-range',
      range: {
        start: low,
        end: high,
        label: `Partitioning Range [${low}..${high}]`,
        variant: 'partition',
      },
      description: `Active partition subproblem: [${low}..${high}]`,
    };

    const pivotIdx = high;
    const pivotVal = arr[pivotIdx];

    // Explicitly designate the pivot
    yield {
      type: 'set-pivot',
      indices: [pivotIdx],
      description: `⚑ Chosen pivot: arr[${pivotIdx}] = ${pivotVal}`,
    };

    let i = low;

    for (let j = low; j < high; j++) {
      yield {
        type: 'compare',
        indices: [j, pivotIdx],
        description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivotVal})`,
      };

      if (arr[j] < pivotVal) {
        if (i !== j) {
          const valI = arr[i];
          const valJ = arr[j];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield {
            type: 'swap',
            indices: [i, j],
            description: `⇄ Swapping arr[${i}] (${valI}) ↔ arr[${j}] (${valJ}) into < pivot region`,
          };
        }
        i++;
      }
    }

    // Place pivot into its final partitioned position
    const oldPivotVal = arr[pivotIdx];
    const valAtI = arr[i];
    [arr[i], arr[high]] = [arr[high], arr[i]];

    yield {
      type: 'swap',
      indices: [i, high],
      description: `⇄ Moving pivot arr[${high}] (${oldPivotVal}) into its final sorted position at index ${i} (swapped with ${valAtI})`,
    };

    yield { type: 'clear-pivot' };

    // Element at index i is permanently in its final sorted position!
    yield {
      type: 'mark-sorted',
      indices: [i],
      description: `★ Pivot arr[${i}] = ${arr[i]} is now permanently sorted`,
    };

    return i;
  }

  function* sort(low: number, high: number): Generator<SortStep, void, unknown> {
    if (low >= high) {
      if (low === high) {
        yield {
          type: 'mark-sorted',
          indices: [low],
          description: `Single element arr[${low}] = ${arr[low]} is permanently sorted`,
        };
      }
      return;
    }

    const p = (yield* partition(low, high)) as number;
    yield* sort(low, p - 1);
    yield* sort(p + 1, high);
  }

  yield* sort(0, n - 1);

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Quick Sort completed: Entire array is permanently sorted',
  };
}
