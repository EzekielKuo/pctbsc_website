import { test, expect } from '@playwright/test';

test.describe('首頁基本功能測試', () => {
  test('應該能載入首頁', async ({ page }) => {
    await page.goto('/');
    
    // 檢查頁面標題
    await expect(page).toHaveTitle(/神研班/);
    
    // 檢查主要元素是否存在
    await expect(page.locator('text=63rd神研班').first()).toBeVisible();
  });

  test('導航欄應該正常運作', async ({ page }) => {
    await page.goto('/');
    
    // 檢查導航欄存在
    const navigation = page.locator('nav, [role="banner"]').first();
    await expect(navigation).toBeVisible();
    
    // 檢查導航連結
    const homeLink = page.locator('a:has-text("首頁"), a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });

  test('應該能訪問關於神研班頁面', async ({ page }) => {
    await page.goto('/');
    
    // 點擊關於神研班選單
    await page.locator('button:has-text("關於神研班")').first().hover();
    
    // 點擊營隊介紹連結
    await page.locator('a:has-text("營隊介紹")').first().click();
    
    // 確認已導航到正確頁面
    await expect(page).toHaveURL(/.*\/about/);
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
    
    // 檢查登入頁面元素
    await expect(page.locator('text=登入, text=Log In').first()).toBeVisible();
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


