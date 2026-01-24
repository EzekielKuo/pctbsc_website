import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// 使用 $extends 來處理登出時的競態條件錯誤（更新已刪除的 session）
export const prisma = (globalForPrisma.prisma ||
  basePrisma.$extends({
    query: {
      session: {
        async update({ args, query }) {
          try {
            return await query(args);
          } catch (error: any) {
            // 如果是更新 session 時找不到記錄的錯誤（登出時的競態條件），返回 null
            // 這不會影響功能，因為 session 已經被刪除了
            if (error.code === 'P2025') {
              return null;
            }
            throw error;
          }
        },
      },
    },
  })) as PrismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

