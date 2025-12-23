# OAuth 登入設定說明

## 環境變數設定

在專案根目錄的 `.env` 檔案中，需要設定以下環境變數：

```env
# NextAuth 設定
AUTH_SECRET=your-secret-key-here  # 使用 `openssl rand -base64 32` 生成

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# 資料庫連線（如果尚未設定）
DATABASE_URL=your-mongodb-connection-string
```

## Google OAuth 設定步驟

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 前往「憑證」頁面，建立 OAuth 2.0 用戶端 ID
5. 設定授權重新導向 URI：
   - 開發環境：`http://localhost:3000/api/auth/callback/google`
   - 生產環境：`https://yourdomain.com/api/auth/callback/google`
6. 複製 Client ID 和 Client Secret 到 `.env` 檔案

## GitHub OAuth 設定步驟

1. 前往 GitHub Settings > Developer settings > OAuth Apps
2. 點擊「New OAuth App」
3. 填寫應用程式資訊：
   - Application name: 你的應用程式名稱
   - Homepage URL: 你的網站 URL
   - Authorization callback URL：
     - 開發環境：`http://localhost:3000/api/auth/callback/github`
     - 生產環境：`https://yourdomain.com/api/auth/callback/github`
4. 複製 Client ID 和 Client Secret 到 `.env` 檔案

## 資料庫設定

執行以下指令以更新資料庫 schema：

```bash
npx prisma db push
```

這會建立 `User` 和 `Account` 資料表，用於儲存 OAuth 使用者資訊。

## 功能說明

### 登入流程

1. 使用者點擊 Google 或 GitHub 登入按鈕
2. 導向至對應的 OAuth 提供者進行授權
3. 授權成功後，系統會檢查使用者是否已設定「使用者 ID」
4. 如果未設定，會顯示使用者 ID 輸入表單（最多 32 字元）
5. 設定完成後，使用者會被導向首頁

### 使用者 ID

- 使用者 ID 是選填的，但建議設定以便識別
- 長度限制：最多 32 字元
- 必須是唯一的（不能與其他使用者重複）
- 可以在登入後隨時修改

## 注意事項

- 確保 `AUTH_SECRET` 是安全的隨機字串
- 生產環境中，請使用 HTTPS
- OAuth 憑證應妥善保管，不要提交到版本控制系統

