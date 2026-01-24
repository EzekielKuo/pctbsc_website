# Playwright 測試設定指南

本專案使用 Playwright 進行端對端（E2E）測試。

## 安裝

Playwright 已經在 `package.json` 中定義為開發依賴。執行以下指令安裝：

```bash
yarn install
```

安裝完成後，需要安裝瀏覽器：

```bash
npx playwright install
```

或安裝所有瀏覽器（包含系統依賴）：

```bash
npx playwright install --with-deps
```

## 執行測試

### 基本指令

```bash
# 執行所有測試
yarn test

# 使用 UI 模式執行測試（推薦用於開發）
yarn test:ui

# 使用 debug 模式執行測試
yarn test:debug

# 查看測試報告
yarn test:report
```

### 執行特定測試

```bash
# 執行特定檔案
npx playwright test tests/example.spec.ts

# 執行特定瀏覽器
npx playwright test --project=chromium

# 執行特定標籤的測試
npx playwright test --grep "首頁"
```

## 測試結構

```
tests/
├── example.spec.ts    # 基本功能測試
└── admin.spec.ts     # 管理員後台測試
```

## 測試配置

測試配置位於 `playwright.config.ts`，主要設定包括：

- **測試目錄**: `./tests`
- **基礎 URL**: `http://localhost:3000`（可透過 `PLAYWRIGHT_TEST_BASE_URL` 環境變數覆蓋）
- **瀏覽器**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **自動啟動開發伺服器**: 測試執行時會自動啟動 Next.js 開發伺服器

## 撰寫測試

### 基本測試範例

```typescript
import { test, expect } from '@playwright/test';

test('應該能載入首頁', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/神研班/);
});
```

### 測試最佳實踐

1. **使用描述性的測試名稱**
   ```typescript
   test('使用者應該能夠成功登入', async ({ page }) => {
     // ...
   });
   ```

2. **使用 Page Object Model（可選）**
   對於複雜的頁面，可以建立 Page Object 來封裝頁面邏輯。

3. **使用適當的等待**
   ```typescript
   // 等待元素可見
   await expect(page.locator('.button')).toBeVisible();
   
   // 等待導航
   await page.waitForURL('**/about');
   ```

4. **使用測試裝置**
   ```typescript
   test('手機版測試', async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     // ...
   });
   ```

## CI/CD 整合

Playwright 測試已經整合到 GitHub Actions CI/CD pipeline 中：

1. **自動執行**: 每次 push 或 PR 時自動執行
2. **多瀏覽器測試**: 在 CI 中執行 Chromium 測試
3. **測試報告**: 測試結果會上傳為 artifact

## 除錯測試

### 使用 UI 模式

```bash
yarn test:ui
```

這會開啟 Playwright 的互動式 UI，可以：
- 查看測試執行過程
- 逐步執行測試
- 查看時間軸和網路請求

### 使用 Debug 模式

```bash
yarn test:debug
```

這會開啟 Playwright Inspector，可以：
- 逐步執行測試
- 查看頁面狀態
- 執行任意 Playwright 指令

### 查看測試報告

```bash
yarn test:report
```

這會開啟 HTML 測試報告，包含：
- 測試結果
- 失敗截圖
- 執行時間軸
- 網路請求記錄

## 常見問題

### 測試失敗但本地正常

1. 檢查環境變數是否正確設定
2. 確認資料庫連線正常
3. 檢查測試是否依賴外部服務

### 測試執行緩慢

1. 使用 `--project=chromium` 只測試單一瀏覽器
2. 使用 `--workers=1` 減少並行執行
3. 檢查是否有不必要的等待

### 元素找不到

1. 使用 `page.pause()` 暫停測試並檢查頁面狀態
2. 確認選擇器是否正確
3. 檢查是否需要等待元素載入

## 相關資源

- [Playwright 官方文件](https://playwright.dev/)
- [Playwright 最佳實踐](https://playwright.dev/docs/best-practices)
- [Playwright API 參考](https://playwright.dev/docs/api/class-playwright)


