---
name: MUI to shadcn Migration
overview: 逐步將專案從 MUI 遷移到 shadcn/ui + Tailwind CSS，優先重構導航系統並採用現代化設計
todos:
  - id: setup-shadcn
    content: 安裝和配置 shadcn/ui 基礎設置，包括依賴項和配置文件
    status: completed
  - id: create-ui-components
    content: 創建核心 UI 組件：navigation-menu, dropdown-menu, button, sheet
    status: completed
  - id: migrate-navigation
    content: 重構 Navigation.tsx 組件，替換所有 MUI 組件為 shadcn/ui
    status: completed
  - id: update-icons
    content: 將 MUI Icons 替換為 Lucide React 圖標
    status: completed
  - id: remove-mui-theme
    content: 移除 MUI 主題系統，更新 layout.tsx
    status: completed
  - id: update-styles
    content: 設置新的 CSS 變數和設計 tokens
    status: completed
  - id: test-functionality
    content: 測試所有導航功能和響應式設計
    status: completed
---

# MUI 轉 shadcn/ui + Tailwind CSS 遷移計劃

## 專案現狀分析

目前專案使用了大量 MUI 組件，包括：

- **導航系統**: [`app/components/Navigation.tsx`](app/components/Navigation.tsx) - AppBar, Toolbar, Menu, MenuItem, Drawer
- **表單組件**: [`app/components/MessageBoard.tsx`](app/components/MessageBoard.tsx), [`app/login/page.tsx`](app/login/page.tsx)  
- **佈局系統**: Container, Grid, Box 在多個組件中使用
- **主題系統**: [`app/theme/ThemeRegistry.tsx`](app/theme/ThemeRegistry.tsx) - MUI ThemeProvider

## 第一階段：基礎設置和導航重構

### 1. 設置 shadcn/ui 環境

**更新依賴項:**

```json
// 添加到 package.json
"@radix-ui/react-navigation-menu": "^1.1.4",
"@radix-ui/react-dropdown-menu": "^2.0.6", 
"@radix-ui/react-dialog": "^1.0.5",
"class-variance-authority": "^0.7.0",
"clsx": "^2.0.0",
"lucide-react": "^0.294.0"
```

**創建 shadcn 配置文件:**

- `components.json` - shadcn/ui 配置
- `lib/utils.ts` - cn() 工具函數（已存在）

### 2. 重構導航系統

**創建新的導航組件:**

- `components/ui/navigation-menu.tsx` - 主導航選單
- `components/ui/dropdown-menu.tsx` - 下拉選單
- `components/ui/button.tsx` - 按鈕組件
- `components/ui/sheet.tsx` - 移動端抽屜選單

**重構 [`app/components/Navigation.tsx`](app/components/Navigation.tsx):**

```typescript
// 替換 MUI 組件為 shadcn/ui 組件
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet } from "@/components/ui/sheet"

// 移除 MUI imports:
// AppBar, Toolbar, Menu, MenuItem, IconButton, Drawer 等
```

**設計更新:**

- 採用現代化的 glass morphism 效果
- 使用 Tailwind 的 backdrop-blur 和漸變背景
- 改善移動端響應式體驗
- 優化下拉選單動畫和互動效果

### 3. 圖標系統遷移

**從 MUI Icons 轉換為 Lucide React:**

```typescript
// 替換對照表
MenuIcon → Menu
CloseIcon → X  
ExpandMoreIcon → ChevronDown
FacebookIcon → Facebook
InstagramIcon → Instagram
```

### 4. 移除 MUI 主題系統

**更新 [`app/layout.tsx`](app/layout.tsx):**

- 移除 `<ThemeRegistry>` wrapper
- 刪除 [`app/theme/ThemeRegistry.tsx`](app/theme/ThemeRegistry.tsx) 和相關文件
- 保留全域 CSS 和 Tailwind 設定

### 5. 漸進式樣式遷移

**CSS 變數配置:**

在 [`app/globals.css`](app/globals.css) 中定義設計 tokens：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* 更多設計變數... */
  }
}
```

## 第二階段：表單組件重構

預留給後續階段：

- 重構 [`app/components/MessageBoard.tsx`](app/components/MessageBoard.tsx)
- 重構 [`app/login/page.tsx`](app/login/page.tsx)
- 創建統一的表單組件庫

## 第三階段：佈局和數據展示組件

預留給後續階段：

- 重構 Container, Grid, Box 佈局系統
- 重構 Card, Paper 等數據展示組件

## 風險與注意事項

1. **響應式設計一致性** - 確保新組件在所有設備上正常運作
2. **既有功能保持** - 所有導航功能（登入狀態、下拉選單）需保持完整
3. **漸進式部署** - 可以並行運行 MUI 和 shadcn 組件
4. **性能影響** - 移除 MUI 後應該減少 bundle size

## 成功指標

- [ ] 導航系統完全使用 shadcn/ui 組件
- [ ] 移動端和桌面端響應式正常
- [ ] 所有既有功能（登入、選單、路由）正常運作
- [ ] Bundle size 減少 20-30%
- [ ] 新的設計系統實施完成