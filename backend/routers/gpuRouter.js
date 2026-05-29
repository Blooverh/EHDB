import express from "express";
import { GPU } from "../models/gpu.js";
import pagination from "../middleware/pagination.js";
import filterBuilder from "../middleware/filterBuilder.js";

export const gpuRouter = express.Router();

// Get all GPUs endpoint
gpuRouter.get(
  "/gpus",
  pagination(20),
  filterBuilder({
    filterableFields: [
      "brand",
      "vramType",
      "pcieInterface",
      "gpuWorkload",
      "vram",
    ],
    numericFields: ["vram"],
    exactMatchFields: ["brand", "vram"],
  }),
  async (req, res) => {
    try {
      const { page, limit, skip } = req.pagination;
      const filter = req.filter;

      // Get total number of GPUs based on filter (empty filter variable will get all GPUs)
      const totalGpus = await GPU.countDocuments(filter);
      const totalPages = Math.ceil(totalGpus / limit);

      if (totalGpus === 0) {
        return res.status(404).json({ message: "No GPUs Found" });
      }

      const gpus = await GPU.find(filter).limit(limit).skip(skip).lean().exec();

      res.json({ gpus, totalGpus, totalPages, currentPage: page });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

gpuRouter.get("/gpus-length", async (req, res) => {
  try {
    const gpus = await GPU.countDocuments();

    if (!gpus || gpus < 0) {
      return res.status(400).json({ message: "Could Not fetch GPUs" });
    }

    res.json(gpus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// route for filters for general GPU collection
gpuRouter.get("/gpus/filter-options", async (req, res) => {
  try {
    const brands = await GPU.distinct("brand");
    const vramType = await GPU.distinct("vramType");
    const vram = await GPU.distinct("vram");
    const pcieInterface = await GPU.distinct("pcieInterface");
    const gpuWorkload = await GPU.distinct("gpuWorkload");

    res.json({ brands, vram, vramType, pcieInterface, gpuWorkload });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
