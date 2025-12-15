# Google Analytics 4 (GA4) 追蹤指南

## 一、基本設定

### 1. 環境變數設定
在 `.env` 檔案中加入您的 GA4 測量 ID：
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. 取得 GA4 測量 ID
1. 前往 [Google Analytics](https://analytics.google.com/)
2. 建立或選擇您的 GA4 屬性
3. 在「管理」→「資料串流」中找到您的網站串流
4. 複製「測量 ID」（格式：G-XXXXXXXXXX）

## 二、自動追蹤

目前系統已自動追蹤以下項目：

### ✅ 頁面瀏覽（Page Views）
- 所有頁面瀏覽都會自動追蹤
- 包括使用 Next.js 路由切換的頁面
- 在 GA4 中查看：「報表」→ 「參與度」→ 「頁面和畫面」

### ✅ 頁面停留時間（Page Time）
- 自動追蹤用戶在每個頁面的停留時間（以秒為單位）
- 當用戶切換頁面或關閉標籤頁時會記錄停留時間
- 事件名稱：`page_time`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「page_time」

### ✅ 導覽連結點擊（Navigation Clicks）
- 追蹤所有導覽列中的內部連結點擊
- 包括：
  - 首頁 Logo
  - 關於神研班（營隊介紹、重要時程、FAQ）
  - 神研前輩訪談（緣起、各屆訪談）
  - 63神研（神研班主題、活動資訊、活動日程表）
  - 登入/登出按鈕
- 事件類別：`navigation`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「click」→ 篩選「navigation」

### ✅ 外部連結點擊（External Link Clicks）
- 追蹤所有外部連結的點擊
- 包括：
  - 報名網站按鈕
  - Facebook 連結
  - Instagram 連結
  - Footer 中的推薦連結
  - 活動資訊頁面中的報名連結
- 事件類別：`external_link`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「click」→ 篩選「external_link」

### ✅ 留言提交（Message Submit）
- 當用戶在留言板提交留言時自動追蹤
- 會記錄留言類型（公開/不公開）
- 事件類別：`message`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「submit」→ 篩選「message」

### ✅ Instagram 輪播互動（Carousel Interactions）
- 追蹤 Instagram 貼文輪播的左右箭頭點擊
- 事件類別：`carousel`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「click」→ 篩選「carousel」

### ✅ 聯絡方式點擊（Contact Clicks）
- 追蹤 Footer 中 Email 連結的點擊
- 事件類別：`contact`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「click」→ 篩選「contact」

### ✅ 滾動深度追蹤（Scroll Depth）
- 自動追蹤用戶滾動到頁面的 25%、50%、75%、100%
- 了解用戶是否閱讀完整內容
- 事件類別：`engagement`
- 事件動作：`scroll`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「scroll」

### ✅ 頁面載入時間追蹤（Page Load Time）
- 自動追蹤頁面載入效能指標
- 包括：總載入時間、DOM 內容載入時間、首次繪製時間
- 事件類別：`performance`
- 事件動作：`page_load`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「page_load」

### ✅ 使用者 ID 追蹤（User ID）
- 自動追蹤登入用戶的行為
- 使用 username 作為使用者 ID
- 可以在 GA4 中區分一般用戶和管理員的行為
- 在 GA4 中查看：「報表」→ 「探索」→ 「使用者探索」→ 使用「使用者 ID」維度

### ✅ 登入行為追蹤（Login Tracking）
- 追蹤登入成功和失敗
- 事件類別：`authentication`
- 事件動作：`login`
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「login」

### ✅ 圖片輪播互動（Image Carousel Interactions）
- 追蹤輪播自動切換和手動點擊指示器
- 記錄切換到哪張圖片
- 事件類別：`carousel`
- 事件動作：`carousel_switch`（自動切換）、`carousel_click`（點擊指示器）
- 在 GA4 中查看：「報表」→ 「參與度」→ 「事件」→ 搜尋「carousel」

## 三、在 Google Analytics 中查看資料

### 1. 即時報表
- 前往 GA4 控制台
- 左側選單 → 「報表」→ 「即時」
- 可以立即看到目前正在瀏覽網站的訪客
- 可以看到即時的事件觸發（如按鈕點擊、頁面瀏覽等）

### 2. 測試追蹤是否正常
1. 開啟您的網站
2. 在 GA4 即時報表中應該能看到您的瀏覽記錄
3. 點擊一些按鈕和連結，應該能在即時報表中看到事件觸發
4. 如果看不到，請檢查：
   - 瀏覽器是否阻擋了追蹤（如使用 AdBlock）
   - 環境變數是否正確設定
   - 是否重新啟動了開發伺服器

### 3. 查看頁面瀏覽資料
- 「報表」→ 「參與度」→ 「頁面和畫面」
- 可以看到各頁面的瀏覽次數、平均停留時間等

### 4. 查看事件資料
- 「報表」→ 「參與度」→ 「事件」
- 可以看到所有自訂事件的觸發次數和詳細資料
- 可以按事件名稱、類別、標籤進行篩選和分析

### 5. 查看使用者行為流程
- 「報表」→ 「探索」→ 「路徑探索」
- 可以看到用戶在網站中的瀏覽路徑
- 了解用戶最常從哪個頁面進入，又會前往哪些頁面

## 四、自訂事件追蹤

### 基本用法
```typescript
import { event } from '@/lib/gtag';

// 追蹤按鈕點擊
event({
  action: 'click',
  category: 'button',
  label: '報名按鈕',
});

// 追蹤外部連結點擊
event({
  action: 'click',
  category: 'external_link',
  label: '報名網站',
  value: 1,
});

// 追蹤表單提交
event({
  action: 'submit',
  category: 'form',
  label: '留言板',
});
```

### 在 GA4 中查看事件
- 「報表」→ 「參與度」→ 「事件」
- 可以看到所有自訂事件的觸發次數和詳細資料

## 五、常用追蹤範例

### 1. 追蹤外部連結點擊
```typescript
const handleExternalLinkClick = (linkName: string) => {
  event({
    action: 'click',
    category: 'external_link',
    label: linkName,
  });
};
```

### 2. 追蹤表單提交
```typescript
const handleFormSubmit = () => {
  event({
    action: 'submit',
    category: 'form',
    label: '留言板',
  });
};
```

### 3. 追蹤下載
```typescript
const handleDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'file',
    label: fileName,
  });
};
```

### 4. 追蹤影片播放
```typescript
const handleVideoPlay = (videoName: string) => {
  event({
    action: 'play',
    category: 'video',
    label: videoName,
  });
};
```

## 六、除錯技巧

### 1. 使用瀏覽器開發者工具
1. 開啟 Chrome DevTools（F12）
2. 前往「Network」分頁
3. 過濾「gtag」或「collect」
4. 應該能看到 GA4 的請求

### 2. 使用 GA4 DebugView
1. 安裝 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome 擴充功能
2. 啟用後，在 GA4 控制台 → 「設定」→ 「DebugView」中可以看到即時除錯資訊

### 3. 檢查環境變數
```typescript
// 在瀏覽器控制台檢查
console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
```

## 七、留言板即時更新機制

### 自動更新
- 留言板會**每 10 秒自動更新**一次，無需手動重新整理
- 當有人提交新留言時，所有正在瀏覽留言板的用戶會在 10 秒內自動看到新留言
- 提交留言的用戶會立即看到更新（不需要等待 10 秒）

### GA4 追蹤
- 每次有人提交留言時，會自動追蹤到 GA4
- 可以查看留言提交的頻率和類型（公開/不公開）

## 八、注意事項

1. **隱私權政策**：如果您的網站需要符合 GDPR 或其他隱私法規，請確保有適當的同意機制
2. **資料延遲**：
   - **即時報表**：GA4 的即時資料可能會有幾秒鐘的延遲
   - **標準報表**：需要 24-48 小時才會完整顯示
3. **測試環境**：建議在生產環境測試，因為某些瀏覽器擴充功能可能會阻擋本地開發環境的追蹤
4. **留言板更新頻率**：目前設定為每 10 秒更新一次，可以在 `MessageBoard.tsx` 中調整 `setInterval` 的時間間隔

