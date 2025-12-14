import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { GalleryImage } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const limit = searchParams.get('limit');

    const db = await getDatabase();
    const collection = db.collection<GalleryImage>('gallery');

    // 建立查詢條件
    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (year) {
      query.year = parseInt(year);
    }

    // 建立查詢
    let queryResult = collection.find(query).sort({ order: 1, createdAt: -1 });

    // 限制數量
    if (limit) {
      queryResult = queryResult.limit(parseInt(limit));
    }

    const images = await queryResult.toArray();

    // 轉換 _id 為字串
    const formattedImages = images.map((image) => ({
      ...image,
      _id: image._id?.toString(),
    }));

    return NextResponse.json({ success: true, data: formattedImages });
  } catch (error) {
    console.error('獲取圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取圖片失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, cloudinaryPublicId, category, year, date, order } = body;

    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：title, imageUrl, category' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection<GalleryImage>('gallery');

    const newImage: Omit<GalleryImage, '_id'> = {
      title,
      description,
      imageUrl, // Cloudinary URL
      cloudinaryPublicId, // Cloudinary 公開 ID（可選，但建議儲存以便後續優化）
      category,
      year: year ? parseInt(year) : undefined,
      date,
      order: order ? parseInt(order) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newImage as any);

    return NextResponse.json({
      success: true,
      data: { ...newImage, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error('新增圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增圖片失敗' },
      { status: 500 }
    );
  }
}
