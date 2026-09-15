import type { SortStep } from '../types/algorithm';

export function* quick3WaySort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

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

    const pivotVal = arr[low];

    yield {
      type: 'set-range',
      range: {
        start: low,
        end: high,
        label: `3-Way Partitioning [${low}..${high}] around pivot ${pivotVal}`,
        variant: 'partition',
      },
      description: `3-Way Partitioning [${low}..${high}] with pivot = ${pivotVal}`,
    };

    yield {
      type: 'set-pivot',
      indices: [low],
      description: `⚑ Chosen pivot: arr[${low}] = ${pivotVal}`,
    };

    let lt = low;
    let gt = high;
    let i = low + 1;

    while (i <= gt) {
      yield {
        type: 'compare',
        indices: [i, lt],
        description: `Comparing arr[${i}] (${arr[i]}) with pivot (${pivotVal})`,
      };

      if (arr[i] < pivotVal) {
        const valLt = arr[lt];
        const valI = arr[i];
        [arr[lt], arr[i]] = [arr[i], arr[lt]];
        yield {
          type: 'swap',
          indices: [lt, i],
          description: `⇄ Swapping arr[${lt}] (${valLt}) ↔ arr[${i}] (${valI}) into < pivot zone`,
        };
        lt++;
        i++;
      } else if (arr[i] > pivotVal) {
        const valGt = arr[gt];
        const valI = arr[i];
        [arr[i], arr[gt]] = [arr[gt], arr[i]];
        yield {
          type: 'swap',
          indices: [i, gt],
          description: `⇄ Swapping arr[${i}] (${valI}) ↔ arr[${gt}] (${valGt}) into > pivot zone`,
        };
        gt--;
      } else {
        i++;
      }
    }

    yield { type: 'clear-pivot' };

    // All elements in [lt..gt] are equal to the pivot and permanently in their sorted positions!
    const equalRangeIndices: number[] = [];
    for (let k = lt; k <= gt; k++) {
      equalRangeIndices.push(k);
    }
    yield {
      type: 'mark-sorted',
      indices: equalRangeIndices,
      description: `★ Equal-to-pivot zone [${lt}..${gt}] (${equalRangeIndices.length} elements = ${pivotVal}) is permanently sorted`,
    };

    // Recurse on left (< pivot) and right (> pivot)
    yield* sort(low, lt - 1);
    yield* sort(gt + 1, high);
  }

  yield* sort(0, n - 1);

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Quick Sort (3-Way) completed: Entire array is permanently sorted',
  };
}
