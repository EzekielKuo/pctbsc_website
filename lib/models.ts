// 圖片資料模型（MongoDB + Cloudinary）
export interface GalleryImage {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string; // Cloudinary URL（必填）
  cloudinaryPublicId?: string; // Cloudinary 公開 ID（建議儲存，用於圖片優化）
  category: '活動花絮' | '歷史常設展' | '宣傳組資訊' | '其他';
  year?: number; // 年份，用於分類
  date?: string; // 日期
  createdAt?: Date;
  updatedAt?: Date;
  order?: number; // 排序順序
}

// 宣傳組資訊模型
export interface PromotionInfo {
  _id?: string;
  title: string;
  content: string;
  images?: string[]; // Cloudinary URL 陣列
  createdAt?: Date;
  updatedAt?: Date;
}

// 採訪內容模型
export interface Interview {
  _id?: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
  images?: string[]; // Cloudinary URL 陣列
  createdAt?: Date;
  updatedAt?: Date;
}

