'use client';

import { Suspense } from 'react';
import usePageView from '../hooks/usePageView';

function PageView() {
  usePageView();
  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageView />
    </Suspense>
  );
}

