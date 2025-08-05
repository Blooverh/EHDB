import PuppeteerExtra from "puppeteer-extra";
import puppeteerStealthPlugIn from 'puppeteer-extra-plugin-stealth';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the file path from the current module URL (this file)
// derive __filename and __dirname from it 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

PuppeteerExtra.use(puppeteerStealthPlugIn());

// adding delay for a less bot ish movement for avoiding bot detection
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// resolve the following URL from the json file (the path) to a path object and add it to variable 'jsonfile'
const jsonfile = path.resolve(__dirname, '../../lib/infoExtracter/cpus_and_links.json');

// SOME OF THIS FILES WITH TIME WILL HAVE MORE CPUS THAT WILL NOT SHOW IN PAGE
// WE WILL NEED A AWAY TO FIND A SOLUTION TO GET THOSE MISSING CPUS AND URLS
const pageArr =[
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+AM5~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+SP3~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_AMD+Socket+SP5~generation_AMD+EPYC',
'https://www.techpowerup.com/cpu-specs/?f=socket_Intel+Socket+2011-3~generation_Intel+Xeon+E5',
'https://www.techpowerup.com/cpu-specs/?f=socket_Intel+Socket+2011-3~generation_Intel+Xeon+E7',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Silver',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Gold',
'https://www.techpowerup.com/cpu-specs/?f=socket~generation_Intel+Xeon+Platinum'
];

export const techpowerupCPU = async () => {

    let scrapped_data = [];
    const browser = await PuppeteerExtra.launch({ headless: true });
    const page = await browser.newPage();

    try{

        for(let pg of pageArr){
            await page.goto(pg, {waitUntil: 'domcontentloaded', timeout: 60000});

            let cpuTitle = await page.$$eval('.items-desktop-table td a', el => 
                el.map(title => {
                    return title ? title.textContent.trim() : 'No Title';
                })
            );

            let cpuLink = await page.$$eval('.items-desktop-table td a', el => 
                el.map(title => {
                    return title ? title.href : 'No Link';
                })
            );

            cpuTitle.forEach((title, idx) => {
                const link = cpuLink[idx];
                scrapped_data.push({title, link});
            });

            // apply delay for extra bot detection
            await delay(Math.floor(Math.random() * 2000) + 1000);
        }

        console.log(scrapped_data);

    }catch(e){
        console.log(e);
    }

    // write scraped data by stringifying into json format and use fs library to write scraped data to the json file 
    const jsonContent = JSON.stringify(scrapped_data, null, 2);
    fs.writeFileSync(jsonfile, jsonContent, 'utf8');

    await browser.close();

    console.log('[PROCESS] TechPowerUp CPU collection scraped and saved successfully to JSON file');

}