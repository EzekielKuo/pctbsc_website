'use client';

import { useEffect, useRef } from 'react';
import { event } from '@/lib/gtag';

export default function useScrollDepth() {
  const trackedRef = useRef({
    '25%': false,
    '50%': false,
    '75%': false,
    '100%': false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // 追蹤 25%
      if (scrollPercent >= 25 && !trackedRef.current['25%']) {
        event({
          action: 'scroll',
          category: 'engagement',
          label: '25%',
        });
        trackedRef.current['25%'] = true;
      }

      // 追蹤 50%
      if (scrollPercent >= 50 && !trackedRef.current['50%']) {
        event({
          action: 'scroll',
          category: 'engagement',
          label: '50%',
        });
        trackedRef.current['50%'] = true;
      }

      // 追蹤 75%
      if (scrollPercent >= 75 && !trackedRef.current['75%']) {
        event({
          action: 'scroll',
          category: 'engagement',
          label: '75%',
        });
        trackedRef.current['75%'] = true;
      }

      // 追蹤 100%
      if (scrollPercent >= 100 && !trackedRef.current['100%']) {
        event({
          action: 'scroll',
          category: 'engagement',
          label: '100%',
        });
        trackedRef.current['100%'] = true;
      }
    };

    // 初始檢查（如果頁面內容很短，可能已經在視窗內）
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

