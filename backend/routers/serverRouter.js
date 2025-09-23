import express from 'express';
import { Server } from '../models/server.js';
import brandChecker from '../lib/brandChecker.js';

export const serverRouter = express.Router();

// get all servers api
serverRouter.get('/servers', async (req, res) => {

    // array of fields for filtering 
    const filterableFields = ['brand', 'model', 'socketInfo', 'compatibleCpuGen', 'memorySpecs.memory_type', 'memorySpecs.speeds', 'ssdInterfaces'];

    // destructure query parameters with default values for pagination
    const { page = 1, limit = 20} = req.query;

    try{
        const filter = {};

        filterableFields.forEach(field => {
            if(req.query[field]){
                // case insensitive regext for flexible searching
                filter[field] = {$regex: req.query[field], $options: 'i'};
            }
        });

        // total number of servers (server documents) that match the filter
        const totalDocs = await Server.countDocuments(filter);

        const totalPages = Math.ceil(totalDocs / limit);

        // fetch servers for current page 
        const servers = await Server.find(filter)
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

        // send response 
        res.json({servers, totalPages, currentPage: parseInt(page), totalDocs});

    }catch(error){
        res.status(500).json({message: error.message});
    }

});

serverRouter.get('/servers-length', async (req, res) => {

    try{
        const servers = await Server.find({});

        if(!servers){
            return res.status(404).json({message: 'Servers not found'});
        }

        res.json(servers);
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }

});

// router for brand collection
serverRouter.get('/servers/:brand', async (req, res) => {
    const brandParam = req.params.brand;

    let brand = brandChecker(brandParam);

    try{

        const servers = await Server.find({brand: brand}).lean();

        if(servers.length < 1) {
            return res.status(404).json({message: `No ${brand} Servers were fetched from database`});
        }

        res.json(servers);

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// router for individual server page 
serverRouter.get('/servers/:brand/:slug', async (req, res) => {
    const brandParam = req.params.brand;
    const slug = req.params.slug;

    let brand = brandChecker(brandParam);

    try {

        const server = await Server.findOne({brand: brand, slug: slug}).lean();

        if(!server){
            return res.status(404).json({message: `Could Not Fetch Server`});
        }

        res.json(server);

    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});