import { describe, it, expect } from 'vitest';
import { ALGORITHMS } from '../algorithms/registry';
import { generateArray } from '../engine/arrayGenerators';
import type { ArraySize, DistributionPreset } from '../types/config';
import type { SortStep } from '../types/algorithm';

describe('Sorting Algorithms Correctness Suite', () => {
  const presets: DistributionPreset[] = ['random', 'reversed', 'almost-sorted', 'few-unique'];
  const testSizes: ArraySize[] = [8, 16, 32, 64]; // Fast comprehensive test across sizes

  for (const algo of ALGORITHMS) {
    describe(algo.name, () => {
      for (const preset of presets) {
        for (const size of testSizes) {
          it(`correctly sorts ${size} elements with preset: "${preset}"`, () => {
            const initial = generateArray(size, preset);
            const initialMultiset = [...initial].sort((a, b) => a - b);

            const workingArray = [...initial];
            const generator = algo.run(initial);

            let stepCount = 0;
            const maxSteps = 200000; // Guard against infinite loop

            let result = generator.next();
            while (!result.done && stepCount < maxSteps) {
              stepCount++;
              const step = result.value as SortStep;

              // Check index bounds
              if (step.indices) {
                for (const idx of step.indices) {
                  expect(idx).toBeGreaterThanOrEqual(0);
                  expect(idx).toBeLessThan(size);
                }
              }

              // Apply mutation to simulate state
              if (step.type === 'swap' && step.indices && step.indices.length >= 2) {
                const [i, j] = step.indices;
                const temp = workingArray[i];
                workingArray[i] = workingArray[j];
                workingArray[j] = temp;
              } else if (step.type === 'overwrite' && step.indices && step.indices.length >= 1 && step.value !== undefined) {
                workingArray[step.indices[0]] = step.value;
              }

              result = generator.next();
            }

            expect(stepCount).toBeLessThan(maxSteps);

            // Invariant 1: Array must be sorted in non-decreasing order
            for (let i = 0; i < workingArray.length - 1; i++) {
              expect(workingArray[i]).toBeLessThanOrEqual(workingArray[i + 1]);
            }

            // Invariant 2: Multiset conservation
            const finalMultiset = [...workingArray].sort((a, b) => a - b);
            expect(finalMultiset).toEqual(initialMultiset);
          });
        }
      }
    });
  }
});
