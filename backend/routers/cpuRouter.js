import express from "express";
import { CPU } from "../models/cpu.js";
import pagination from "../middleware/pagination.js";
import filterBuilder from "../middleware/filterBuilder.js";

export const cpuRouter = express.Router();

cpuRouter.get(
  "/cpus",
  pagination(20),
  filterBuilder({
    filterableFields: [
      "brand",
      "codename",
      "generation",
      "memorySupport",
      "ratedSpeeds",
      "socket",
      "coreNum",
      "cache.cacheL3",
    ],
    numericFields: ["coreNum", "ratedSpeeds"],
    exactMatchFields: ["brand", "generation", "codename", "cache.cacheL3"],
  }),
  async (req, res) => {
    try {
      const { page, limit, skip } = req.pagination;
      const filter = req.filter;

      const totalCPUs = await CPU.countDocuments(filter);
      const totalPages = Math.ceil(totalCPUs / limit);

      if (totalCPUs === 0) {
        return res.status(404).json({ message: "No CPUs found" });
      }

      const cpus = await CPU.find(filter).limit(limit).skip(skip).lean().exec();

      res.json({ cpus, totalCPUs, totalPages, currentPage: page });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

cpuRouter.get("/cpus-length", async (req, res) => {
  try {
    const cpus = await CPU.countDocuments();

    if (!cpus) {
      return res.status(400).json({ message: "Could not fetch CPUs" });
    }

    res.json(cpus);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cpuRouter.get("/cpus/filter-options", async (req, res) => {
  try {
    const brands = await CPU.distinct("brand");
    const codename = await CPU.distinct("codename");
    const generation = await CPU.distinct("generation");
    const memorySupport = await CPU.distinct("memorySupport");
    const ratedSpeeds = await CPU.distinct("ratedSpeeds");
    const socket = await CPU.distinct("socket");
    const coreNum = await CPU.distinct("coreNum");
    const cache = await CPU.distinct("cache.cacheL3");

    res.json({
      brands,
      codename,
      generation,
      memorySupport,
      ratedSpeeds,
      socket,
      coreNum,
      cache,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cpuRouter.get("/cpus/:brand/filter-options", async (req, res) => {
  const brand = req.params.brand;

  try {
    const codename = await CPU.distinct("codename", { brand: brand });
    const generation = await CPU.distinct("generation", { brand: brand });
    const memorySupport = await CPU.distinct("memorySupport", { brand: brand });
    const ratedSpeeds = await CPU.distinct("ratedSpeeds", { brand: brand });
    const socket = await CPU.distinct("socket", { brand: brand });
    const coreNum = await CPU.distinct("coreNum", { brand: brand });
    const cache = await CPU.distinct("cache.cacheL3", { brand: brand });

    return res.json({
      codename,
      generation,
      memorySupport,
      ratedSpeeds,
      socket,
      coreNum,
      cache,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cpuRouter.get(
  "/cpus/:brand",
  pagination(20),
  filterBuilder({
    filterableFields: [
      "codename",
      "generation",
      "memorySupport",
      "ratedSpeeds",
      "socket",
      "coreNum",
      "cache.cacheL3",
    ],
    numericFields: ["coreNum", "ratedSpeeds"],
    exactMatchFields: ["generation", "codename", "cache.cacheL3"],
  }),
  async (req, res) => {
    const brand = req.params.brand;

    try {
      const { page, limit, skip } = req.pagination;
      const filter = { brand, ...req.filter };

      const totalCpus = await CPU.countDocuments(filter);
      const totalPages = Math.ceil(totalCpus / limit);

      if (totalCpus === 0) {
        return res.status(404).json({ message: `No CPUs found for ${brand}` });
      }

      const cpus = await CPU.find(filter).limit(limit).skip(skip).lean().exec();

      res.json({ cpus, totalCpus, totalPages, currentPage: page });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

cpuRouter.get("/cpus/:brand/cpu-length", async (req, res) => {
  const cpuBrand = req.params.brand;

  try {
    const cpus = await CPU.find({ brand: cpuBrand }).lean();

    if (!cpus) {
      return res.status(404).json({ message: `No CPUs found for ${cpuBrand}` });
    }

    res.json(cpus);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cpuRouter.get("/cpus/:brand/:slug", async (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const slug = req.params.slug;

  try {
    const cpu = await CPU.findOne({ brand: brand, slug: slug }).lean();

    if (!cpu) {
      return res.status(404).json({ message: `CPU not found` });
    }

    res.json(cpu);
  } catch (err) {
    console.error("[ERROR]: " + err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
