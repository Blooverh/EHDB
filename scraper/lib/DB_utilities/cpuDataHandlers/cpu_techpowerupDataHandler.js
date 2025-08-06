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


// const jsonFile = path.resolve(__dirname, '../../infoExtracter/cpus_and_links.json');
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

        // console.log(cpuTitle);
        // console.log(cpuURL);


        PuppeteerExtra.use(puppeteerStealthPlugIn());
        const browser = await PuppeteerExtra.launch({headless: true});
        const page = await browser.newPage();

        if(cpuTitles.length !== cpuURLs.length){
            throw new Error('Scraping cannot proceed as both arrays do not have the same length');
        }

        // CHANGE LIMIT TO URL ARRAY LENGTH ONCE ALL SCRAPED
        for(let i = 0; i < 2; i++){
            const cpuModel = cpuTitles[i];
            const cpuURL = cpuURLs[i];

            const cpu = await CPU.findOne({ model: cpuModel.toLowerCase() });

            if(cpu){
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
                    }

                    //scrape each field and add it to data object 
                    const codename = getTextFromRow('Codename:');
                    if(codename){ data.codename = codename;}

                    const generation = getTextFromRow('Generation:');
                    if(generation) { data.generation = generation}

                    const memorySupport = getTextFromRow('Memory Support:');
                    if(memorySupport) {data.memorySupport = memorySupport}

                    const ratedSpeeds = getTextFromRow('Rated Speed:');
                    if(ratedSpeeds) {data.ratedSpeeds = ratedSpeeds}

                    const socket = getTextFromRow('Socket:');
                    if(socket) { data.socket = socket}

                    // Socket package missing

                    const processSize = getTextFromRow('Process Size:');
                    if(processSize){ data.processSize = processSize}

                    const cores = getTextFromRow('# of Cores:');
                    let core = parseFloat(cores);
                    if(!isNaN(core)){ 
                        data.cores = core;
                    }

                    return data;
                });

                console.log([cpuData.codename, cpuData.generation, cpuData.memorySupport, cpuData.ratedSpeeds, cpuData.socket, cpuData.processSize, cpuData.cores]);

            }else{
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