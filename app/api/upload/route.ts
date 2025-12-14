import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '沒有上傳檔案' },
        { status: 400 }
      );
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: '只能上傳圖片檔案' },
        { status: 400 }
      );
    }

    // 將檔案轉換為 base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // 上傳到 Cloudinary
    const result = await uploadImageToCloudinary(dataUri, 'pctbsc/carousel');

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    console.error('上傳圖片錯誤:', error);
    return NextResponse.json(
      { success: false, error: '上傳圖片失敗' },
      { status: 500 }
    );
  }
}

