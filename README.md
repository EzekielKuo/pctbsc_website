# 大專聖經神學研究班營會網站

大專聖經神學研究班營會官方網站，提供營會介紹、報名資訊、FAQ 等相關資訊。

🌐 **線上網址**: [https://pctbsc-website.vercel.app/](https://pctbsc-website.vercel.app/)

## 技術棧

詳細技術棧請參考 [Technology Stack.md](./Documents/Technology%20Stack.md)

## 功能特色

- 📅 **營會倒數計時器** - 實時顯示距離營會開始的倒數時間
- 📋 **重要時程時間線** - 清晰展示報名、選課等重要日期
- 🎯 **營會特色介紹** - 群體查經、信仰伙伴、讀經方法、多元課程
- 💬 **留言板功能** - 公開/不公開留言，管理員可查看所有留言並刪除
- 📸 **圖片管理** - 主視覺圖片、輪播圖片、Instagram 貼文整合
- 🔐 **管理員功能** - 登入系統，管理員可管理留言和內容
- 📱 **響應式設計** - 完美適配手機、平板、桌面設備
- 🎨 **現代化 UI** - 簡潔美觀的使用者介面

## 專案結構

```
pctbsc_website/
├── app/
│   ├── components/          # React 組件
│   │   ├── Navigation.tsx   # 導航欄組件
│   │   ├── Countdown.tsx    # 倒數計時組件
│   │   ├── Timeline.tsx     # 時間線組件
│   │   ├── MessageBoard.tsx # 留言板組件
│   │   ├── Promotion.tsx    # 宣傳組資訊組件
│   │   ├── KeyVisual.tsx    # 主視覺圖片組件
│   │   ├── ImageCarousel.tsx # 圖片輪播組件
│   │   └── Footer.tsx       # 頁腳組件
│   ├── api/                 # API 路由
│   │   ├── messages/        # 留言 API
│   │   ├── keyvisual/       # 主視覺圖片 API
│   │   ├── carousel/        # 輪播圖片 API
│   │   └── instagram/       # Instagram 貼文 API
│   ├── about/               # 關於神研班頁面
│   ├── login/               # 登入頁面
│   ├── page.tsx             # 首頁
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局樣式
├── prisma/                  # Prisma 資料庫設定
│   └── schema.prisma       # 資料庫結構定義
├── lib/                     # 工具函數
│   └── prisma.ts           # Prisma Client 實例
├── public/                  # 靜態資源
├── next.config.ts           # Next.js 配置
├── tsconfig.json            # TypeScript 配置
└── package.json            # 專案依賴
```

## 開始使用

### 前置需求

- Node.js 18+ 
- Yarn 或 npm
- MongoDB 資料庫（用於儲存留言、圖片等資料）

### 環境變數設定

在專案根目錄創建 `.env` 檔案（可參考 `.env.example`），並設定變數。

### 安裝依賴

```bash
yarn install

# Prisma
npx prisma generate
npx prisma db push
```

### 開發模式

```bash
yarn dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 查看網站。

### 建置生產版本

```bash
yarn build
```

### 啟動生產伺服器

```bash
yarn start
```

## 開發說明

### 頁面路由

- `/` - 首頁（營會介紹、倒數計時、時間線）
- `/about` - 營會介紹
- `/registration` - 報名資訊
- `/faq` - 常見問題
- `/prayer` - 代禱與支持
- `/promotion` - 營會推廣
- `/login` - 登入頁面

### 組件說明

所有組件都使用 TypeScript 編寫，並包含完整的類型定義：

- **Navigation**: 響應式導航欄，支援下拉選單和行動裝置選單
- **Countdown**: 即時倒數計時器，自動更新剩餘時間
- **Timeline**: 時間線組件，展示重要時程事件
- **Features**: 網格布局的特色介紹卡片
- **Footer**: 頁腳，包含聯絡資訊和推薦連結

### 樣式規範

專案使用 Tailwind CSS 進行樣式設計，主要顏色：

- 主色調：藍色 (`blue-500`, `blue-600`)
- 背景：白色/灰色 (`white`, `gray-50`, `gray-800`)
- 文字：深灰色 (`gray-700`, `gray-800`)

## 程式碼規範

- 所有檔案都使用 TypeScript（`.ts`, `.tsx`）
- 使用 ESLint 進行程式碼檢查
- 遵循 Next.js 和 React 最佳實踐

## 授權

