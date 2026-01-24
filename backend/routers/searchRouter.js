import express from 'express';
import { CPU } from '../models/cpu.js';
import { Server } from '../models/server.js';

const router = express.Router();

/* 
@NOTE 

scorepProjection variable - projection document used in mongo db queries 
    - When performing a $text search, MongoDB can calculate a relevance score for each document that indicates how well it matches the search query
    - When fetching DB we can use it as parameter on .find() function and use it to sort by textScore when sending data to frontend

*/

// get route for live search bar search 
router.get('/search', async (req, res) => {
    const { q } = req.query; // already assumes if route contains a query ?q= automatically 

    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const searchQuery = { $text: { $search: q } };
        const scoreProjection = { score: { $meta: 'textScore' } }; // score property for matching score of query term to document 

        // Search CPUs
        const cpuResults = await CPU.find(searchQuery, scoreProjection)
            .sort({ score: { $meta: 'textScore' } }) // sort documents by textScore using meta operator
            .limit(5);

        // Search Servers
        const serverResults = await Server.find(searchQuery, scoreProjection)
            .sort({ score: { $meta: 'textScore' } }) // sort documents by textScore using meta operator
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

// Route for Search Page Search 
router.get('/full-search', async (req, res) => {
    const { q } = req.query; // stores the query parameter
    
    // if no query parameter return status 400 error
    if(!q) {
        return res.status(400).json({ message: 'Search query is empty and it is required'});
    }

    // page query paramters to add pagination to search page
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);

    try{

        const searchQuery = { $text: { $search: q }}; // mongoose parameters based on text index searching for matches with query q
        const scoreProjection = { score: { $meta: 'textScore'}}; // score property for matching score of query term to document 

        const cpuResults = await CPU.find(searchQuery, scoreProjection)
        .sort({ score: { $meta: 'textScore'}}) // sort documents by textScore using meta operator
        .limit(limit)
        .skip((page - 1) * limit); 
        

        const serverResults = await Server.find(searchQuery, scoreProjection)
        .sort( {score: {$meta: 'textScore'}}) // sort documents by textScore using meta operator
        .limit(limit) // limit display to 10 documents per page for pagination
        .skip((page - 1) * limit);

        const results = {
            cpus: cpuResults, 
            servers: serverResults
        };

        const totalCPUs = await CPU.countDocuments(searchQuery);
        const totalServers = await Server.countDocuments(searchQuery);
        const totalPages = Math.ceil(Math.max(totalCPUs, totalServers) / limit);

        res.json({
            results, 
            totalPages, 
            currentPage: page
        })

    }catch(err){
        console.error('Search error: ', err);
        res.status(500).json({message: 'Error performing full search'});
    }
});

export { router as searchRouter };
