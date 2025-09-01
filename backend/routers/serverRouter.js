import express from 'express';
import { Server } from '../models/server.js';
import brandChecker from '../lib/brandChecker.js';

export const serverRouter = express.Router();

// get all servers api
serverRouter.get('/servers', async (req, res) => {
    try{
        const servers= await Server.find({}).lean();

        if(servers.length < 1){
            return res.status(404).json({message: 'No Servers Fetched from Database'});
        }

        res.json(servers);
    }catch(error){
        console.error(error);
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