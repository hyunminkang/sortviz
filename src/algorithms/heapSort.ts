import type { SortStep } from '../types/algorithm';

export function* heapSort(initialArray: number[]): Generator<SortStep, void, unknown> {
  const arr = [...initialArray];
  const n = arr.length;

  function* siftDown(heapSize: number, rootIdx: number): Generator<SortStep, void, unknown> {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < heapSize) {
      yield {
        type: 'compare',
        indices: [left, largest],
        description: `Comparing left child arr[${left}] (${arr[left]}) vs current largest arr[${largest}] (${arr[largest]})`,
      };
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      yield {
        type: 'compare',
        indices: [right, largest],
        description: `Comparing right child arr[${right}] (${arr[right]}) vs current largest arr[${largest}] (${arr[largest]})`,
      };
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIdx) {
      const valRoot = arr[rootIdx];
      const valLargest = arr[largest];
      [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
      yield {
        type: 'swap',
        indices: [rootIdx, largest],
        description: `⇄ Sifting down: Swapping arr[${rootIdx}] (${valRoot}) ↔ arr[${largest}] (${valLargest})`,
      };
      yield* siftDown(heapSize, largest);
    }
  }

  // Phase 1: Build Max Heap
  yield {
    type: 'set-range',
    range: {
      start: 0,
      end: n - 1,
      label: `Phase 1: Building Max Heap [0..${n - 1}]`,
      variant: 'active',
    },
    description: `Building binary max heap across all ${n} elements`,
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(n, i);
  }

  // Phase 2: Heap Extract Max
  for (let i = n - 1; i > 0; i--) {
    yield {
      type: 'set-range',
      range: {
        start: 0,
        end: i,
        label: `Extracting Max to arr[${i}] (Heap: [0..${i - 1}])`,
        variant: 'partition',
      },
      description: `Extracting root max arr[0] (${arr[0]}) to final position arr[${i}]`,
    };

    const valRoot = arr[0];
    const valEnd = arr[i];
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield {
      type: 'swap',
      indices: [0, i],
      description: `⇄ Swapping heap root arr[0] (${valRoot}) ↔ arr[${i}] (${valEnd})`,
    };

    // Index i is permanently at its final sorted position
    yield {
      type: 'mark-sorted',
      indices: [i],
      description: `★ Extracted max arr[${i}] = ${arr[i]} permanently sorted`,
    };

    // Sift down root in reduced heap of size i
    yield* siftDown(i, 0);
  }

  yield { type: 'clear-range' };
  yield {
    type: 'mark-sorted',
    indices: Array.from({ length: n }, (_, k) => k),
    description: 'Heap Sort completed: Entire array is permanently sorted',
  };
}
