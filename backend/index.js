import express from 'express';
import mongoose from 'mongoose';
// import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Routers for each hardware part
import { cpuRouter } from './routers/cpuRouter.js';
import { serverRouter } from './routers/serverRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.resolve(__dirname, '../.env')});

const PORT = process.env.PORT || 3000;

const app = express();

// Serve static files from the Vue frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// built-in middleware to parse incoming request with urlencoded payloads (used for form handling)
app.use(express.urlencoded({extended: true}));

// will allow front end to make requests as JSON from the backend 
app.use(express.json());

// app.use(cors()); // will not be needed as im serving vue straight to backend, and not 2 separate domains

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI){
    console.log('[ERROR] MONGO DB CREDENTIAL NOT FOUND');
}

mongoose.connect(MONGO_URI).then(() => {
    console.log('[DATABASE CONNECTED]');
}).catch(err => {
    console.error('[CONNECTION ERROR]: ' + err);
    process.exit(1);
});

app.use('/api', cpuRouter);
app.use('/api', serverRouter);


// All remaining requests return the Vue app, so it can handle routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RUNNING] On Port: ${PORT} `);
});

