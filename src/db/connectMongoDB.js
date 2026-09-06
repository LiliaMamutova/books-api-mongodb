import mongoose from 'mongoose';
import {Book} from "./models/books.js";

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connection established successfully");

    // гарантуємо, що індекси в БД відповідають схемі
    await Book.syncIndexes();
    console.log("✅ Index synced successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
