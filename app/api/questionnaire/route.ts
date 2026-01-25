import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - 获取所有问卷链接
export async function GET() {
  try {
    const links = await prisma.questionnaireLink.findMany({
      orderBy: { doorIndex: 'asc' }
    });
    
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error('获取问卷链接错误:', error);
    return NextResponse.json(
      { success: false, error: '获取问卷链接失败' },
      { status: 500 }
    );
  }
}

// POST - 更新或创建问卷链接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doorIndex, url } = body;

    // 驗證 doorIndex
    if (doorIndex === undefined || doorIndex === null) {
      console.error('缺少 doorIndex 參數:', body);
      return NextResponse.json(
        { success: false, error: '缺少必要參數：doorIndex' },
        { status: 400 }
      );
    }

    // 確保 doorIndex 是數字
    const doorIndexNum = typeof doorIndex === 'string' ? parseInt(doorIndex, 10) : doorIndex;
    
    if (isNaN(doorIndexNum) || doorIndexNum < 0 || doorIndexNum > 5) {
      console.error('無效的 doorIndex:', doorIndex, '類型:', typeof doorIndex);
      return NextResponse.json(
        { success: false, error: '門索引必須在 0-5 之間' },
        { status: 400 }
      );
    }

    // 驗證 url
    if (!url || typeof url !== 'string' || !url.trim()) {
      console.error('無效的 url:', url, '類型:', typeof url);
      return NextResponse.json(
        { success: false, error: '連結不能為空' },
        { status: 400 }
      );
    }

    // 使用 upsert 来更新或创建
    const link = await prisma.questionnaireLink.upsert({
      where: { doorIndex: doorIndexNum },
      update: { url: url.trim() },
      create: { doorIndex: doorIndexNum, url: url.trim() }
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('更新問卷連結錯誤:', error);
    return NextResponse.json(
      { success: false, error: '更新問卷連結失敗' },
      { status: 500 }
    );
  }
}
