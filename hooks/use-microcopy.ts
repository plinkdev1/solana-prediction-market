'use client';

import { useMemo } from 'react';
import { getRandomMicrocopy, type MicrocopyCategory } from '@/lib/microcopy';

export function useMicrocopy(category: MicrocopyCategory) {
  // Memoize so it doesn't change on every render (only on mount)
  const text = useMemo(() => getRandomMicrocopy(category), [category]);
  return text;
}
