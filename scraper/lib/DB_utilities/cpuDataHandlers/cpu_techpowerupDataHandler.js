import { CPU } from "../../../models/cpu.js";
import { PuppeteerExtra } from "puppeteer-extra";
import puppeteerStealthPlugIn from "puppeteer-extra-plugin-stealth";
/**
    * Finds existing CPUs in the database and updates them with data scraped from TechPowerUp.
    * @param {string[]} modelArr - Array of CPU models to find and update.
    * @param {string[]} linkArr - Array of corresponding TechPowerUp links to scrape data from.      
*/

export default async function techpAddCPU(modelArr, linkArr){
    if(modelArr.length !== linkArr.length){
        console.error('[ERROR] both arrays do not have the same length hence we cannot continue with scraping and adding data to database');
        process.exit(1);
    }

    PuppeteerExtra.use(puppeteerStealthPlugIn());
    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    console.log('[SCRAPING] Individual pages...');

    for(let i = 0; i < modelArr.length; i++ ){
        let scrapedModel = modelArr[i].toLowerCase();
        let link = linkArr[i];

        try{
            const cpu = await CPU.findOne({model: scrapedModel});

            if(cpu){
                // console.log(`${cpu.brand} ${cpu.model} - TechPowerUp at ${linkArr[i]} - model: ${scrapedModel}`);

                await page.goto(link, {waitUntil: 'domcontentloaded', timeout: 60000});

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

                    return data;
                });

                console.log(cpuData.codename);


            }else{
                console.log(`[ERROR] ${scrapedModel} does not exist in database`);
            }
        }catch(e){
            console.error(e);
        }
    }

    await browser.close();
}
