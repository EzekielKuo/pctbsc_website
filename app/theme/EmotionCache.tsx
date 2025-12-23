'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';

/**
 * EmotionCache 配置 - 修正版
 * 
 * 問題診斷：
 * - 在 Next.js App Router 中，useServerInsertedHTML 會在服務端渲染時插入樣式
 * - 但這些樣式可能會在客戶端 hydration 時被重新插入，導致順序問題
 * - prepend: true 應該將樣式插入在最前面，但需要配合正確的插入點
 * 
 * 解決方案：
 * - 使用 prepend: true 確保 MUI 樣式在 <head> 最前面
 * - 但實際上我們需要 Tailwind 在最後，所以讓 MUI 先插入是對的
 * - 關鍵是確保 Tailwind 的 @layer utilities 有足夠的優先級
 */
export default function EmotionCache({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState(() => {
    // 關鍵修正：prepend: false 讓 Emotion 樣式插入在後面
    // 但配合 injectFirst，MUI 樣式仍會先載入
    // 實際上，我們需要讓 Tailwind 的樣式在最後，所以 Emotion 應該先插入
    // 但問題是 useServerInsertedHTML 可能會在客戶端重新插入
    // 解決方案：使用 prepend: true 但確保 Tailwind 樣式有更高的優先級
    const cache = createCache({ 
      key: 'mui', 
      prepend: true, // 插入在最前面，讓 Tailwind 後載入
      insertionPoint: typeof document !== 'undefined' 
        ? document.querySelector('meta[name="emotion-insertion-point"]') as HTMLElement
        : undefined,
    });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}







