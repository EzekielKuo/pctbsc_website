# Tailwind CSS 與 MUI 樣式衝突修復指南

## 問題診斷

### 1. EmotionCache 診斷

**問題**：在 Next.js App Router 中，`useServerInsertedHTML` 可能會在客戶端 hydration 時重新插入樣式，導致樣式順序不正確。

**解決方案**：
- 使用 `prepend: true` 確保 Emotion 樣式插入在最前面
- 添加 `insertionPoint` 來控制插入位置
- 檢查 `data-emotion` 屬性來確認樣式標籤

### 2. 樣式載入順序

**預期順序（從前到後）**：
1. MUI Emotion 樣式（`<style data-emotion="mui ...">`）
2. Tailwind globals.css（`<link rel="stylesheet">` 或內聯樣式）
3. Tailwind utility classes（通過 className 應用）

**為什麼這樣有效**：
- CSS 的層疊規則：後載入的樣式優先級更高
- 如果 MUI 樣式在前，Tailwind 樣式在後，Tailwind 可以覆蓋 MUI

### 3. CssBaseline 問題

**問題**：`CssBaseline` 會重置很多樣式，包括：
- `margin: 0`
- `padding: 0`
- `box-sizing: border-box`
- 字體樣式

這些重置可能會覆蓋 Tailwind 的 utility classes。

**解決方案**：
1. 使用自訂 `CustomCssBaseline`（只重置必要樣式）
2. 或完全移除 `CssBaseline`
3. 在 `globals.css` 的 `@layer base` 中重新定義需要的重置

## 修復步驟

### 步驟 1：檢查樣式載入順序

1. 打開瀏覽器開發者工具
2. 檢查 `<head>` 區塊中的樣式標籤順序
3. 確認 `data-emotion="mui"` 的樣式在最前面
4. 確認 `globals.css` 或 Tailwind 樣式在後面

### 步驟 2：測試 CssBaseline

在 `ThemeRegistry.tsx` 中：

```tsx
// 選項 1：使用自訂 CssBaseline
const USE_CUSTOM_BASELINE = true;

// 選項 2：完全移除 CssBaseline
// 註解掉 <CssBaseline /> 或 <CustomCssBaseline />
```

### 步驟 3：使用 @layer 提高優先級

在 `globals.css` 中：

```css
@layer utilities {
  /* Tailwind utilities 會自動在這個 layer 中 */
  /* 這個 layer 的優先級最高 */
}
```

### 步驟 4：診斷模式

使用 `layout-diagnostic.tsx` 來診斷：

1. 備份 `layout.tsx`
2. 將 `layout-diagnostic.tsx` 重命名為 `layout.tsx`
3. 檢查瀏覽器控制台的診斷訊息
4. 確認樣式載入順序

## 常見問題

### Q: 為什麼 Tailwind 樣式還是不顯示？

A: 檢查以下幾點：
1. `globals.css` 是否正確導入
2. Tailwind 的 `@import 'tailwindcss'` 是否在檔案最前面
3. `CssBaseline` 是否重置了相關樣式
4. 瀏覽器快取是否清除

### Q: 如何確認 Tailwind 樣式優先級？

A: 在瀏覽器開發者工具中：
1. 選擇一個元素
2. 查看 Computed 樣式
3. 確認 Tailwind 的 class 是否被應用
4. 如果被 MUI 覆蓋，檢查樣式順序

### Q: 可以同時使用 MUI 和 Tailwind 嗎？

A: 可以，但需要：
1. 正確配置樣式載入順序
2. 使用 `@layer` 來管理優先級
3. 避免 `CssBaseline` 重置 Tailwind 需要的樣式

## 測試清單

- [ ] 樣式載入順序正確（MUI 在前，Tailwind 在後）
- [ ] `Card` 組件正常顯示（有背景、邊框、陰影）
- [ ] `Button` 組件正常顯示（有背景色、文字顏色）
- [ ] `flex` 佈局正常（元素正確排列）
- [ ] Tailwind utility classes 正常應用
- [ ] MUI 組件仍然正常顯示

## 最終配置

如果所有修復都無效，嘗試：

1. **完全移除 CssBaseline**：
```tsx
// ThemeRegistry.tsx
export default function ThemeRegistry({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <EmotionCache>
        <ThemeProvider theme={theme}>
          {/* 完全移除 CssBaseline */}
          {children}
        </ThemeProvider>
      </EmotionCache>
    </StyledEngineProvider>
  );
}
```

2. **在 globals.css 中手動重置**：
```css
@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
```

3. **使用 !important（最後手段）**：
```css
@layer utilities {
  .tw-override {
    /* 使用 !important 強制覆蓋 */
  }
}
```

