# CI/CD 設定指南

本專案使用 GitHub Actions 進行持續整合與持續部署（CI/CD）。

## 工作流程說明

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

當推送到 `main` 或 `develop` 分支，或建立 Pull Request 時會觸發：

#### Jobs:

1. **Lint & Test**
   - 執行 ESLint 檢查
   - TypeScript 類型檢查
   - 生成 Prisma Client

2. **Build**
   - 建置 Next.js 專案
   - 上傳建置產物作為 artifact

3. **Deploy to Vercel** (僅 main 分支)
   - 自動部署到 Vercel 生產環境

### 2. Deploy Preview (`.github/workflows/deploy-preview.yml`)

當建立 Pull Request 時會觸發：
- 自動建立預覽環境
- 方便在合併前測試變更

## 設定步驟

### 1. GitHub Secrets 設定

在 GitHub 專案設定中（Settings → Secrets and variables → Actions），添加以下 secrets：

#### 必要 Secrets：

- `VERCEL_TOKEN`: Vercel 的 API Token
  - 取得方式：Vercel Dashboard → Settings → Tokens → Create Token

- `VERCEL_ORG_ID`: Vercel 組織 ID
  - 取得方式：Vercel Dashboard → Settings → General → Team ID

- `VERCEL_PROJECT_ID`: Vercel 專案 ID
  - 取得方式：Vercel Dashboard → Settings → General → Project ID

#### 選填 Secrets（用於測試）：

- `DATABASE_URL`: MongoDB 連線字串（用於建置時的 Prisma generate）
- `AUTH_SECRET`: NextAuth 密鑰
- `NEXTAUTH_URL`: NextAuth URL

### 2. Vercel 專案設定

如果尚未在 Vercel 建立專案：

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "Add New Project"
3. 連接 GitHub 儲存庫
4. 設定環境變數（在 Vercel Dashboard 中設定，不需要在 GitHub Secrets 中）

### 3. 環境變數設定

在 Vercel Dashboard 中設定以下環境變數：

```
DATABASE_URL=你的 MongoDB 連線字串
AUTH_SECRET=你的 NextAuth 密鑰
GOOGLE_CLIENT_ID=你的 Google OAuth Client ID
GOOGLE_CLIENT_SECRET=你的 Google OAuth Client Secret
GITHUB_CLIENT_ID=你的 GitHub OAuth Client ID
GITHUB_CLIENT_SECRET=你的 GitHub OAuth Client Secret
CLOUDINARY_CLOUD_NAME=你的 Cloudinary Cloud Name
CLOUDINARY_API_KEY=你的 Cloudinary API Key
CLOUDINARY_API_SECRET=你的 Cloudinary API Secret
NEXTAUTH_URL=你的生產環境 URL
NEXT_PUBLIC_GA_MEASUREMENT_ID=你的 GA Measurement ID（選填）
```

## 工作流程觸發條件

### CI/CD Pipeline

- **Push 到 main/develop**: 執行 lint、測試、建置，並部署（main 分支）
- **Pull Request**: 執行 lint、測試、建置（不部署）

### Deploy Preview

- **Pull Request**: 自動建立預覽環境

## 手動觸發部署

如果需要手動觸發部署，可以：

1. 在 GitHub Actions 頁面點擊 "Run workflow"
2. 或使用 Vercel CLI：
   ```bash
   vercel --prod
   ```

## 故障排除

### 建置失敗

1. 檢查 GitHub Actions logs
2. 確認所有環境變數都已設定
3. 確認 Prisma schema 正確

### 部署失敗

1. 檢查 Vercel Dashboard 的部署 logs
2. 確認 VERCEL_TOKEN、VERCEL_ORG_ID、VERCEL_PROJECT_ID 正確
3. 確認 Vercel 專案已正確連接 GitHub 儲存庫

### Prisma 錯誤

如果建置時出現 Prisma 相關錯誤：

1. 確認 `DATABASE_URL` 在 GitHub Secrets 中已設定（用於 generate）
2. 確認 `npx prisma generate` 在 workflow 中正確執行

## 最佳實踐

1. **分支策略**：
   - `main`: 生產環境
   - `develop`: 開發環境
   - Feature branches: 功能開發

2. **Pull Request**：
   - 所有變更都應該通過 Pull Request
   - 自動建立預覽環境進行測試

3. **測試**：
   - 在本地執行 `yarn lint` 和 `yarn build` 確認無誤後再推送

4. **部署**：
   - 僅 `main` 分支會自動部署到生產環境
   - 其他分支可以手動部署或使用預覽環境

## 相關文件

- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Vercel 部署文件](https://vercel.com/docs)
- [Next.js 部署文件](https://nextjs.org/docs/deployment)


