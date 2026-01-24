'use client';

import * as React from 'react';
import { GlobalStyles } from '@mui/material';

/**
 * 自訂 CssBaseline - 避免重置 Tailwind 需要的樣式
 * 
 * 這個組件替代標準的 CssBaseline，只重置必要的樣式，
 * 而不會干擾 Tailwind CSS 的 utility classes
 */
export default function CustomCssBaseline() {
  return (
    <GlobalStyles
      styles={{
        // 只重置必要的樣式，避免與 Tailwind 衝突
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          // 不重置 margin/padding，讓 Tailwind 控制
        },
        // 不重置 body 的 margin/padding，讓 Tailwind 的 @layer base 控制
        // 不重置 * 選擇器，避免覆蓋 Tailwind utilities
      }}
    />
  );
}

