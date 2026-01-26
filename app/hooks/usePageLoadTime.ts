'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { event } from '@/lib/gtag';

export default function usePageLoadTime() {
  const pathname = usePathname();

  useEffect(() => {
    const pagePath = pathname ?? '';
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        // 等待一小段時間確保所有資源都載入完成
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          const firstPaint = perfData.responseEnd - perfData.navigationStart;
          const extra = { page_path: pagePath };

          if (pageLoadTime > 0) {
            event(
              { action: 'page_load', category: 'performance', label: 'total_load_time', value: Math.round(pageLoadTime) },
              extra
            );
          }
          if (domContentLoaded > 0) {
            event(
              { action: 'page_load', category: 'performance', label: 'dom_content_loaded', value: Math.round(domContentLoaded) },
              extra
            );
          }
          if (firstPaint > 0) {
            event(
              { action: 'page_load', category: 'performance', label: 'first_paint', value: Math.round(firstPaint) },
              extra
            );
          }

          if ('PerformanceObserver' in window) {
            try {
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'navigation') {
                    const navEntry = entry as PerformanceNavigationTiming;
                    const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
                    if (loadTime > 0) {
                      event(
                        { action: 'page_load', category: 'performance', label: 'navigation_load', value: Math.round(loadTime) },
                        extra
                      );
                    }
                  }
                }
              });
              observer.observe({ entryTypes: ['navigation'] });
            } catch {
              // PerformanceObserver 可能不支援，忽略錯誤
            }
          }
        }, 100);
      });
    }
  }, [pathname]);
}

