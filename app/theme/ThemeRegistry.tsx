'use client';

import * as React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import EmotionCache from './EmotionCache';
import CustomCssBaseline from './CustomCssBaseline';

/**
 * ThemeRegistry - MUI 主題提供者
 * 
 * 配置說明：
 * - StyledEngineProvider injectFirst: 確保 MUI 樣式插入在 <head> 最前面
 * - EmotionCache: 管理 Emotion 樣式快取
 * - ThemeProvider: 提供 MUI 主題
 * - CssBaseline: 可以選擇使用標準版或自訂版
 * 
 * 診斷選項：
 * - 如果 Tailwind 樣式不顯示，嘗試將 <CssBaseline /> 改為 <CustomCssBaseline />
 * - 或者完全移除 CssBaseline 來測試
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // 完全移除 CssBaseline 以確保 Tailwind 樣式正常
  // 如果需要 MUI 的基礎樣式，可以使用 CustomCssBaseline
  const USE_CUSTOM_BASELINE = false; // 設為 false 完全移除，設為 true 使用自訂版本

  return (
    <StyledEngineProvider injectFirst>
      <EmotionCache>
        <ThemeProvider theme={theme}>
          {/* 
            完全移除 CssBaseline 以確保 Tailwind CSS 樣式正常顯示
            如果 MUI 組件需要基礎樣式，可以啟用 CustomCssBaseline
          */}
          {USE_CUSTOM_BASELINE && <CustomCssBaseline />}
          {children}
        </ThemeProvider>
      </EmotionCache>
    </StyledEngineProvider>
  );
}






