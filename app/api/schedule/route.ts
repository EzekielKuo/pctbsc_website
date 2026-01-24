import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const schedule = await prisma.scheduleImage.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    console.error('獲取活動日程表錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取活動日程表失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, publicId } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：url' },
        { status: 400 }
      );
    }

    // 刪除舊的活動日程表（只保留一張）
    await prisma.scheduleImage.deleteMany({});

    // 創建新的活動日程表
    const schedule = await prisma.scheduleImage.create({
      data: {
        url,
        publicId: publicId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('新增活動日程表錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增活動日程表失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必要參數：id' },
        { status: 400 }
      );
    }

    // 檢查記錄是否存在
    const existing = await prisma.scheduleImage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '活動日程表不存在' },
        { status: 404 }
      );
    }

    await prisma.scheduleImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('刪除活動日程表錯誤:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: '活動日程表不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: '刪除活動日程表失敗' },
      { status: 500 }
    );
  }
}

