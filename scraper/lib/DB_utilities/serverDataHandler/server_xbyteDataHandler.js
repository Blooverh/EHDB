import slugify from "slugify";
import { Server } from '../../../models/server.js'
import PuppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

PuppeteerExtra.use(StealthPlugin);

export default async function xbyteAddServer(dataArr){

    if(dataArr.length < 1){
        throw new Error('[ERROR] No Servers were scraped from collection');
    }

    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    let serverObjArr = [];
    let serverObj = {};

    // iterate through each server URL and fetch chassis 
    for(const server of dataArr){
        let link = server.url;
        let serverTitle = server.title;
        try{

            await page.goto(link, {waitUntil: 'networkidle2', timeout: 60000});

            //check if customize tab exists - means there are chassis on the configuration tab 
            // get number of tabs on each server page if more than 2 there is a configurator tab
            const customizeTab = await page.$$eval('.product-tabs > button', tabs => tabs.length);

            // weed out servers that do not have configurator, meaning no need to save 
            if(customizeTab > 2){

                const serverChassis = await page.$eval('.configurator-option.required', firstOption => {
                    const chassis = firstOption.querySelectorAll('.configurator-option-values > .configurator-option-value > .name');

                    return Array.from(chassis).map(el => el.textContent.trim());
                });

                console.log(serverChassis);


            }else{
                console.log(`[SKIPPED] ${serverTitle} does not have chassis`);
            }

        }catch(err){
            console.error(`[SERVER FAILED] Could not save ${serverTitle}  - [ERROR] ${err.message}`);
        }

        
    }

    

    await browser.close();

}