# Project Development Log & AI Interview Transcript

This document provides a full disclosure and reproducible record of how **SortViz** was designed, specified, and built using **Antigravity** (Google DeepMind's Advanced Agentic Coding assistant).

---

## 1. Initial Prompt

The development was initiated with the following prompt from the user:

```text
Before writing any code, interview me about this task. Ask one question at a time, until you can write a complete specification — what exactly is being computed, how every edge case and invalid input is handled, what conventions apply, and the checks that would prove the result right. Do not assume a default when my answer would change the result — ask. Then write SPEC.md, show me, and STOP for my approval before any code.
I want to make a web application https://www.toptal.com/developers/sorting-algorithms that can be publicly deployed on vercel. Help me figure out the architecture of the webapp so that I can utilize AI agents to build the webapp. Write the design document in the docs/ directory. The features I want include the following:
(1) Like the HTML page at ttps://www.toptal.com/developers/sorting-algorithms , I want to visually animate different sorting algorithms and compare them.
(2) I want to be able to add/remove specific sorting algorithms to compare
(3) I want to be able to customize the number of items to be sorted (could be 2^k if needed), and determine whether the items are randomly arranged, reversed, or almost sorted.
(4) I want to be able to see which part of the arrays are sorted clearly. Showing the current cursor of element is often not enough to clearly see how the sorting algorithm works. For divide-and-conquer style algorithms, it will be good to know whether the partition is made and which part are "sorted" partially within the range (maybe in different colors).
(5) Please include all sorting algorithms included at https://www.toptal.com/developers/sorting-algorithms, and include any additional comparison-based sorting algorithms that are well known.
```

---

## 2. The Interactive Specification Interview

Following the prompt's instructions, Antigravity conducted an interview asking one question at a time to clarify every design parameter, runtime behavior, and edge case.

### Question 1: Comparison View & Layout Paradigm
> **Agent:** On the Toptal reference page, the visualization is an $N \times M$ Matrix Grid (algorithms × distributions). Which layout paradigm do you envision for your application?
> 1. Matrix Grid (Toptal-style)
> 2. Side-by-Side / Multi-Canvas on a Single Dataset (all selected algorithms run concurrently on the exact same customized input array)
> 3. Dual Mode (Both)
>
> **User Response:**
> ```text
> 2.
> ```

---

### Question 2: Visualization of Partitions, Sorted Regions, and Recursion (Requirement 4)
> **Agent:** To make sorted sections and divide-and-conquer behaviors crystal clear beyond simple pointer cursors, how should these states be visually presented on each algorithm's visualizer card?
> 1. Bar States + Subarray Range Brackets / Tinted Zones (overarching brackets highlight active recursive ranges $[L..R]$, partition subranges, and merge buffers)
> 2. Dual Representation (Array Bars + Recursion/Partition Tree)
> 3. Array Bars + Explicit Range Legend & Status Callouts
>
> **User Response:**
> ```text
> 1
> ```

---

### Question 3: Input Data Configuration & Element Range (Requirement 3)
> **Agent:** Regarding array size $N$ and distribution presets:
> 1. Size Range: Free slider (A), strictly powers of 2 ($2^k$, e.g., 8, 16, 32, 64, 128, 256) (B), or fixed presets (C)?
> 2. Distribution Presets: In addition to Random, Reversed, and Almost Sorted, should we include Few Unique, Already Sorted, or Custom manual array input?
>
> **User Response:**
> ```text
> 1 -B, 2-Frew and almost sorted are good. No custom manual array input
> ```

---

### Question 4: Algorithm Catalog & Initial Selection (Requirement 5)
> **Agent:** Toptal includes 8 algorithms (Insertion, Selection, Bubble, Shell, Merge, Heap, Quick Standard, Quick 3-Way).
> 1. Should we include additional comparison-based algorithms (Cocktail Shaker, Comb, Cycle, TimSort, IntroSort, Bitonic)?
> 2. On initial load, should all algorithms be shown or a curated 4-core set enabled by default with toggles?
>
> **User Response:**
> ```text
> 1. none 2. 4 core algorithms
> ```

---

### Question 5: Playback Controls, Stepping & Metrics
> **Agent:**
> 1. Synchronization: Step-synced (all advance 1 discrete operation per tick in lockstep) or Time-duration synced?
> 2. Controls: Full timeline scrubbing or Standard controls (Play/Pause, Step Forward, Speed slider, Reset)?
> 3. Metrics: Real-time counters for Comparisons, Swaps/Writes, Elapsed Steps, and Status chip?
>
> **User Response:**
> ```text
> 1. step-sunced, 2. standard controls. 3, yes to all
> ```

---

### Question 6: Tech Stack & AI Agent Architecture
> **Agent:** To ensure deployment to Vercel and enable AI agents to build and extend the webapp cleanly:
> - Framework: Vite + React + TypeScript
> - Agent Contract: Pure generator functions (`function* (arr): Generator<SortStep, void, unknown>`) decoupled from DOM/UI logic
> - Automated testing: Vitest test suite proving 100% correctness headlessly
>
> **User Response:**
> ```text
> the recommended version sounds good to me
> ```

---

### Question 7: Runtime Behaviors & Edge Cases
> **Agent:**
> 1. Early completion: Freeze completed cards with emerald green bars while remaining algorithms continue?
> 2. Mid-run changes: Should controls be locked down during active execution?
> 3. Array size defaults: $N = 2^k \in [8, 16, 32, 64, 128, 256]$ with default $N = 32$?
> 4. Presets: Almost Sorted (~5-10% swaps), Few Unique (4 discrete value levels)?
>
> **User Response:**
> ```text
> 1. yes, 2. there should be stop button but user cannot change while it is running. 3. yes n=32 or 64 sounds good. 4 - sounds good
> ```

---

## 3. Specification Approval

Following the interview, Antigravity drafted:
- **[SPEC.md](../SPEC.md)**: Formal product specification.
- **[docs/architecture.md](architecture.md)**: Technical design document with generator interface contracts.

The user reviewed and approved:
> **User Response:**
> ```text
> I approve
> ```

---

## 4. Post-Implementation Iterations & Refinements

During interactive review of the deployed application, the user provided additional feedback:

### Iteration 1: Continuous Playback Default & Stepwise Option
- **User Feedback:**
  > *"I think pressing 'Play' should automatically proceed without defaulting to stepwise analysis. It would be nice to have an option to pause at every step, but the default should be proceeding continuously."*
- **Resolution:**
  - Resolved an issue in `useSortEngine.ts` where generator stepping inside a React state updater was causing premature halting after step 1.
  - Set continuous playback as the default.
  - Added a toggle checkbox: **"Pause at every step"** (`#checkbox-pause-every-step`) in the control toolbar.

### Iteration 2: First-Try Array Desynchronization Fix
- **User Feedback:**
  > *"I think the algorithms are incorrect. Except for mergesort, it does not sort the items correctly. When I restart, it seems working correctly, but in the first try, the sorting does not work correctly."*
- **Resolution:**
  - Diagnosed that on initial mount, `baseArray` and `cardStates` were each independently calling `generateArray()`, causing the generators to run on Array A while the UI rendered Array B (Merge Sort was the only one that worked because it used direct value overwrites).
  - Implemented `createInitialSetup()` guaranteeing that generators, cards, and baseline share the exact same initial array on the very first try.

### Iteration 3: Swap Markers, Quick Sort Pivots & Partial vs. Complete Sorting
- **User Feedback:**
  > *"However, it is still not clear how this algorithm works, because it does not show which two elements are being swapped. Also, 'green' does not represent that the elements are 'completely sorted'. It rather indicates that they are 'partially sorted' within some ranges. In quicksort, it does not show which elements are selected as pivots, so it is hard to understand how the algorithm works."*
- **Resolution:**
  - Added floating neon-red **`⇄ SWAP`** badges above the exact two elements being exchanged, paired with an operation callout banner: `⇄ Swapping arr[i] (val) ↔ arr[j] (val)`.
  - Added a dedicated electric-cyan **`⚑ PIVOT`** badge floating over the chosen pivot bar in Quick Sort, which stays locked throughout the partitioning phase.
  - Strictly differentiated colors: **Purple** (`#a855f7`) is used for partially sorted subproblems (merged segments in Merge Sort, prefixes in Insertion Sort), while **Emerald Green** (`#10b981`) is reserved exclusively for elements in their permanent, globally sorted positions.

---

## 5. Public Deployment
- **Repository:** `https://github.com/hyunminkang/sortviz`
- **Live Vercel Application:** `https://sortviz-virid.vercel.app/`
