'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { event } from '@/lib/gtag';

export default function usePageTime() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const pathnameRef = useRef<string>(pathname || '');

  useEffect(() => {
    // 當路徑改變時，記錄上一頁的停留時間
    if (pathnameRef.current && pathnameRef.current !== pathname) {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000); // 轉換為秒
      
      if (timeSpent > 0) {
        event({
          action: 'page_time',
          category: 'engagement',
          label: pathnameRef.current,
          value: timeSpent,
        });
      }
    }

    // 更新開始時間和路徑
    startTimeRef.current = Date.now();
    pathnameRef.current = pathname || '';

    // 當頁面卸載時（如關閉標籤頁），記錄停留時間
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 0) {
        // 在頁面卸載時使用 gtag 發送事件
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_time', {
            event_category: 'engagement',
            event_label: pathnameRef.current,
            value: timeSpent,
          });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // 組件卸載時也記錄停留時間
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 0 && pathnameRef.current) {
        event({
          action: 'page_time',
          category: 'engagement',
          label: pathnameRef.current,
          value: timeSpent,
        });
      }
    };
  }, [pathname]);
}

