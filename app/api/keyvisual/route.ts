import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  try {
    const keyVisual = await prisma.keyVisual.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: keyVisual });
  } catch (error) {
    console.error('獲取主視覺圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取主視覺圖片失敗' },
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

    // 刪除舊的主視覺圖片（只保留一張）
    await prisma.keyVisual.deleteMany({});

    // 創建新的主視覺圖片
    const keyVisual = await prisma.keyVisual.create({
      data: {
        url,
        publicId: publicId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: keyVisual,
    });
  } catch (error) {
    console.error('新增主視覺圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增主視覺圖片失敗' },
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
    const existing = await prisma.keyVisual.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '主視覺圖片不存在' },
        { status: 404 }
      );
    }

    await prisma.keyVisual.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('刪除主視覺圖片錯誤:', error);
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: '主視覺圖片不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: '刪除主視覺圖片失敗' },
      { status: 500 }
    );
  }
}

