import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SECTION_KEYS = ['專講', '工作坊', '小組討論', '小書房', '獻心會'] as const;

// GET: 取得所有神研班介紹區塊圖片（或單一 sectionKey）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionKey = searchParams.get('sectionKey');

    if (sectionKey) {
      if (!SECTION_KEYS.includes(sectionKey as (typeof SECTION_KEYS)[number])) {
        return NextResponse.json(
          { success: false, error: '無效的 sectionKey' },
          { status: 400 }
        );
      }
      const image = await prisma.introSectionImage.findUnique({
        where: { sectionKey },
      });
      return NextResponse.json({ success: true, data: image });
    }

    const images = await prisma.introSectionImage.findMany({
      orderBy: { sectionKey: 'asc' },
    });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error('獲取神研班介紹區塊圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取圖片失敗' },
      { status: 500 }
    );
  }
}

// POST: 新增或更新單一區塊圖片（依 sectionKey upsert）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sectionKey, url, publicId } = body;

    if (!sectionKey || !url) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：sectionKey、url' },
        { status: 400 }
      );
    }

    if (!SECTION_KEYS.includes(sectionKey as (typeof SECTION_KEYS)[number])) {
      return NextResponse.json(
        { success: false, error: '無效的 sectionKey' },
        { status: 400 }
      );
    }

    const image = await prisma.introSectionImage.upsert({
      where: { sectionKey },
      create: { sectionKey, url, publicId: publicId || null },
      update: { url, publicId: publicId ?? undefined },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('新增/更新神研班介紹區塊圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '儲存圖片失敗' },
      { status: 500 }
    );
  }
}

// DELETE: 刪除單一區塊圖片（依 id 或 sectionKey）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const sectionKey = searchParams.get('sectionKey');

    if (id) {
      await prisma.introSectionImage.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    }

    if (sectionKey) {
      if (!SECTION_KEYS.includes(sectionKey as (typeof SECTION_KEYS)[number])) {
        return NextResponse.json(
          { success: false, error: '無效的 sectionKey' },
          { status: 400 }
        );
      }
      await prisma.introSectionImage.delete({
        where: { sectionKey },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: '請提供 id 或 sectionKey' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('刪除神研班介紹區塊圖片錯誤:', error);
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: '圖片不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: '刪除圖片失敗' },
      { status: 500 }
    );
  }
}
