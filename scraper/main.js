import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Command } from 'commander';


// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoString = process.env.MONGO_URI;

// import collection data scraper
import { cnCollectionCPU } from './scrapers/cpuCollectionScraper/cnCpuScraper.js';
import { xByteCollectionCpu } from './scrapers/cpuCollectionScraper/xByteCpuScraper.js';
import { serverMonkeyCollectionCpu } from './scrapers/cpuCollectionScraper/sMonkeyScraper.js';
import { techpowerupCPU } from './scrapers/cpuCollectionScraper/techPowUpScraper.js';

// import individual cpu data scraper 
import techpowerupCPU_data from './lib/DB_utilities/cpuDataHandlers/cpu_techpowerupDataHandler.js'

// Helper function to connect to DB 
async function connectToDB() {
    // if string not imported from .env file, connection to DB rejected
    if(!mongoString){
        console.error('MONGO URI not found in .env file. Please provide a connection string');
        process.exit(1);
    }

    try{
        await  mongoose.connect(mongoString);
        console.log('[CONNECTED] to Database');
    }catch(e){
        console.error('Error connecting to the Database: ' + e);
        process.exit(1);
    }
}

async function main() {

    try{

        const scraper = new Command();

        scraper.name('scraper')
        .description('CLI tool to scrape certain hardware parts by website, by individual pages or in bulk. And add data to the database.')
        .version('[VERSION] 0.1.0')
        // hook to connect to DB as a pre-action before scraping the data we want to scrape
        .hook('preAction', async (thisCommand, actionCommand) => {
            await connectToDB();
        });

        // main cpu programer command 
        const cpuScraper = scraper.command('cpu')
        .description('Commands for scraping cpu data');

        // command for scraping cloud Ninjas
        cpuScraper.command('cninjas').
        description('Scraping all CPUs from Cloud Ninjas CPU collection page')
        .action(async () => {
            console.log('[SCRAPING CPUs] from Cloud Ninjas...');
            await cnCollectionCPU();
            console.log('[SCRAPING COMPLETE]');
        });

        // command for scraping xByte 
        cpuScraper.command('xbyte')
        .description('Scraping all CPUs from xByte CPU collection page')
        .action(async () => {
            console.log('[SCRAPING CPUs] from xByte...');
            await xByteCollectionCpu();
            console.log('[SCRAPING COMPLETE]');
        });

        //command for scraing Server Monkey
        cpuScraper.command('smonkey')
        .description('Scraping all CPUs from xByte CPU collection page')
        .action(async () => {
            console.log('[SCRAPING CPUs] from Server Monkey...');
            await serverMonkeyCollectionCpu();
            console.log('[SCRAPING COMPLETE]');
        });

        // command to scrape all CPU websites on one command
        cpuScraper.command('all')
        .description('Scraping all CPUs from all Websites and their collection pages')
        .action(async () => {
            console.log('[SCRAPING] All Website`s and their CPU collections');
            console.log('[SCRAPING CLOUD NINJAS]');
            await cnCollectionCPU();
            console.log('[SCRAPING XBYTE]');
            await xByteCollectionCpu();
            console.log('[SCRAPING SERVER MONKEY]');
            await serverMonkeyCollectionCpu();
            console.log('[SCRAPING COMPLETE]');
        });

        // techpowerup scraper (ONLY SCRAPES COLLECTIONS AND ADDS TITLE AND LINK TO JSON FILE)
        cpuScraper.command('techpowerup')
        .description('Scrapping data from all cpus of TechPowerUp website')
        .action( async () => {
            console.log('[SCRAPING] TechPowerUp');
            await techpowerupCPU();
            console.log('[SCRAPING COMPLETE]');
        });

        cpuScraper.command('techpowerup_data')
        .description('Scraping data from each individual cpu URL and save it to DB')
        .action( async () => {
            console.log('[SCRAPING] TechPowerUp Individual CPUs');
            await techpowerupCPU_data();
            console.log('[SCRAPING COMPLETE]');
        });

        // since we have the cpus in a json file we need to have command that calls function that reads all of this 
        // data and scrapes the cpu info and adds it to the cpu

        await scraper.parseAsync(process.argv);    


        process.exit(0);

    }catch(err){
        console.error(err);
        process.exit(1);
    }
    
}

main();