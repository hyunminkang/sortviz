import type { AlgorithmMetadata } from '../types/algorithm';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { bubbleSort } from './bubbleSort';
import { shellSort } from './shellSort';
import { mergeSort } from './mergeSort';
import { heapSort } from './heapSort';
import { quickSort } from './quickSort';
import { quick3WaySort } from './quick3WaySort';

export const ALGORITHMS: AlgorithmMetadata[] = [
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    shortName: 'Insertion',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    defaultSelected: true,
    description: 'Builds the sorted array one item at a time by inserting into an already sorted prefix.',
    run: insertionSort,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    shortName: 'Selection',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    defaultSelected: true,
    description: 'Repeatedly finds the minimum element from the unsorted subarray and places it at the front.',
    run: selectionSort,
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    shortName: 'Bubble',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    defaultSelected: false,
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if in the wrong order.',
    run: bubbleSort,
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    shortName: 'Shell',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n^1.3)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    defaultSelected: false,
    description: 'Generalization of insertion sort that allows exchanges of elements that are far apart using a diminishing gap sequence.',
    run: shellSort,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    shortName: 'Merge',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    defaultSelected: true,
    description: 'Divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and merges the sorted halves.',
    run: mergeSort,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    shortName: 'Heap',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    defaultSelected: false,
    description: 'Comparison-based sort using a binary heap data structure to repeatedly extract the maximum element.',
    run: heapSort,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort (Standard)',
    shortName: 'Quick',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    defaultSelected: true,
    description: 'Divide-and-conquer algorithm that partitions an array into two sub-arrays around a chosen pivot element.',
    run: quickSort,
  },
  {
    id: 'quick-3way-sort',
    name: 'Quick Sort (3-Way)',
    shortName: 'Quick 3-Way',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    defaultSelected: false,
    description: "Dijkstra's 3-way partitioning dividing the array into < pivot, == pivot, and > pivot segments. Highly optimal for duplicate keys.",
    run: quick3WaySort,
  },
];

export const DEFAULT_SELECTED_ALGORITHM_IDS = ALGORITHMS.filter((a) => a.defaultSelected).map(
  (a) => a.id
);
