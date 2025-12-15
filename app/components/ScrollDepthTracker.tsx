'use client';

import { Suspense } from 'react';
import useScrollDepth from '../hooks/useScrollDepth';

function ScrollDepth() {
  useScrollDepth();
  return null;
}

export default function ScrollDepthTracker() {
  return (
    <Suspense fallback={null}>
      <ScrollDepth />
    </Suspense>
  );
}

