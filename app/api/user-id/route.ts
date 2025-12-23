import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const { userId } = await request.json();

    // 驗證 userId 長度
    if (!userId || userId.length > 32) {
      return NextResponse.json(
        { error: '使用者 ID 必須小於 32 字元' },
        { status: 400 }
      );
    }

    // 檢查 userId 是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: '此使用者 ID 已被使用' },
        { status: 400 }
      );
    }

    // 更新使用者資料
    await prisma.user.update({
      where: { id: session.user.id },
      data: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('設定使用者 ID 錯誤:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
}

