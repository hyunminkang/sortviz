import type { SortStep } from '../types/algorithm';

export function* mergeSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  function* merge(start: number, mid: number, end: number): Generator<SortStep, void, unknown> {
    yield {
      type: 'set-range',
      range: {
        start,
        end,
        label: `Merging [${start}..${mid}] & [${mid + 1}..${end}]`,
        variant: 'active',
      },
      description: `Merging subproblems [${start}..${mid}] and [${mid + 1}..${end}]`,
    };

    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      const leftActualIdx = start + i;
      const rightActualIdx = mid + 1 + j;

      yield {
        type: 'compare',
        indices: [leftActualIdx, rightActualIdx],
        description: `Comparing left arr[${leftActualIdx}] (${left[i]}) vs right arr[${rightActualIdx}] (${right[j]})`,
      };

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        yield {
          type: 'overwrite',
          indices: [k],
          value: left[i],
          description: `↳ Writing ${left[i]} from left subproblem to arr[${k}]`,
        };
        i++;
      } else {
        arr[k] = right[j];
        yield {
          type: 'overwrite',
          indices: [k],
          value: right[j],
          description: `↳ Writing ${right[j]} from right subproblem to arr[${k}]`,
        };
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      yield {
        type: 'overwrite',
        indices: [k],
        value: left[i],
        description: `↳ Flushed remaining left element ${left[i]} to arr[${k}]`,
      };
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      yield {
        type: 'overwrite',
        indices: [k],
        value: right[j],
        description: `↳ Flushed remaining right element ${right[j]} to arr[${k}]`,
      };
      j++;
      k++;
    }

    // Indices [start..end] are PARTIALLY sorted within this subproblem
    yield {
      type: 'mark-partially-sorted',
      indices: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      description: `Subarray [${start}..${end}] is partially sorted`,
    };
  }

  function* divideAndConquer(start: number, end: number): Generator<SortStep, void, unknown> {
    if (start >= end) {
      if (start === end) {
        yield {
          type: 'mark-partially-sorted',
          indices: [start],
          description: `Single element [${start}] is base-case sorted`,
        };
      }
      return;
    }

    const mid = Math.floor((start + end) / 2);

    yield {
      type: 'set-range',
      range: {
        start,
        end,
        label: `Dividing [${start}..${end}] (mid=${mid})`,
        variant: 'partition',
      },
      description: `Dividing range [${start}..${end}] into [${start}..${mid}] and [${mid + 1}..${end}]`,
    };

    yield* divideAndConquer(start, mid);
    yield* divideAndConquer(mid + 1, end);
    yield* merge(start, mid, end);
  }

  yield* divideAndConquer(0, n - 1);

  yield { type: 'clear-range' };
  // Only now is the whole array globally sorted
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Merge Sort completed: Entire array is permanently sorted',
  };
}
