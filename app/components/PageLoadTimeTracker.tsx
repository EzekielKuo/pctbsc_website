'use client';

import { Suspense } from 'react';
import usePageLoadTime from '../hooks/usePageLoadTime';

function PageLoadTime() {
  usePageLoadTime();
  return null;
}

export default function PageLoadTimeTracker() {
  return (
    <Suspense fallback={null}>
      <PageLoadTime />
    </Suspense>
  );
}

