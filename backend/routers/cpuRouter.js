import express from 'express';

import { CPU } from '../models/cpu.js';

export const cpuRouter = express.Router();

// Get all CPUs
cpuRouter.get('/cpus', async (req, res) => {
    try {
        const cpus = await CPU.find({}).lean();

        if(cpus.length < 1 ){
            return res.status(404).json({message: 'No CPUs found'});
        }

        res.json(cpus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
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
})

