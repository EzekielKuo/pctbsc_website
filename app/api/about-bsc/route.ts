import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - 獲取「什麼是神研班？」內容
export async function GET() {
  try {
    const aboutBSC = await prisma.aboutBSC.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: aboutBSC,
    });
  } catch (error) {
    console.error('獲取「什麼是神研班？」內容錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取內容失敗' },
      { status: 500 }
    );
  }
}

// POST - 更新「什麼是神研班？」內容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: '內容不能為空' },
        { status: 400 }
      );
    }

    // 檢查是否已存在記錄
    const existing = await prisma.aboutBSC.findFirst();

    let aboutBSC;
    if (existing) {
      // 更新現有記錄
      aboutBSC = await prisma.aboutBSC.update({
        where: { id: existing.id },
        data: { content },
      });
    } else {
      // 創建新記錄
      aboutBSC = await prisma.aboutBSC.create({
        data: { content },
      });
    }

    return NextResponse.json({
      success: true,
      data: aboutBSC,
    });
  } catch (error) {
    console.error('更新「什麼是神研班？」內容錯誤:', error);
    return NextResponse.json(
      { success: false, error: '更新內容失敗' },
      { status: 500 }
    );
  }
}
