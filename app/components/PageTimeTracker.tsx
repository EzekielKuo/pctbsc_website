'use client';

import { Suspense } from 'react';
import usePageTime from '../hooks/usePageTime';

function PageTime() {
  usePageTime();
  return null;
}

export default function PageTimeTracker() {
  return (
    <Suspense fallback={null}>
      <PageTime />
    </Suspense>
  );
}

