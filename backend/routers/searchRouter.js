import express from "express";
import { CPU } from "../models/cpu.js";
import { Server } from "../models/server.js";
import { GPU } from "../models/gpu.js";

const router = express.Router();

/**
 * Escapes special regex characters in a string for safe use in $regex.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Performs a search using $text search with a regex-on-model fallback.
 *
 * MongoDB's $text search relies on text indexes and can miss results when:
 * 1. The `model` field is not yet added to the text index (migration pending)
 * 2. Alphanumeric model names (like "H200", "RTX 4090", "A100") have edge cases
 *    with the default English stemmer/tokenizer
 *
 * This function does:
 *   - Primary: $text search (relevance-ranked)
 *   - Fallback: regex match on `model` field (for specific model lookups)
 *   - Merges results, deduplicating by _id
 */
async function searchWithFallback(Model, q, limit = 5, skip = 0) {
  const textQuery = { $text: { $search: q } };
  const scoreProjection = { score: { $meta: "textScore" } };
  const escapedQ = escapeRegex(q);

  // Primary: $text search
  const textResults = await Model.find(textQuery, scoreProjection)
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();

  // If we have enough results, return them
  if (textResults.length >= limit) {
    return textResults;
  }

  // Fallback: regex search on `model` for remaining slots
  const existingIds = textResults.map((doc) => doc._id);
  const remaining = limit - textResults.length;

  const regexResults = await Model.find({
    _id: { $nin: existingIds },
    model: { $regex: escapedQ, $options: "i" },
  })
    .limit(remaining)
    .lean()
    .exec();

  return [...textResults, ...regexResults];
}

/**
 * Same as searchWithFallback but for paginated results (returns both
 * the results array and total count across both text + regex matches).
 */
async function searchWithFallbackPaginated(Model, q, limit, skip) {
  const escapedQ = escapeRegex(q);

  // Combined query: $text OR regex-on-model
  const combinedQuery = {
    $or: [
      { $text: { $search: q } },
      { model: { $regex: escapedQ, $options: "i" } },
    ],
  };

  // Use $text score projection — works inside $or in MongoDB 3.2+
  const scoreProjection = { score: { $meta: "textScore" } };

  const results = await Model.find(combinedQuery, scoreProjection)
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();

  const total = await Model.countDocuments(combinedQuery);

  return { results, total };
}

/* 
@NOTE 

scorepProjection variable - projection document used in mongo db queries 
    - When performing a $text search, MongoDB can calculate a relevance score for each document that indicates how well it matches the search query
    - When fetching DB we can use it as parameter on .find() function and use it to sort by textScore when sending data to frontend

*/

// get route for live search bar search
router.get("/search", async (req, res) => {
  const { q } = req.query; // already assumes if route contains a query ?q= automatically

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const LIMIT = 5;

    // Search all three collections with text + regex fallback
    const cpuResults = await searchWithFallback(CPU, q, LIMIT);
    const serverResults = await searchWithFallback(Server, q, LIMIT);
    const gpuResults = await searchWithFallback(GPU, q, LIMIT);

    const results = {
      cpus: cpuResults,
      servers: serverResults,
      gpus: gpuResults,
    };

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});

// Route for Search Page Search
router.get("/full-search", async (req, res) => {
  const { q } = req.query; // stores the query parameter

  // if no query parameter return status 400 error
  if (!q) {
    return res
      .status(400)
      .json({ message: "Search query is empty and it is required" });
  }

  // page query paramters to add pagination to search page
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const skip = (page - 1) * limit;

  try {
    // Search all three collections with combined text + regex matching
    const cpuResults = await searchWithFallbackPaginated(CPU, q, limit, skip);
    const serverResults = await searchWithFallbackPaginated(
      Server,
      q,
      limit,
      skip,
    );
    const gpuResults = await searchWithFallbackPaginated(GPU, q, limit, skip);

    const results = {
      cpus: cpuResults.results,
      servers: serverResults.results,
      gpus: gpuResults.results,
    };

    const totalPages = Math.ceil(
      Math.max(cpuResults.total, serverResults.total, gpuResults.total) / limit,
    );

    res.json({
      results,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error("Search error: ", err);
    res.status(500).json({ message: "Error performing full search" });
  }
});

export { router as searchRouter };
