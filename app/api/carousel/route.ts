import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  try {
    const images = await prisma.carouselImage.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('獲取輪播圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取輪播圖片失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, publicId, order } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：url' },
        { status: 400 }
      );
    }

    // 如果沒有提供 order，自動計算最大的 order 值並加 1，讓新照片永遠在最後
    let finalOrder = order;
    if (finalOrder === undefined) {
      const maxOrderImage = await prisma.carouselImage.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      finalOrder = maxOrderImage ? maxOrderImage.order + 1 : 0;
    }

    const image = await prisma.carouselImage.create({
      data: {
        url,
        publicId: publicId || null,
        order: finalOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('新增輪播圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增輪播圖片失敗' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, url, publicId, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：id' },
        { status: 400 }
      );
    }

    const updateData: { url?: string; publicId?: string; order?: number } = {};
    if (url) updateData.url = url;
    if (publicId !== undefined) updateData.publicId = publicId;
    if (order !== undefined) updateData.order = order;

    const image = await prisma.carouselImage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('更新輪播圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '更新輪播圖片失敗' },
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

    await prisma.carouselImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('刪除輪播圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '刪除輪播圖片失敗' },
      { status: 500 }
    );
  }
}
