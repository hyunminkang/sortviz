export type DistributionPreset = 'random' | 'reversed' | 'almost-sorted' | 'few-unique';

export type ArraySize = 8 | 16 | 32 | 64 | 128 | 256;

export const ALLOWED_ARRAY_SIZES: ArraySize[] = [8, 16, 32, 64, 128, 256];

export const PRESET_LABELS: Record<DistributionPreset, string> = {
  random: 'Random',
  reversed: 'Reversed',
  'almost-sorted': 'Almost Sorted',
  'few-unique': 'Few Unique',
};

export type PlaybackState = 'idle' | 'running' | 'paused' | 'completed';
