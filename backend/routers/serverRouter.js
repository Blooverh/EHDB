import express from "express";
import { Server } from "../models/server.js";
import pagination from "../middleware/pagination.js";
import filterBuilder from "../middleware/filterBuilder.js";
import normalizeBrand from "../middleware/normalizeBrand.js";

export const serverRouter = express.Router();

serverRouter.get(
  "/servers",
  pagination(21),
  filterBuilder({
    filterableFields: [
      "brand",
      "socketInfo",
      "compatibleCpuGen",
      "motherboardType",
      "memorySpecs.memory_type",
      "memorySpecs.speeds",
      "ssdInterfaces",
    ],
    numericFields: ["memorySpecs.speeds"],
    exactMatchFields: [
      "brand",
      "socketInfo",
      "compatibleCpuGen",
      "motherboardType",
      "memorySpecs.memory_type",
      "ssdInterfaces",
    ],
  }),
  async (req, res) => {
    try {
      const { page, limit, skip } = req.pagination;
      const filter = req.filter;

      const totalServers = await Server.countDocuments(filter);
      const totalPages = Math.ceil(totalServers / limit);

      if (totalServers === 0) {
        return res.status(404).json({ message: "No Servers Found" });
      }

      const servers = await Server.find(filter)
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();

      res.json({ servers, totalPages, currentPage: page, totalServers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

serverRouter.get("/servers/filter-options", async (req, res) => {
  try {
    const brands = await Server.distinct("brand");
    const socket = await Server.distinct("socketInfo");
    const cpuGen = await Server.distinct("compatibleCpuGen");
    const moboType = await Server.distinct("motherboardType");
    const memoryType = await Server.distinct("memorySpecs.memory_type");
    const speeds = await Server.distinct("memorySpecs.speeds");
    const ssdInterfaces = await Server.distinct("ssdInterfaces");

    res.json({
      brands,
      socket,
      cpuGen,
      moboType,
      memoryType,
      speeds,
      ssdInterfaces,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

serverRouter.get(
  "/servers/:brand/filter-options",
  normalizeBrand,
  async (req, res) => {
    const brand = req.normalizedBrand;

    try {
      const socket = await Server.distinct("socketInfo", { brand: brand });
      const cpuGen = await Server.distinct("compatibleCpuGen", {
        brand: brand,
      });
      const moboType = await Server.distinct("motherboardType", {
        brand: brand,
      });
      const memoryType = await Server.distinct("memorySpecs.memory_type", {
        brand: brand,
      });
      const speeds = await Server.distinct("memorySpecs.speeds", {
        brand: brand,
      });
      const ssdInterfaces = await Server.distinct("ssdInterfaces", {
        brand: brand,
      });

      res.json({ socket, cpuGen, moboType, memoryType, speeds, ssdInterfaces });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

serverRouter.get("/servers-length", async (req, res) => {
  try {
    const servers = await Server.countDocuments();

    if (!servers) {
      return res.status(404).json({ message: "Servers not found" });
    }

    res.json(servers);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

serverRouter.get(
  "/servers/:brand",
  normalizeBrand,
  pagination(20),
  filterBuilder({
    filterableFields: [
      "socketInfo",
      "compatibleCpuGen",
      "motherboardType",
      "memorySpecs.memory_type",
      "memorySpecs.speeds",
      "ssdInterfaces",
    ],
    numericFields: ["memorySpecs.speeds"],
    exactMatchFields: [
      "socketInfo",
      "compatibleCpuGen",
      "motherboardType",
      "memorySpecs.memory_type",
      "ssdInterfaces",
    ],
  }),
  async (req, res) => {
    const brand = req.normalizedBrand;

    try {
      const { page, limit, skip } = req.pagination;
      const filter = { brand, ...req.filter };

      const totalServers = await Server.countDocuments(filter);
      const totalPages = Math.ceil(totalServers / limit);

      if (totalServers === 0) {
        return res.status(404).json({ message: `No CPUs found for ${brand}` });
      }

      const servers = await Server.find(filter)
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();

      res.json({ servers, totalServers, totalPages, currentPage: page, brand });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

serverRouter.get("/servers/:brand/:slug", normalizeBrand, async (req, res) => {
  const brand = req.normalizedBrand;
  const slug = req.params.slug;

  try {
    const server = await Server.findOne({
      brand: brand,
      slug: slug,
    }).lean();

    if (!server) {
      return res.status(404).json({ message: `Could Not Fetch Server` });
    }

    res.json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
