import express from 'express';

import { CPU } from '../models/cpu.js';

export const cpuRouter = express.Router();

// Get all CPUs
/*
TODO: NEED TO FIX WHERE PARAMS CAN BE FROM AN ARRAY OF VALUES OF THE SAME PROPERTY 
SO WE CAN HAVE QUERY PARAMS SUCH AS `/api/cpus?brand=intel&brand=amd&page=2
*/
cpuRouter.get('/cpus', async (req, res) => {
    const filterableItems = ['brand', 'codename', 'generation', 'memorySupport', 'ratedSpeeds','socket', 'coreNum', 'cache.cacheL3' ];
    
    const numericFields = ['coreNum', 'ratedSpeeds'];

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
                    if (field === 'brand' || field === 'generation' || field === 'codename' || field === 'cache.cacheL3') {
                        
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

        if(totalCPUs === 0 ){
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

    // add cpu schema properties that will be used as filter options to an array
    const filterableItems = ['codename', 'generation', 'memorySupport', 'ratedSpeeds', 'socket', 'coreNum', 'threadNum', 'cache.cacheL3'];

    const numericOptions = ['coreNum', 'ratedSpeeds'];

    const {page = 1, limit = 20} = req.query; // default query params

    const brand = req.params.brand;

    try{

        const filter = {};

        filterableItems.forEach(field => {
            const queryParam = req.query[field]; // assign each filterableItem on iteration to queryParam variable if it exists in the req.query

            // if no query parameter skip
            if(!queryParam) return;

            /* we check if field is part of numeric options array
            // if so we create an array that adds all the values from a numeric query 
            // or if there is only one numeric option query we leave it as a string
            // then we proceed to query the database based on the single numeric value 
            // or based on the array of numeric values for the numeric options 

            // if it is not a numeric option we proceed to query the database 
            based on multiple or single values in the query that are string based 
            and if the field does not we use regular expressions to query database 
            */
            if(numericOptions.includes(field)){
                // check if query parameter is an array or a single value 
                // Normalize the query parameter into an array — if it’s already an array, keep it as-is; otherwise, split the string by commas.
                const values = Array.isArray(queryParam) ? queryParam : String(queryParam).split(',');
                // we map to an new array all numeric values from queryParam and parse to a Integer 
                // each value, if value is not a number we skip it by using the filter operation.
                const numericValues = values.map(val => parseInt(val, 10)).filter(num => !isNaN(num));

                // if query parameter for a numeric filter field, use $in operator to query DB for all the matching cases of values in 'numericValues' (e.g., ?cores=4,6,8)
                if(numericValues.length > 1) {
                    filter[field] = { $in: numericValues };
                } else if( numericValues.length === 1){ // if array only has 1 element // Single numeric option (e.g., ?cores=8)
                    filter[field] = numericValues[0];
                }
                // if no valid numbers do nothing 
            }else { // if not a numeric field
                // if values in current field are in array format create string and separate each value by comma, if only one value leave it as is
                const values = Array.isArray(queryParam) ? queryParam : String(queryParam).split(',');

                // if values is an array of values tied to a filter field
                // check which field and query database based on the field 
                // which is a property of the cpu schema
                if(values.length > 1){
                    if(field === 'generation' || field === 'codename' || field === 'cache.cacheL3'){
                        filter[field] = { $in: values };
                    }else { 
                        // this is for other fields such as memorySupport and socket
                        // Use case-insensitive regex for other multi-value string fields
                        const regexArray = values.map(val => new RegExp(`^${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'));
                        filter[field] = { $in: regexArray };
                    }
                }else if (values.length === 1 && values[0]){ // if array contains one value and that value exists 
                    // we query database with that value based on the property of the cpu schema
                    // we replace all characters that might be seen as regex operators from omngo database so we can then query the DB correctly
                    const escapedValue = values[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    filter[field] = {$regex: `${escapedValue}$`, $options: 'i'};

                }
            }
        });

        const totalCpus = await CPU.countDocuments(filter);
        const totalPages = matchMedia.ceil(totalCpus/limit); // since each page should only contain 20 cpus we divide total num of CPUs by the limit (20) to get number of total pages

        // when fetching the cpus based on filter, we limit based on limit value
        // we skip certain amount of documents based on limit when jumping to a certain page
        const cpus = (await CPU.find(filter))
        .limit(parseInt(limit))
        .skip((page - 1) * limit)
        .exec();

        if(totalCpus === 0) {
            return res.status(404).json({message: `No CPUs found for ${brand}`});
        }

        res.json({cpus, totalCpus, totalPages, currentPage: parseInt(page)});

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error'});
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



