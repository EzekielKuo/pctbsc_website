import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    // 構建查詢條件：如果不是 admin，只顯示公開的留言
    const where = isAdmin ? {} : { isPublic: true };

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('獲取留言錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取留言失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, isPublic } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: '留言內容不能為空' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length > 500) {
      return NextResponse.json(
        { success: false, error: '留言內容不能超過500字' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: trimmedContent,
        author: author?.trim() || null,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('新增留言錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增留言失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必要參數：id' },
        { status: 400 }
      );
    }

    // 只有 admin 可以刪除留言
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: '權限不足，只有管理員可以刪除留言' },
        { status: 403 }
      );
    }

    // 檢查留言是否存在
    const existing = await prisma.message.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '留言不存在' },
        { status: 404 }
      );
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('刪除留言錯誤:', error);
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: '留言不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: '刪除留言失敗' },
      { status: 500 }
    );
  }
}

