import express from 'express';
import mongoose from 'mongoose';


import { CPU } from '../models/cpu.js';

export const cpuRouter = express.Router();

cpuRouter.get('/cpus/amd', async (req, res) => {
    try{
        const cpus = await CPU.find({brand: 'amd'}).lean();

        res.json(cpus);
    }catch(err){
        console.err(err);
    }
});
