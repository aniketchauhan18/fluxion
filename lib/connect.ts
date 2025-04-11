/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Mongoose } from "mongoose";
import { MongoClient } from "mongodb";

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const MONGODB_URI = process.env.MONGODB_URI! || process.env.MONGODB_URI2!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside environment variables",
  );
}

let cachedClient: MongoClient | null = null;

export const connect = async () => {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI);

  await client.connect();
  cachedClient = client;
  return cachedClient;
};

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: process.env.DB_NAME,
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};
