# 大專聖經神學研究班營會網站

大專聖經神學研究班營會官方網站，提供營會介紹、報名資訊、FAQ 等相關資訊。

## 技術棧

- **框架**: [Next.js 16](https://nextjs.org/) (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS 4
- **字體**: Geist Sans & Geist Mono
- **React**: 19.2.0

## 功能特色

- 📅 **營會倒數計時器** - 實時顯示距離營會開始的倒數時間
- 📋 **重要時程時間線** - 清晰展示報名、選課等重要日期
- 🎯 **營會特色介紹** - 群體查經、信仰伙伴、讀經方法、多元課程
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
│   │   ├── Features.tsx     # 特色介紹組件
│   │   └── Footer.tsx       # 頁腳組件
│   ├── page.tsx             # 首頁
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局樣式
├── public/                  # 靜態資源
├── next.config.ts           # Next.js 配置
├── tsconfig.json            # TypeScript 配置
├── postcss.config.ts        # PostCSS 配置
└── eslint.config.ts         # ESLint 配置
```

## 開始使用

### 安裝依賴

```bash
yarn install
```

### 開發模式

```bash
yarn dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 查看網站。

### 建置生產版本

```bash
yarn build
# 或
npm run build
```

### 啟動生產伺服器

```bash
yarn start
# 或
npm start
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

## 部署

### Vercel 部署

最簡單的部署方式是使用 [Vercel Platform](https://vercel.com/new)：

1. 將專案推送到 GitHub
2. 在 Vercel 中匯入專案
3. 自動部署完成

### 其他平台

也可以部署到其他支援 Next.js 的平台，如：
- Netlify
- AWS Amplify
- 自建伺服器（Node.js 環境）

## 聯絡資訊

- **電話**: (02)6604-2232
- **E-mail**: uc@cef.tw
- **網站**: [校園福音團契](https://www.cef.tw)

## 授權

Copyright ©2018 Campus Evangelical Fellowship All Rights Reserved.  
校園福音團契 版權所有
