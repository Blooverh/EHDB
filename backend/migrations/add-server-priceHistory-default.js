import { Server } from "../models/server.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function migrate() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error("[ERROR] MONGO_URI not found in environment variables");
      process.exit(1);
    }

    console.log("[INFO] Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("[INFO] Connected to MongoDB");

    console.log("\n[INFO] Migrating CPU documents - adding priceHistory...");

    const result = await Server.updateMany(
      { "chassisInfo.priceHistory": { $exists: false } },
      { $set: { "chassisInfo.$[].priceHistory": [] } },
    );

    console.log(`[SUCCESS] Updated ${result.modifiedCount} CPU documents`);
    console.log(`[INFO] Matched ${result.matchedCount} CPU documents total`);

    console.log("\n[COMPLETE] Migration finished successfully!");
  } catch (error) {
    console.error("[ERROR] Migration failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("[INFO] Database connection closed");
    process.exit(0);
  }
}

migrate();