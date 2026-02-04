import express from 'express';
import { Server } from '../models/server.js';
import brandChecker from '../lib/brandChecker.js';

export const serverRouter = express.Router();

// get all servers api
serverRouter.get('/servers', async (req, res) => {

    // array of fields for filtering 
    const filterableFields = ['brand', 'socketInfo', 'compatibleCpuGen', 'motherboardType', 'memorySpecs.memory_type', 'memorySpecs.speeds', 'ssdInterfaces'];

    /* numericFields allow change logic when adding parameter to URL by checking if property is the same on array
    iteration */
    const numericField = 'memorySpecs.speeds';

    // destructure query parameters with default values for pagination
    const { page = 1, limit = 20} = req.query;

    try{
        const filter = {};

        filterableFields.forEach(field => {
            const queryParams = req.query[field]; // add field to query 

            // skip if parameter does not exist 
            if(!queryParams) return;

            if(numericField == field){

                /* (Note: If the URL was `?speeds=3200&speeds=4800`, some web frameworks would parse
                `queryParams` as `['3200', '4800']` directly. This line handles both cases.) */
                // ensure query parameters is always an array of strings regardless of how it is sent
                // 1. check if queryparams is already an array, if not create an array of strings from queryParams
                const values = Array.isArray(queryParams) ? queryParams : String(queryParams).split(',');
                // any values in array of queryParams that are numeric parse them into a number type and filter the ones that are numbers (!isNaN(num))
                const numericValues = values.map(val => parseInt(val, 10)).filter(num => !isNaN(num));

                if(numericValues.length > 1){
                    /* 
                    If query parameter for a numeric filter fielter field, we use
                    $in operator to query DB for all matching cases of values  in numeric values
                    { 'memorySpecs.speeds': { $in: [3200, 4800] } } // matches servers that have both speeds
                    Note: works when multiple numeric values for same filter field
                    */
                    filter[field] = { $in: numericValues }; 
                } else if (numericValues.length === 1){ // if only 1 numeric value for that filter field
                    filter[field] = numericValues[0];
                }
                // if no valid numbers do nothing
            }else {
                /* coerce comma-separated strings and arrays into a consistent array format */
                const values = Array.isArray(queryParams) ? queryParams : String(queryParams).split(',');

                if(values.length > 1){
                    // Multiple values we use $in operator for DB querying 
                    if(field === 'brand' || field === 'socketInfo' || 'compatibleCpuGen' || 'memorySpecs.memory_type' || 'memorySpecs.speeds' || 'ssdInterfaces' || 'motherboardType'){
                        
                        filter[field] = {$in : values};
                    }else {
                        // use case-insensitive regex for other multiple-value string fields
                        const regexArray = values.map(val => new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
                        filter[field] = { $in: regexArray}
                    }
                }else if (values.length === 1 && values[0]){
                    // single value: use $regex for case-insensitivity
                    const escapedValue = values[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    filter[field] = { $regex: `^${escapedValue}$`, $options: 'i' };
                }

                 // If values is empty array after split (e.g. from an empty query param), do nothing.
            }
        });

        // total number of servers (server documents) that match the filter
        const totalServers = await Server.countDocuments(filter);
        const totalPages = Math.ceil(totalServers / limit);

        // fetch servers for current page 
        const servers = await Server.find(filter)
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

        // Only return 404 if no documents match the filter at all 
        /* iF user requests a page that is out of bounds, they get a success response 
        with an empty servers array */
        if(totalServers  === 0){
            return res.status(404).json({message: 'No Servers Found'});
        }

        // send response 
        res.json({servers, totalPages, currentPage: parseInt(page), totalServers});

    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }

});

// All Server Collection Filter, give all values for server properties in server model we use for filtering
serverRouter.get('/servers/filter-options', async (req, res) => {
    // use .distinct() to find all distinct values for a specific field in model
    try{
        const brands = await Server.distinct("brand");
        const socket = await Server.distinct("socketInfo"); 
        const cpuGen = await Server.distinct("compatibleCpuGen");
        const moboType = await Server.distinct("motherboardType");
        const memoryType = await Server.distinct("memorySpecs.memory_type");
        const speeds = await Server.distinct("memorySpecs.speeds");
        const ssdInterfaces = await Server.distinct("ssdInterfaces");

        res.json({ brands, socket, cpuGen, moboType, memoryType, speeds, ssdInterfaces });


    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }
});

serverRouter.get('/servers/:brand/filter-options', async (req, res) => {
    const brandParam = req.params.brand;
    let brand = brandChecker(brandParam);

    try{

        const socket = await Server.distinct("socketInfo", {brand: brand});
        const cpuGen = await Server.distinct("compatibleCpuGen", {brand: brand});
        const moboType = await Server.distinct("motherboardType", {brand: brand});
        const memoryType = await Server.distinct("memorySpecs.memory_type", {brand: brand});
        const speeds = await Server.distinct("memorySpecs.speeds", {brand: brand});
        const ssdInterfaces = await Server.distinct("ssdInterfaces", {brand: brand});

        res.json({ socket, cpuGen, moboType, memoryType, speeds, ssdInterfaces});

    }catch(error){
        res.status(500).json({ message: 'Internal Server Error'});
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
/* 
    - Need pagination logic 
*/
serverRouter.get('/servers/:brand', async (req, res) => {
    const brandParam = req.params.brand;

    let brand = brandChecker(brandParam);

    const filterableFields = ['socketInfo', 'compatibleCpuGen', 'motherboardType', 'memorySpecs.memory_type', 'memorySpecs.speeds', 'ssdInterfaces'];
    
    const numericalField = 'memorySpecs.speeds';

    // 20 servers per page 
    const {page = 1, limit = 20 } = req.query;

    try{
        const filter = {}; 
        
        filterableFields.forEach(field => {
            const queryParams = req.query[field]; // add field to query 

            // skip if parameter does not exist 
            if(!queryParams) return;

            if(numericField == field){

                /* (Note: If the URL was `?speeds=3200&speeds=4800`, some web frameworks would parse
                `queryParams` as `['3200', '4800']` directly. This line handles both cases.) */
                // ensure query parameters is always an array of strings regardless of how it is sent
                // 1. check if queryparams is already an array, if not create an array of strings from queryParams
                const values = Array.isArray(queryParams) ? queryParams : String(queryParams).split(',');
                // any values in array of queryParams that are numeric parse them into a number type and filter the ones that are numbers (!isNaN(num))
                const numericValues = values.map(val => parseInt(val, 10)).filter(num => !isNaN(num));

                if(numericValues.length > 1){
                    /* 
                    If query parameter for a numeric filter fielter field, we use
                    $in operator to query DB for all matching cases of values  in numeric values
                    { 'memorySpecs.speeds': { $in: [3200, 4800] } } // matches servers that have both speeds
                    Note: works when multiple numeric values for same filter field
                    */
                    filter[field] = { $in: numericValues }; 
                } else if (numericValues.length === 1){ // if only 1 numeric value for that filter field
                    filter[field] = numericValues[0];
                }
                // if no valid numbers do nothing
            }else {
                /* coerce comma-separated strings and arrays into a consistent array format */
                const values = Array.isArray(queryParams) ? queryParams : String(queryParams).split(',');

                if(values.length > 1){
                    // Multiple values we use $in operator for DB querying 
                    if( field === 'socketInfo' || 'compatibleCpuGen' || 'memorySpecs.memory_type' || 'memorySpecs.speeds' || 'ssdInterfaces' || 'motherboardType'){
                        
                        filter[field] = {$in : values};
                    }else {
                        // use case-insensitive regex for other multiple-value string fields
                        const regexArray = values.map(val => new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
                        filter[field] = { $in: regexArray}
                    }
                }else if (values.length === 1 && values[0]){
                    // single value: use $regex for case-insensitivity
                    const escapedValue = values[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    filter[field] = { $regex: `^${escapedValue}$`, $options: 'i' };
                }

                 // If values is empty array after split (e.g. from an empty query param), do nothing.
            }
        });
        const query = {brand, ...filter};
        const totalServers = await Server.countDocuments(query);
        const totalPages = Math.ceil(totalServers/limit);

        const servers = await Server.find(query)
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

        if(totalServers === 0) {
            return res.status(404).json({ message: `No CPUs found for ${brand}`});
        }

        res.json({servers, totalServers, totalPages ,currentPage: parseInt(page)});

    }catch(error){
        
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