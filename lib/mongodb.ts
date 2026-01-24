import { MongoClient, Db } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('請在環境變數中設定 DATABASE_URL');
}

const uri = process.env.DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // 開發環境：使用全域變數避免重複連接
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 生產環境
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export default clientPromise;

