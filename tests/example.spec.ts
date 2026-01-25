import { test, expect } from '@playwright/test';

test.describe('首頁基本功能測試', () => {
  test('應該能載入首頁', async ({ page }) => {
    await page.goto('/');
    
    // 等待頁面載入 - 使用 domcontentloaded 更穩定
    await page.waitForLoadState('domcontentloaded');
    
    // 檢查頁面標題 - 使用更靈活的匹配
    await expect(page).toHaveTitle(/63神研班-2026大專聖經神學研究班|神研班/);
    
    // 檢查主要元素是否存在
    await expect(page.locator('text=63rd神研班').first()).toBeVisible({ timeout: 10000 });
  });

  test('導航欄應該正常運作', async ({ page }) => {
    await page.goto('/');
    
    // 等待頁面載入 - 使用 domcontentloaded 更穩定
    await page.waitForLoadState('domcontentloaded');
    
    // 檢查導航欄 Logo 文字（在所有視窗大小都可見）
    const logo = page.locator('text=63rd神研班').first();
    await expect(logo).toBeVisible({ timeout: 15000 });
    
    // 檢查導航連結 - 檢查首頁連結（在所有視窗大小都可見）
    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible({ timeout: 10000 });
  });

});

test.describe('響應式設計測試', () => {
  test('手機版導航應該正常運作', async ({ page }) => {
    // 設定手機視窗大小
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // 檢查手機版選單按鈕是否存在
    const menuButton = page.locator('button[aria-label*="menu"], button:has([class*="Menu"])').first();
    
    // 如果存在選單按鈕，點擊它
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      
      // 檢查選單是否打開
      const drawer = page.locator('[role="dialog"], [class*="Drawer"]').first();
      await expect(drawer).toBeVisible();
    }
  });
});

test.describe('登入功能測試', () => {
  test('應該能訪問登入頁面', async ({ page }) => {
    await page.goto('/login');
    
    // 等待頁面載入 - 使用 domcontentloaded 更穩定
    await page.waitForLoadState('domcontentloaded');
    
    // 檢查登入頁面元素 - 查找登入標題
    await expect(page.locator('text=登入').first()).toBeVisible({ timeout: 15000 });
  });
});

test.describe('頁面可訪問性測試', () => {
  test('首頁應該有適當的語義化標籤', async ({ page }) => {
    await page.goto('/');
    
    // 檢查是否有 main 標籤
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('圖片應該有 alt 屬性', async ({ page }) => {
    await page.goto('/');
    
    // 檢查主要圖片是否有 alt 屬性
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});


