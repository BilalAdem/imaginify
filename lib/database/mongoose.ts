import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose || {};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!MONGODB_URL) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );
  }
  if (!cached.promise) {
    const options = {
      dbName: "imaginify",
      bufferCommands: false,
    };

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, options);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};
