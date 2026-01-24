# 大專聖經神學研究班營會網站

第 63 屆大專聖經神學研究班營會官方網站，提供營會介紹、報名資訊、活動日程表等相關資訊。

🌐 **線上網址**: [https://pctbsc-website.vercel.app/](https://pctbsc-website.vercel.app/)

**版本**: v0.3.0

## 技術棧

詳細技術棧請參考 [Technology Stack.md](./Documents/technology_stack.md)

## 功能特色

- 📅 **營會倒數計時器** - 實時顯示距離營會開始的倒數時間
- 📋 **活動資訊與報名** - 詳細的活動資訊、報名時間、費用說明
- 📸 **活動日程表** - 完整的六天活動日程表展示
- 🎯 **神研班主題介紹** - 第 63 屆主題「赦免誰的罪過」詳細介紹
- 💬 **留言板功能** - 公開/不公開留言，管理員可查看所有留言並刪除
- 📸 **圖片管理系統** - 主視覺圖片、輪播圖片、活動日程表、Instagram 貼文整合
- 🔐 **管理員後台** - 完整的內容管理系統，可管理圖片、Instagram 貼文
- 📱 **響應式設計** - 完美適配手機（800px 以下）、平板、桌面設備
- 🎨 **現代化 UI** - 使用 Material-UI 和 Lucide React 圖標，簡潔美觀的使用者介面

## 專案結構

```
pctbsc_website/
├── app/
│   ├── components/          # React 組件
│   │   ├── Navigation.tsx   # 響應式導航欄組件（800px breakpoint）
│   │   ├── Countdown.tsx    # 倒數計時組件
│   │   ├── MessageBoard.tsx # 留言板組件（公開/不公開留言）
│   │   ├── Promotion.tsx    # 宣傳組資訊組件（Instagram 貼文輪播）
│   │   ├── KeyVisual.tsx    # 主視覺圖片組件
│   │   ├── ImageCarousel.tsx # 圖片輪播組件
│   │   └── Footer.tsx       # 頁腳組件
│   ├── api/                 # API 路由
│   │   ├── messages/        # 留言 API
│   │   ├── keyvisual/       # 主視覺圖片 API
│   │   ├── carousel/        # 輪播圖片 API
│   │   ├── schedule/        # 活動日程表 API
│   │   ├── instagram/       # Instagram 貼文 API
│   │   ├── upload/          # 圖片上傳 API
│   │   └── gallery/         # 圖片庫 API
│   ├── bsc/                 # 神研班相關頁面
│   │   ├── theme/           # 神研班主題頁面
│   │   ├── schedule/         # 活動日程表頁面
│   │   └── info/             # 活動資訊與報名頁面
│   ├── about/               # 關於神研班頁面
│   ├── interview/           # 神研前輩訪談頁面
│   ├── edit/                # 管理員後台頁面
│   ├── login/               # 登入頁面
│   ├── page.tsx             # 首頁
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局樣式
├── prisma/                  # Prisma 資料庫設定
│   └── schema.prisma       # 資料庫結構定義
├── lib/                     # 工具函數
│   └── prisma.ts           # Prisma Client 實例
├── Documents/               # 文件資料夾
│   └── technology_stack.md # 技術棧文件
├── public/                  # 靜態資源
├── next.config.ts           # Next.js 配置
├── tsconfig.json            # TypeScript 配置
└── package.json            # 專案依賴
```

## 在 localhost 安裝與測試步驟

### 1. 前置需求
- Node.js 18 以上
- Yarn 或 npm
- MongoDB（本機或雲端皆可）。若要本機快速啟動，可用 Docker：
  ```bash
  docker run -d --name pctbsc-mongo -p 27017:27017 mongo:7
  ```

### 2. 取得與安裝專案
```bash
git clone <repository-url> pctbsc_website
cd pctbsc_website
yarn install  # 或 npm install
```

### 3. 設定環境變數
在專案根目錄建立 `.env.local`，至少需設定下列鍵值（MongoDB URL 必填）：
```bash
DATABASE_URL="mongodb://localhost:27017/pctbsc"
AUTH_SECRET="local-dev-secret"              # NextAuth 必填
GOOGLE_CLIENT_ID=""                         # 若要啟用 Google 登入
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""                         # 若要啟用 GitHub 登入
GITHUB_CLIENT_SECRET=""
CLOUDINARY_CLOUD_NAME=""                    # 若要啟用圖片上傳
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
INSTAGRAM_OEMBED_ACCESS_TOKEN=""            # 選填，用於自動取得貼文描述
NEXT_PUBLIC_GA_MEASUREMENT_ID=""            # 選填，若需 GA
NEXTAUTH_URL="http://localhost:3000"        # 建議於本機加上
```
- 未填 Cloudinary/Instagram 相關變數時，圖片上傳與自動抓取 Instagram 描述會失效，但其餘頁面仍可瀏覽。
- 啟用 OAuth 時，請在 Google/GitHub 後台將回呼網址設為 `http://localhost:3000/api/auth/callback/<provider>`。

### 4. 初始化資料庫
```bash
npx prisma generate
npx prisma db push
```
（會在 `DATABASE_URL` 指向的 MongoDB 建立所需資料表結構）

### 5. 啟動開發伺服器
```bash
yarn dev   # 或 npm run dev
```
打開 [http://localhost:3000](http://localhost:3000) 進行測試。

### 6. 本機登入／測試方式
- **快速測試（無 OAuth）**：在登入頁 `/login` 直接按登入（空白帳密）會以 guest 登入；輸入 `admin` / `admin` 會在本機取得管理員權限，可進入 `/edit`。
- **正式 OAuth**：設定 Google/GitHub 環境變數後，可使用「Sign in with Google/GitHub」登入，登入後需在頁面上設定自訂使用者 ID 才會完成狀態。

### 7. 其他常用指令
- 建置生產版：`yarn build`
- 啟動生產伺服器：`yarn start`
- 程式碼檢查：`yarn lint`

## 開發說明

### 頁面路由

- `/` - 首頁（主視覺、輪播圖片、宣傳組資訊、倒數計時、留言板）
- `/about` - 營會介紹
- `/about/timeline` - 重要時程
- `/bsc/theme` - 神研班主題「赦免誰的罪過」
- `/bsc/info` - 活動資訊與報名資訊
- `/bsc/schedule` - 活動日程表
- `/interview` - 神研前輩訪談（緣起）
- `/interview/chen-nan-zhou` - 第1-7屆｜陳南州牧師
- `/interview/huang-chun-sheng` - 第20屆後｜黃春生牧師
- `/interview/huang-hsu-hui` - 第50屆後｜黃敍慧姊妹
- `/edit` - 管理員後台（需登入）
- `/login` - 登入頁面

### 組件說明

所有組件都使用 TypeScript 編寫，並包含完整的類型定義：

- **Navigation**: 響應式導航欄（800px breakpoint），支援下拉選單和行動裝置選單，使用 Lucide React 圖標
- **Countdown**: 即時倒數計時器，自動更新剩餘時間
- **MessageBoard**: 留言板組件，支援公開/不公開留言，管理員可刪除留言
- **Promotion**: 宣傳組資訊組件，整合 Instagram 貼文，支援橫向滾動
- **KeyVisual**: 主視覺圖片組件
- **ImageCarousel**: 圖片輪播組件，自動輪播功能
- **Footer**: 頁腳，包含聯絡資訊和推薦連結

### 樣式規範

專案使用 Material-UI (MUI) 和 Tailwind CSS 進行樣式設計：

- **UI 框架**: Material-UI 7.3.6
- **圖標庫**: Lucide React 0.561.0
- **響應式設計**: 800px 作為主要 breakpoint
- **主要顏色**: 
  - 主色調：藍色 (`#1976d2`)
  - 強調色：橘色 (`#ff6b35`)
  - 背景：黑色主題（`#000`）與白色卡片

## 程式碼規範

- 所有檔案都使用 TypeScript（`.ts`, `.tsx`）
- 使用 ESLint 進行程式碼檢查
- 遵循 Next.js 和 React 最佳實踐

## 授權

