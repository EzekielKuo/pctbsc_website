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

    if (typeof doorIndex !== 'number' || doorIndex < 0 || doorIndex > 5) {
      return NextResponse.json(
        { success: false, error: '门索引必须在 0-5 之间' },
        { status: 400 }
      );
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: '链接不能为空' },
        { status: 400 }
      );
    }

    // 使用 upsert 来更新或创建
    const link = await prisma.questionnaireLink.upsert({
      where: { doorIndex },
      update: { url },
      create: { doorIndex, url }
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('更新问卷链接错误:', error);
    return NextResponse.json(
      { success: false, error: '更新问卷链接失败' },
      { status: 500 }
    );
  }
}
