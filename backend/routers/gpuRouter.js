import express from "express";
import { GPU } from "../models/gpu.js";
import pagination from "../middleware/pagination.js";
import filterBuilder from "../middleware/filterBuilder.js";

export const gpuRouter = express.Router();

// Get all GPUs endpoint
gpuRouter.get(
  "/gpus",
  pagination(21),
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

// Brand-scoped filter options — scoped by gpuBrand (GPU chip maker)
gpuRouter.get("/gpus/:brand/filter-options", async (req, res) => {
  const gpuBrand = req.params.brand;
  const brandFilter = {
    gpuBrand: { $regex: new RegExp(`^${gpuBrand}$`, "i") },
  };

  try {
    const vramType = await GPU.distinct("vramType", brandFilter);
    const vram = await GPU.distinct("vram", brandFilter);
    const pcieInterface = await GPU.distinct("pcieInterface", brandFilter);
    const gpuWorkload = await GPU.distinct("gpuWorkload", brandFilter);
    const gpuBrands = await GPU.distinct("gpuBrand", brandFilter);

    res.json({
      vram,
      vramType,
      pcieInterface,
      gpuWorkload,
      gpuBrand: gpuBrands,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Brand-specific GPU listing — scoped by gpuBrand (GPU chip maker)
gpuRouter.get(
  "/gpus/:brand",
  pagination(21),
  filterBuilder({
    filterableFields: [
      "vramType",
      "pcieInterface",
      "gpuWorkload",
      "vram",
      "gpuBrand",
    ],
    numericFields: ["vram"],
    exactMatchFields: ["vram", "gpuBrand"],
  }),
  async (req, res) => {
    try {
      const brand = req.params.brand;
      const { page, limit, skip } = req.pagination;
      const filter = {
        gpuBrand: { $regex: new RegExp(`^${brand}$`, "i") },
        ...req.filter,
      };

      const totalGpus = await GPU.countDocuments(filter);
      const totalPages = Math.ceil(totalGpus / limit);

      if (totalGpus === 0) {
        return res.status(404).json({ message: `No GPUs found for ${brand}` });
      }

      const gpus = await GPU.find(filter).limit(limit).skip(skip).lean().exec();

      res.json({ gpus, totalGpus, totalPages, currentPage: page, brand });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

// GPU count per gpuBrand (for branded collections)
gpuRouter.get("/gpus/:brand/gpu-length", async (req, res) => {
  const gpuBrand = req.params.brand;

  try {
    const gpus = await GPU.find({
      gpuBrand: { $regex: new RegExp(`^${gpuBrand}$`, "i") },
    }).lean();

    if (!gpus) {
      return res.status(404).json({ message: `No GPUs found for ${gpuBrand}` });
    }

    res.json(gpus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Individual GPU detail page by brand and slug
gpuRouter.get("/gpus/:brand/:slug", async (req, res) => {
  const brand = req.params.brand;
  const slug = req.params.slug;

  try {
    const gpu = await GPU.findOne({ brand, slug }).lean();

    if (!gpu) {
      return res.status(404).json({ message: "GPU not found" });
    }

    res.json(gpu);
  } catch (err) {
    console.error("[ERROR]:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
