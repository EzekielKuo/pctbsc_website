# GA4 額外追蹤功能說明

## 一、GA4 可以追蹤的項目

### 1. 使用者行為追蹤
- ✅ **頁面瀏覽**（已實作）
- ✅ **頁面停留時間**（已實作）
- ✅ **按鈕/連結點擊**（已實作）
- ⬜ **滾動深度**（Scroll Depth）- 追蹤用戶滾動到頁面的 25%、50%、75%、100%
- ⬜ **元素可見度**（Element Visibility）- 追蹤特定元素是否被用戶看到
- ⬜ **表單互動**（Form Interactions）- 追蹤表單欄位的填寫、錯誤等
- ⬜ **搜尋行為**（Site Search）- 如果有搜尋功能，追蹤搜尋關鍵字

### 2. 媒體內容追蹤
- ⬜ **影片播放**（Video Engagement）- 追蹤影片播放、暫停、完成度
- ⬜ **圖片點擊**（Image Clicks）- 追蹤圖片點擊和查看
- ⬜ **輪播互動**（部分已實作）- 追蹤輪播切換、停留時間

### 3. 電子商務追蹤
- ⬜ **購買流程**（Purchase）- 追蹤購買、結帳流程
- ⬜ **購物車**（Add to Cart）- 追蹤加入購物車行為
- ⬜ **產品瀏覽**（View Item）- 追蹤產品頁面瀏覽

### 4. 使用者屬性追蹤
- ⬜ **使用者 ID**（User ID）- 追蹤登入用戶的行為
- ⬜ **自訂維度**（Custom Dimensions）- 追蹤用戶類型、會員等級等
- ⬜ **地理位置**（自動）- GA4 自動追蹤

### 5. 技術追蹤
- ⬜ **錯誤追蹤**（Exceptions）- 追蹤 JavaScript 錯誤
- ⬜ **載入時間**（Page Load Time）- 追蹤頁面載入速度
- ⬜ **瀏覽器/裝置資訊**（自動）- GA4 自動追蹤

### 6. 轉換追蹤
- ⬜ **轉換事件**（Conversions）- 標記重要事件為轉換
- ⬜ **目標完成**（Goal Completion）- 追蹤特定目標達成

## 二、針對此網站建議追蹤的項目

### 高優先級（建議實作）

#### 1. 滾動深度追蹤
**用途**：了解用戶是否閱讀完整內容
```typescript
// 追蹤用戶滾動到頁面的 25%、50%、75%、100%
event({
  action: 'scroll',
  category: 'engagement',
  label: '25%', // 或 '50%', '75%', '100%'
});
```

#### 2. 圖片輪播互動
**用途**：了解用戶對輪播圖片的興趣
- 追蹤輪播切換（自動切換 vs 手動點擊）
- 追蹤輪播指示器點擊
- 追蹤每張圖片被查看的時間

#### 3. 登入行為追蹤
**用途**：了解管理員使用情況
- 追蹤登入成功/失敗
- 追蹤登入嘗試次數

#### 4. 表單錯誤追蹤
**用途**：改善表單使用體驗
- 追蹤表單驗證錯誤
- 追蹤表單提交失敗原因

### 中優先級（可選實作）

#### 5. 元素可見度追蹤
**用途**：了解重要內容是否被看到
- 追蹤關鍵區塊（如報名資訊、活動資訊）是否進入視窗
- 追蹤 CTA 按鈕是否被看到

#### 6. 圖片點擊追蹤
**用途**：了解用戶對哪些圖片感興趣
- 追蹤主視覺圖片點擊
- 追蹤活動日程表圖片點擊（放大查看）

#### 7. 搜尋行為（如果有搜尋功能）
**用途**：了解用戶在找什麼
- 追蹤搜尋關鍵字
- 追蹤搜尋結果點擊

### 低優先級（進階功能）

#### 8. 使用者區分追蹤
**用途**：區分一般用戶和管理員的行為
- 使用 User ID 追蹤登入用戶
- 建立自訂維度區分用戶類型

#### 9. 錯誤追蹤
**用途**：監控網站穩定性
- 追蹤 JavaScript 錯誤
- 追蹤 API 請求失敗

#### 10. 效能追蹤
**用途**：監控網站載入速度
- 追蹤頁面載入時間
- 追蹤圖片載入時間

## 三、實作範例

### 滾動深度追蹤
```typescript
// hooks/useScrollDepth.ts
'use client';
import { useEffect } from 'react';
import { event } from '@/lib/gtag';

export default function useScrollDepth() {
  useEffect(() => {
    const tracked = { '25%': false, '50%': false, '75%': false, '100%': false };
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent >= 25 && !tracked['25%']) {
        event({ action: 'scroll', category: 'engagement', label: '25%' });
        tracked['25%'] = true;
      }
      if (scrollPercent >= 50 && !tracked['50%']) {
        event({ action: 'scroll', category: 'engagement', label: '50%' });
        tracked['50%'] = true;
      }
      if (scrollPercent >= 75 && !tracked['75%']) {
        event({ action: 'scroll', category: 'engagement', label: '75%' });
        tracked['75%'] = true;
      }
      if (scrollPercent >= 100 && !tracked['100%']) {
        event({ action: 'scroll', category: 'engagement', label: '100%' });
        tracked['100%'] = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
```

### 元素可見度追蹤
```typescript
// hooks/useElementVisibility.ts
'use client';
import { useEffect, useRef } from 'react';
import { event } from '@/lib/gtag';

export default function useElementVisibility(elementRef: React.RefObject<HTMLElement>, label: string) {
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            event({
              action: 'view',
              category: 'element_visibility',
              label: label,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 } // 當 50% 的元素可見時觸發
    );
    
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef, label]);
}
```

### 登入行為追蹤
```typescript
// 在 login/page.tsx 中
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // ... 登入邏輯 ...
    
    if (success) {
      event({
        action: 'login',
        category: 'authentication',
        label: 'success',
      });
    } else {
      event({
        action: 'login',
        category: 'authentication',
        label: 'failure',
      });
    }
  } catch (error) {
    event({
      action: 'login',
      category: 'authentication',
      label: 'error',
    });
  }
};
```

## 四、在 GA4 中查看這些資料

### 1. 建立自訂報表
- 「報表」→ 「探索」→ 「空白」
- 可以建立自訂的分析報表

### 2. 建立轉換事件
- 「設定」→ 「轉換事件」
- 將重要事件標記為轉換（如：報名網站點擊、留言提交）

### 3. 建立受眾
- 「設定」→ 「受眾」
- 根據行為建立受眾群組（如：深度參與用戶、高價值用戶）

### 4. 建立漏斗分析
- 「報表」→ 「探索」→ 「漏斗探索」
- 追蹤用戶從進入網站到完成目標的流程

## 五、建議實作順序

1. **滾動深度追蹤** - 簡單且實用，了解內容參與度
2. **圖片輪播互動** - 了解用戶對視覺內容的興趣
3. **登入行為追蹤** - 了解管理功能使用情況
4. **元素可見度追蹤** - 確保重要內容被看到
5. **錯誤追蹤** - 監控網站穩定性

## 六、注意事項

1. **隱私權**：確保追蹤符合 GDPR 和其他隱私法規
2. **效能**：過多的追蹤可能影響網站效能
3. **資料品質**：確保追蹤的事件有意義且可分析
4. **測試**：在生產環境前充分測試所有追蹤功能

