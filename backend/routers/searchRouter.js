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
 * Computes a relevance proxy score for a model-name regex match.
 * Exact matches rank highest, then prefix, then substring.
 */
function getModelMatchScore(modelValue, queryLower) {
  const modelLower = modelValue.toLowerCase();
  if (modelLower === queryLower) return 10; // exact match
  if (modelLower.startsWith(queryLower)) return 5; // prefix match
  return 1; // substring match
}

/**
 * Merges $text results (with textScore) and regex-on-model results
 * into a single, deduplicated, relevance-sorted array.
 *
 * Strategy:
 *   - $text matches keep their native textScore (relevance from full-text index)
 *   - Regex-only matches get a proxy score (exact > prefix > substring)
 *   - Documents matching BOTH use the $text score (higher fidelity)
 *   - Final list is sorted by combined score descending
 */
function mergeAndSortResults(textResults, regexResults, q) {
  const seen = new Map();
  const qLower = q.toLowerCase();

  // Add $text results first (they have real textScore)
  for (const doc of textResults) {
    seen.set(doc._id.toString(), {
      ...doc,
      score: doc.score != null ? doc.score : 0,
    });
  }

  // Add regex-only results with proxy scores
  for (const doc of regexResults) {
    const id = doc._id.toString();
    if (!seen.has(id)) {
      seen.set(id, {
        ...doc,
        score: getModelMatchScore(doc.model, qLower),
      });
    }
  }

  // Sort by score descending
  const merged = Array.from(seen.values());
  merged.sort((a, b) => b.score - a.score);
  return merged;
}

/**
 * Live search: Returns up to `limit` results per collection.
 *
 * Runs $text and regex-on-model queries in PARALLEL (not waterfall),
 * then merges with combined relevance scoring.
 *
 * Fixes:
 *   - Bug: $text returning >= limit results now doesn't block regex matches
 *   - Bug: Regex matches are no longer always demoted below text matches
 *   - Exact model name match (e.g. "Xeon Gold 5418Y") ranks above
 *     partial text matches (e.g. "Xeon Silver 4416+")
 */
async function searchWithFallback(Model, q, limit = 5) {
  const escapedQ = escapeRegex(q);
  const textQuery = { $text: { $search: q } };
  const scoreProjection = { score: { $meta: "textScore" } };

  // Run BOTH queries in parallel — each retrieves up to 'limit' docs
  const [textResults, regexResults] = await Promise.all([
    Model.find(textQuery, scoreProjection)
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean()
      .exec(),
    Model.find({ model: { $regex: escapedQ, $options: "i" } })
      .limit(limit)
      .lean()
      .exec(),
  ]);

  const merged = mergeAndSortResults(textResults, regexResults, q);
  return merged.slice(0, limit);
}

/**
 * Full-search (paginated): Returns paginated results with total count.
 *
 * IMPORTANT: Does NOT use $or with $text. MongoDB's query planner requires
 * ALL non-$text clauses in an $or to have a supporting B-tree index.
 * Server and GPU collections lack a standalone `model: 1` index, so
 * `$or: [ $text, regex ]` throws a planner error.
 *
 * Instead, we:
 *   1. Fetch ALL $text matches (sorted by textScore)
 *   2. Fetch ALL regex-on-model matches
 *   3. Merge with combined scoring (same as live search)
 *   4. Sort by score
 *   5. Paginate in-memory
 *
 * Capped at MAX_FETCH per query to bound memory usage.
 */
async function searchWithFallbackPaginated(Model, q, limit, skip) {
  const escapedQ = escapeRegex(q);
  const textQuery = { $text: { $search: q } };
  const scoreProjection = { score: { $meta: "textScore" } };
  const MAX_FETCH = 200; // safety cap

  const [textResults, regexResults] = await Promise.all([
    Model.find(textQuery, scoreProjection)
      .sort({ score: { $meta: "textScore" } })
      .limit(MAX_FETCH)
      .lean()
      .exec(),
    Model.find({ model: { $regex: escapedQ, $options: "i" } })
      .limit(MAX_FETCH)
      .lean()
      .exec(),
  ]);

  const merged = mergeAndSortResults(textResults, regexResults, q);
  const total = merged.length;
  const paginated = merged.slice(skip, skip + limit);

  return { results: paginated, total };
}

/*
@NOTE

scoreProjection variable - projection document used in mongo db queries
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
