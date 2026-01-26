'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { event } from '@/lib/gtag';

export default function useScrollDepth() {
  const pathname = usePathname();
  const trackedRef = useRef({
    '25%': false,
    '50%': false,
    '75%': false,
    '100%': false,
  });

  useEffect(() => {
    trackedRef.current = { '25%': false, '50%': false, '75%': false, '100%': false };
  }, [pathname]);

  useEffect(() => {
    const pagePath = pathname ?? '';

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollPercent >= 25 && !trackedRef.current['25%']) {
        event({ action: 'scroll', category: 'engagement', label: '25%' }, { page_path: pagePath });
        trackedRef.current['25%'] = true;
      }
      if (scrollPercent >= 50 && !trackedRef.current['50%']) {
        event({ action: 'scroll', category: 'engagement', label: '50%' }, { page_path: pagePath });
        trackedRef.current['50%'] = true;
      }
      if (scrollPercent >= 75 && !trackedRef.current['75%']) {
        event({ action: 'scroll', category: 'engagement', label: '75%' }, { page_path: pagePath });
        trackedRef.current['75%'] = true;
      }
      if (scrollPercent >= 100 && !trackedRef.current['100%']) {
        event({ action: 'scroll', category: 'engagement', label: '100%' }, { page_path: pagePath });
        trackedRef.current['100%'] = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);
}

