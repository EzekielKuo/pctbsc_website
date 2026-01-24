import { test, expect } from '@playwright/test';

test.describe('管理員後台測試', () => {
  test('未登入時應該被導向登入頁', async ({ page }) => {
    await page.goto('/edit');
    
    // 應該被導向到登入頁
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('登入後應該能訪問管理後台', async ({ page }) => {
    // 先登入（這裡需要根據實際登入流程調整）
    await page.goto('/login');
    
    // 如果使用 OAuth，可能需要模擬登入流程
    // 或者使用測試用的登入方式
    
    // 暫時跳過，需要根據實際登入機制調整
    test.skip();
  });
});


