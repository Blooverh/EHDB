import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoString = process.env.MONGO_URI;

// import collection data scraper
import { cnCollectionCPU } from './scrapers/cpuCollectionScraper/cnCpuScraper.js';

async function main() {
    
    //Connecting to Mongo Database
    try{
        if(!mongoString){
            console.error('No MongoDB string to connect to DB');
            process.exit(1);
        }else{
            await mongoose.connect(mongoString);
            console.log('Connected to MongoDB');
        }

        // testing if info is pulled 
        await cnCollectionCPU();

    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

main();