import mongoose from "mongoose";
import { Server } from "../models/server.js";
import { CPU } from "../models/cpu.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const defaultIMG = "https://ik.imagekit.io/blooverh/EHDB/div.bg-muted.png";

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

    console.log("\n[INFO] Migrating Server documents...");
    const serverResult = await Server.updateMany(
      {
        $or: [
          { featureImg: { $exists: false } },
          { featureImg: null },
          { featureImg: "" },
        ],
      },
      { $set: { featureImg: defaultIMG } },
    );
    console.log(
      `[SUCCESS] Updated ${serverResult.modifiedCount} Server documents`,
    );
    console.log(
      `[INFO] Matched ${serverResult.matchedCount} Server documents total`,
    );

    console.log("\n[INFO] Migrating CPU documents...");
    const cpuResult = await CPU.updateMany(
      {
        $or: [
          { featureImg: { $exists: false } },
          { featureImg: null },
          { featureImg: "" },
        ],
      },
      { $set: { featureImg: defaultIMG } },
    );
    console.log(`[SUCCESS] Updated ${cpuResult.modifiedCount} CPU documents`);
    console.log(`[INFO] Matched ${cpuResult.matchedCount} CPU documents total`);

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
