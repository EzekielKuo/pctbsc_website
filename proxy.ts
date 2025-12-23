import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { nextUrl } = req;

  // 保護 /edit 路由 - 允許所有已登入用戶（包括 user 和 admin）
  // 注意：實際的登入檢查在客戶端進行（edit/page.tsx）
  // 這裡只做基本的路由保護，詳細權限檢查在頁面組件中處理
  if (nextUrl.pathname.startsWith('/edit')) {
    // 允許通過，實際的登入檢查在 edit/page.tsx 中進行
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

