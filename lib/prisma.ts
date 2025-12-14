import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 確保 DATABASE_URL 存在（從 MONGODB_URI 映射）
// 優先使用 MONGODB_URI（如果存在），否則使用 DATABASE_URL
if (!process.env.DATABASE_URL) {
  if (process.env.MONGODB_URI) {
    process.env.DATABASE_URL = process.env.MONGODB_URI;
    if (process.env.NODE_ENV === 'development') {
      console.log('✓ 已從 MONGODB_URI 映射到 DATABASE_URL');
    }
  } else {
    throw new Error(
      '請在環境變數中設定 DATABASE_URL 或 MONGODB_URI。\n' +
      '在 .env 或 .env.local 檔案中添加：\n' +
      'MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"\n' +
      '或\n' +
      'DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"'
    );
  }
}

// 驗證連接字串格式，確保包含資料庫名稱
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  
  // 檢查是否為 mongodb+srv:// 格式
  if (dbUrl.startsWith('mongodb+srv://')) {
    // 檢查是否有資料庫名稱（在 .mongodb.net/ 之後）
    const urlPattern = /mongodb\+srv:\/\/[^@]+@[^/]+\/([^?]+)/;
    const match = dbUrl.match(urlPattern);
    
    if (!match || !match[1] || match[1].trim() === '') {
      throw new Error(
        'MongoDB 連接字串缺少資料庫名稱！\n' +
        '連接字串格式應該是：\n' +
        'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority\n\n' +
        '請在 .mongodb.net/ 之後添加資料庫名稱，例如：\n' +
        'MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/pctbsc?retryWrites=true&w=majority"'
      );
    }
    
    if (process.env.NODE_ENV === 'development') {
      const maskedUrl = dbUrl.substring(0, 20) + '...' + dbUrl.substring(dbUrl.length - 20);
      console.log('✓ DATABASE_URL:', maskedUrl);
      console.log('✓ 資料庫名稱:', match[1]);
    }
  }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

