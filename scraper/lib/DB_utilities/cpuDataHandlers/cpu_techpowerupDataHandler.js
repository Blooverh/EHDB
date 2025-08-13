import { CPU } from "../../../models/cpu.js";
import PuppeteerExtra  from "puppeteer-extra";
import puppeteerStealthPlugIn from "puppeteer-extra-plugin-stealth";
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adding delay for a less bot ish movement for avoiding bot detection
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
    * Finds existing CPUs in the database and updates them with data scraped from TechPowerUp.
    * @param {string[]} modelArr - Array of CPU models to find and update.
    * @param {string[]} linkArr - Array of corresponding TechPowerUp links to scrape data from.      
*/

// NEED TO CHANGE THIS TO READ URL AND TITLE FROM JSON FILE AND SCRAPE THE INFO 
// NEED TO IMPORT CORRECTLY THE JSON FILE 

export default async function techpAddCPU(){

    const jsonFile = path.resolve(__dirname, '../../infoExtracter/cpus_and_links.json');

    try {
        const data = await fs.promises.readFile(jsonFile, 'utf-8');
        const cpuJsonFile = JSON.parse(data);

        if (Object.keys(cpuJsonFile).length === 0) {
            console.error('[ERROR] JSON file is empty, cannot continue with scraping and adding data to database');
            process.exit(1);
        }

        const cpuTitles = [];
        const cpuURLs = [];
        for (const cpu of cpuJsonFile) {
            cpuTitles.push(cpu.title);
            cpuURLs.push(cpu.link);
        }


        PuppeteerExtra.use(puppeteerStealthPlugIn());
        const browser = await PuppeteerExtra.launch({headless: true});
        const page = await browser.newPage();

        if(cpuTitles.length !== cpuURLs.length){
            throw new Error('Scraping cannot proceed as both arrays do not have the same length');
        }

        // CHANGE LIMIT TO URL ARRAY LENGTH ONCE ALL SCRAPED
        for(let i = 0; i < cpuURLs.length; i++){
            const cpuModel = cpuTitles[i];
            const cpuURL = cpuURLs[i];

            const cpu = await CPU.findOne({ model: cpuModel.toLowerCase() });

            // check if cpu exists and if codename is default value, if it is we proceed to scraping techpowerup cpu and get all the information needed to save to DB
            if(cpu && cpu.codename == 'N/A'){
                // console.log(`[CPU] ${cpu.brand} - ${cpuModel} does exist in DB`);

                await page.goto(cpuURL, {waitUntil: 'domcontentloaded', timeout: 60000});

                // we evaluate the entire page and look for the selectors that contain the cpu information
                const cpuData = await page.evaluate(() => {
                    const data = {};

                    // helper function to get text from a table row based on its header
                    const getTextFromRow = (headerText) => {
                        const headerCell = Array.from(document.querySelectorAll('th')).
                        find(el => el.textContent.trim() === headerText);
                        // return the text of the next cell in the row or null if not found 
                        return headerCell ? headerCell.nextElementSibling.textContent.trim() : null;
                    };

                    //scrape each field and add it to data object 
                    const codename = getTextFromRow('Codename:');
                    if(codename){ data.codename = codename;}

                    const generation = getTextFromRow('Generation:');
                    if(generation) { data.generation = generation.replace(/\s+/g, ' ').trim(); }

                    const memorySupport = getTextFromRow('Memory Support:');
                    if(memorySupport) {data.memorySupport = memorySupport.split(',').map(s => s.trim());}

                    const ratedSpeedsStr = getTextFromRow('Rated Speed:');
                    if(ratedSpeedsStr) {
                        const speed = parseInt(ratedSpeedsStr, 10);
                        if (!isNaN(speed)) {
                            data.ratedSpeeds = speed;
                        }
                    }

                    const socket = getTextFromRow('Socket:');
                    if(socket) { data.socket = socket}

                    const socketPackage = getTextFromRow('Package:');
                    if(socketPackage){data.socketPackage = socketPackage}

                    const processSize = getTextFromRow('Process Size:');
                    if(processSize){ data.processSize = processSize}

                    const coresStr = getTextFromRow('# of Cores:');
                    if (coresStr) {
                        const cores = parseInt(coresStr, 10);
                        if(!isNaN(cores)){ 
                            data.coreNum = cores;
                        }
                    }

                    const threadsStr = getTextFromRow('# of Threads:');
                    if (threadsStr) {
                        const threads = parseInt(threadsStr, 10);
                        if(!isNaN(threads)){
                            data.threadNum = threads;
                        }
                    }

                    const frequencyStr = getTextFromRow('Frequency:');
                    if (frequencyStr) {
                        const frequency = parseFloat(frequencyStr.replace('GHz', '').trim());
                        if(!isNaN(frequency)){
                            data.frequency = frequency;
                        }
                    }

                    const turboClocksStr = getTextFromRow('Turbo Clock:');
                    if (turboClocksStr) {
                        const clock = parseFloat(turboClocksStr.replace(/[^0-9.]/g,'').trim());
                        if(!isNaN(clock)){
                            data.turboFrequency = clock;
                        }
                    }

                    const powerStr = getTextFromRow('TDP:');
                    if (powerStr) {
                        const tdp = parseFloat(powerStr.replace('W','').trim());
                        if(!isNaN(tdp)){
                            data.tdp = tdp;
                        }
                    }

                    const memoryBus = getTextFromRow('Memory Bus:');
                    if(memoryBus){
                        data.memoryBus = memoryBus;
                    }

                    const mpn = getTextFromRow('Part#:');
                    if(mpn){
                        data.partNum = mpn;
                    }

                    const eccMemory = getTextFromRow('ECC Memory:');
                    data.eccMemory = (eccMemory === 'Yes');

                    const cacheL1 = getTextFromRow('Cache L1:');
                    const cacheL2 = getTextFromRow('Cache L2:');
                    const cacheL3 = getTextFromRow('Cache L3:');
                    if(cacheL1 && cacheL2 && cacheL3){
                        data.cache = {
                            cacheL1: cacheL1,
                            cacheL2: cacheL2,
                            cacheL3: cacheL3
                        };
                    }

                    const pcieGen = getTextFromRow('PCI-Express:');
                    if(pcieGen){
                        data.pcieGen = pcieGen;
                    }

                    return data;
                });
                
                // Assign all scraped properties from cpuData to the cpu document
                Object.assign(cpu, cpuData);

                await cpu.save();

                // console.log(`[SCRAPED DATA] for ${cpuModel}:`, cpuData);
                console.log(`[SCRAPED DATA] for ${cpuModel}`);

            }else if(cpu && cpu.codename != 'N/A'){
                console.log(`[SKIP] ${cpuModel} was already scraped`);
            }
            else{
                console.log(`[CPU] ${cpuModel} DOES NOT EXIST in DB`)
            }

            // apply delay for extra bot detection
            await delay(Math.floor(Math.random() * 2000) + 1000);

        }

        await browser.close();

    } catch (e) {
        console.error('[ERROR] Error reading or parsing JSON or Model does not exists in Database: ', e);
        process.exit(1);
    }

    
}