import express from 'express';
import { CPU } from '../models/cpu.js';
import { Server } from '../models/server.js';

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q } = req.query; // already assumes if route contains a query ?q= automatically 

    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const searchQuery = { $text: { $search: q } };
        const scoreProjection = { score: { $meta: 'textScore' } };

        // Search CPUs
        const cpuResults = await CPU.find(searchQuery, scoreProjection)
            .sort({ score: { $meta: 'textScore' } })
            .limit(5);

        // Search Servers
        const serverResults = await Server.find(searchQuery, scoreProjection)
            .sort({ score: { $meta: 'textScore' } })
            .limit(5);

        const results = {
            cpus: cpuResults,
            servers: serverResults
        };

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error performing search' });
    }
});

export { router as searchRouter };
