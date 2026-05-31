import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

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

    const db = mongoose.connection.db;
    const collection = db.collection("gpus");

    // Step 1: Find and drop the existing text index
    console.log("\n[INFO] Checking existing indexes on 'gpus' collection...");
    const indexes = await collection.indexes();
    let textIndexName = null;

    for (const index of indexes) {
      const keyFields = Object.keys(index.key);
      const isTextIndex = keyFields.some(
        (field) => index.key[field] === "text",
      );

      if (isTextIndex) {
        textIndexName = index.name;
        console.log(`[INFO] Found existing text index: "${textIndexName}"`);
        console.log(
          `[INFO] Current text index fields: ${keyFields.join(", ")}`,
        );
        break;
      }
    }

    if (textIndexName) {
      console.log(`\n[INFO] Dropping old text index "${textIndexName}"...`);
      await collection.dropIndex(textIndexName);
      console.log("[SUCCESS] Old text index dropped");
    } else {
      console.log("[INFO] No existing text index found on 'gpus' collection");
    }

    // Step 2: Create the new text index with 'model' included
    console.log(
      "\n[INFO] Creating new text index with 'model' field included...",
    );
    await collection.createIndex(
      {
        brand: "text",
        model: "text",
        gpuBrand: "text",
        vramType: "text",
        gpuWorkload: "text",
        pcieInterface: "text",
        slotWidth: "text",
        gpuTags: "text",
      },
      {
        name: "gpu_text_index",
      },
    );
    console.log(
      "[SUCCESS] New text index created with fields: brand, model, gpuBrand, vramType, gpuWorkload, pcieInterface, slotWidth, gpuTags",
    );

    console.log("\n[COMPLETE] Migration finished successfully!");
  } catch (error) {
    console.error("[ERROR] Migration failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("[INFO] Database connection closed");
    process.exit(0);
  }
}

migrate();
