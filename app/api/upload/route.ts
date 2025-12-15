import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

// 設定路由配置以增加超時時間
export const maxDuration = 60; // 60 秒（Vercel Pro 計劃支援，免費計劃為 10 秒）
export const dynamic = 'force-dynamic';

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

    // 檢查檔案大小（限制為 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '檔案大小不能超過 10MB' },
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
  } catch (error: any) {
    console.error('上傳圖片錯誤:', error);
    
    // 提供更詳細的錯誤訊息
    let errorMessage = '上傳圖片失敗';
    if (error?.error?.message) {
      if (error.error.message.includes('Timeout') || error.error.http_code === 499) {
        errorMessage = '上傳超時，請檢查網路連線或稍後再試';
      } else {
        errorMessage = `上傳失敗: ${error.error.message}`;
      }
    } else if (error?.message) {
      errorMessage = `上傳失敗: ${error.message}`;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

