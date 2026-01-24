'use client';

import { useEffect } from 'react';
import { event } from '@/lib/gtag';

export default function usePageLoadTime() {
  useEffect(() => {
    // 使用 Performance API 追蹤頁面載入時間
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        // 等待一小段時間確保所有資源都載入完成
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          const firstPaint = perfData.responseEnd - perfData.navigationStart;

          // 追蹤總載入時間（毫秒）
          if (pageLoadTime > 0) {
            event({
              action: 'page_load',
              category: 'performance',
              label: 'total_load_time',
              value: Math.round(pageLoadTime),
            });
          }

          // 追蹤 DOM 內容載入時間
          if (domContentLoaded > 0) {
            event({
              action: 'page_load',
              category: 'performance',
              label: 'dom_content_loaded',
              value: Math.round(domContentLoaded),
            });
          }

          // 追蹤首次繪製時間
          if (firstPaint > 0) {
            event({
              action: 'page_load',
              category: 'performance',
              label: 'first_paint',
              value: Math.round(firstPaint),
            });
          }

          // 使用 Performance Navigation Timing API v2（如果可用）
          if ('PerformanceObserver' in window) {
            try {
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'navigation') {
                    const navEntry = entry as PerformanceNavigationTiming;
                    const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
                    
                    if (loadTime > 0) {
                      event({
                        action: 'page_load',
                        category: 'performance',
                        label: 'navigation_load',
                        value: Math.round(loadTime),
                      });
                    }
                  }
                }
              });
              observer.observe({ entryTypes: ['navigation'] });
            } catch (e) {
              // PerformanceObserver 可能不支援，忽略錯誤
            }
          }
        }, 100);
      });
    }
  }, []);
}

