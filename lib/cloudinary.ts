import { v2 as cloudinary } from 'cloudinary';

// 初始化 Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };

// 上傳圖片到 Cloudinary
export async function uploadImageToCloudinary(
  file: Buffer | string,
  folder: string = 'pctbsc/gallery'
): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary 未配置，請設定環境變數');
  }

  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
      timeout: 60000, // 60 秒超時
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary 上傳錯誤:', error);
    throw error;
  }
}

// 生成優化後的圖片 URL
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return '';
  }

  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push('q_auto', 'f_auto');

  return cloudinary.url(publicId, {
    transformation: [{ width, height, quality: 'auto', fetch_format: 'auto' }],
  });
}

// 從 Cloudinary 獲取資源列表
export async function getCloudinaryResources(options: {
  folder?: string;
  maxResults?: number;
  tags?: string[];
  context?: boolean;
} = {}): Promise<any[]> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary 未配置，請設定環境變數');
  }

  try {
    const result = await cloudinary.search
      .expression(
        options.folder
          ? `folder:${options.folder}`
          : options.tags
          ? options.tags.map((tag) => `tags:${tag}`).join(' AND ')
          : 'resource_type:image'
      )
      .max_results(options.maxResults || 500)
      .with_field('context')
      .with_field('tags')
      .sort_by('created_at', 'desc')
      .execute();

    return result.resources || [];
  } catch (error) {
    console.error('Cloudinary 獲取資源錯誤:', error);
    throw error;
  }
}

// 將 Cloudinary 資源轉換為 GalleryImage
export function transformCloudinaryResource(resource: any): any {
  const context = resource.context || {};
  const folder = resource.folder || '';
  
  // 從 folder 路徑判斷分類
  let category: '活動花絮' | '歷史常設展' | '宣傳組資訊' | '其他' = '其他';
  if (folder.includes('活動花絮') || folder.includes('activity')) {
    category = '活動花絮';
  } else if (folder.includes('歷史常設展') || folder.includes('exhibition')) {
    category = '歷史常設展';
  } else if (folder.includes('宣傳組資訊') || folder.includes('promotion')) {
    category = '宣傳組資訊';
  }

  return {
    publicId: resource.public_id,
    url: resource.secure_url,
    title: context.caption || context.title || resource.filename || resource.public_id.split('/').pop(),
    description: context.description || context.alt || undefined,
    category: context.category || category,
    year: context.year ? parseInt(context.year) : undefined,
    date: context.date || undefined,
    width: resource.width,
    height: resource.height,
    format: resource.format,
    bytes: resource.bytes,
    createdAt: resource.created_at,
  };
}

