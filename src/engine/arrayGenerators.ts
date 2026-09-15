import type { ArraySize, DistributionPreset } from '../types/config';

/**
 * Deterministically or pseudo-randomly generates an array of size N
 * based on the chosen distribution preset.
 */
export function generateArray(size: ArraySize, preset: DistributionPreset): number[] {
  switch (preset) {
    case 'random': {
      // 1 to N permutation shuffled with Fisher-Yates
      const arr = Array.from({ length: size }, (_, i) => i + 1);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    case 'reversed': {
      // Strictly decreasing N down to 1
      return Array.from({ length: size }, (_, i) => size - i);
    }

    case 'almost-sorted': {
      // Sorted 1..N with ~5-8% random adjacent or near swaps
      const arr = Array.from({ length: size }, (_, i) => i + 1);
      const swapCount = Math.max(1, Math.floor(size * 0.08));
      for (let s = 0; s < swapCount; s++) {
        const idx = Math.floor(Math.random() * (size - 1));
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      }
      return arr;
    }

    case 'few-unique': {
      // 4 discrete value levels (e.g. 25%, 50%, 75%, 100% of max height)
      const levels = [
        Math.max(1, Math.round(size * 0.25)),
        Math.max(2, Math.round(size * 0.5)),
        Math.max(3, Math.round(size * 0.75)),
        size,
      ];
      const arr: number[] = [];
      for (let i = 0; i < size; i++) {
        const randomLevel = levels[Math.floor(Math.random() * levels.length)];
        arr.push(randomLevel);
      }
      return arr;
    }

    default:
      return Array.from({ length: size }, (_, i) => i + 1);
  }
}
