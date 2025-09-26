import express from 'express';

import { CPU } from '../models/cpu.js';

export const cpuRouter = express.Router();

// Get all CPUs
/*
TODO: NEED TO FIX WHERE PARAMS CAN BE FROM AN ARRAY OF VALUES OF THE SAME PROPERTY 
SO WE CAN HAVE QUERY PARAMS SUCH AS `/api/cpus?brand=intel&brand=amd&page=2
*/
cpuRouter.get('/cpus', async (req, res) => {
    const filterableItems = ['brand', 'codename', 'generation', 'memorySupport', 'ratedSpeeds','socket', 'coreNum', 'threadNum', 'cache.cacheL3' ];
    
    const numericFields = ['coreNum', 'threadNum', 'ratedSpeeds'];

    // query parameters with default values
    const {page = 1, limit = 20} = req.query;

    try {

        const filter = {};

        filterableItems.forEach(field => {
            const queryParam = req.query[field];
            if (!queryParam) return; // Skip if the parameter doesn't exist

            if (numericFields.includes(field)) {
                // Coerce to array and parse numbers
                const values = Array.isArray(queryParam) ? queryParam : String(queryParam).split(',');
                const numericValues = values.map(val => parseInt(val, 10)).filter(num => !isNaN(num));

                if (numericValues.length > 1) {
                    filter[field] = { $in: numericValues }; // if query parameter for a numeric filter field, use $in operator to query DB for all the matching cases of values in 'numericValues'
                } else if (numericValues.length === 1) {
                    filter[field] = numericValues[0];
                }
                // If no valid numbers, do nothing.
            } else {
                // Coerce comma-separated strings and arrays into a consistent array format
                const values = Array.isArray(queryParam) ? queryParam : String(queryParam).split(',');

                if (values.length > 1) {
                    // Multiple values: use $in
                    if (field === 'brand' || field === 'generation') {
                        // Use simple string matching for 'brand' since it's guaranteed lowercase
                        filter[field] = { $in: values };
                    } else {
                        // Use case-insensitive regex for other multi-value string fields
                        const regexArray = values.map(val => new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
                        filter[field] = { $in: regexArray };
                    }
                } else if (values.length === 1 && values[0]) {
                    // Single value: use $regex for case-insensitivity
                    const escapedValue = values[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    filter[field] = { $regex: `^${escapedValue}$`, $options: 'i' };
                }
                // If values is empty array after split (e.g. from an empty query param), do nothing.
            }
        });

        const totalCPUs = await CPU.countDocuments(filter);
        const totalPages = Math.ceil(totalCPUs/limit); // divide total cpus for 20 cpus per page depending on filter

        /*
            Since some filters contain special characters when usign find based on filters 
            mongodb regex engine will handle the search based on the above regex value creation 
        */
        const cpus = await CPU.find(filter)
        .limit(parseInt(limit))
        .skip((page-1) * limit)
        .exec();

        if(cpus.length < 1 ){
            return res.status(404).json({message: 'No CPUs found'});
        }

        res.json({cpus, totalCPUs, totalPages, currentPage: parseInt(page)});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

cpuRouter.get('/cpus-length', async (req, res) => {

    try{
        const cpus = await CPU.find({});

        if(!cpus){
            return res.status(400).json({message: 'Could not fetch CPUs'});
        }

        res.json(cpus);
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }

})

// route that sends all cpu properties used for filtering
cpuRouter.get('/cpus/filter-options', async (req, res) => {
    try{
        const brands = await CPU.distinct("brand");
        const codename = await CPU.distinct("codename");
        const generation = await CPU.distinct("generation");
        const memorySupport = await CPU.distinct("memorySupport");
        const ratedSpeeds = await CPU.distinct("ratedSpeeds");
        const socket = await CPU.distinct("socket");
        const coreNum = await CPU.distinct("coreNum");
        const threadNum = await CPU.distinct("threadNum");
        const cache = await CPU.distinct("cache.cacheL3");

        res.json({brands, codename, generation, memorySupport, ratedSpeeds, socket, coreNum, threadNum, cache});
    }catch(err){
        res.status(500).json({message: 'Internal Server Error'});
    }


});

// collection of cpus by brand 
cpuRouter.get('/cpus/:brand', async (req, res) => {

    try{
        // Use toLowerCase() for case-insensitive matching
        const brand = req.params.brand.toLowerCase();

        // Simplified query that works for any brand
        const cpus = await CPU.find({brand: brand}).lean();

        // If no CPUs are found, you could return a 404
        if (cpus.length < 1) {
            return res.status(404).json({ message: `No CPUs found for brand: ${req.params.brand}` });
        }

        res.json(cpus);

    }catch(err){
        console.error(err);
        // Send an error response to the client
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//individual cpu router 
cpuRouter.get('/cpus/:brand/:slug', async (req, res) => {
    const brand = req.params.brand.toLowerCase();
    const slug = req.params.slug;

    try{

        const cpu = await CPU.findOne({brand: brand, slug: slug}).lean();

        if(!cpu){
            return res.status(404).json({message: `CPU not found`});
        }

        res.json(cpu);

    }catch(err){
        console.error('[ERROR]: ' + err);
        res.status(500).json({ message: 'Internal Server Error'});
    }
});



