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

                console.log(`[SCRAPING] ${serverTitle} Page...`);

                const serverChassis = await page.$eval('.configurator-option.required', firstOption => {
                    const chassis = firstOption.querySelectorAll('.configurator-option-values > .configurator-option-value > .name');

                    return Array.from(chassis).map(el => el.textContent.trim());
                });

                const chassisPrice = await page.$eval('.configurator-option.required', chassis => {
                    const prices = chassis.querySelectorAll('.configurator-price');
                    const pricesArr = Array.from(prices).map(price => price.textContent.replace(/[$,]/g, '').trim());

                    let pricesInFloat = pricesArr.map(price => parseFloat(price));

                    return pricesInFloat;
                }); 

                serverObj = {
                    server: serverTitle,
                    chassis: serverChassis,
                    prices: chassisPrice,
                    websiteLink: link
                };

                serverObjArr.push(serverObj)

            }else{
                console.log(`[SKIPPED] ${serverTitle} does not have chassis`);
            }

        }catch(err){
            console.error(`[SERVER FAILED] Could not save ${serverTitle}  - [ERROR] ${err.message}`);
        }
        
    }

    console.log(serverObjArr);
    
    await browser.close();
    
    /*  2nd Step: 
        - Extract Server title and format it
        - Extract Chassis title and format it 
        - Check if Exists in database
            - create new entry if it does not exist 
            - if entry exists update pricing on that entry if price different from price in DB
            - If server does not exists in DB, add new Server to DB 
        
    */

    for(const server of serverObjArr){

        // check if both chassis and prices arrays have the same length, otherwise we cannot save to db 

        if(server.chassis.length !== server.prices.length){
            console.error('[ERROR] Chassis and prices do not match');
        }

        let {brand, model} = extractTitle(server.server);
        // let chassis = extractChassis(server.chassis);

        console.log(`Brand: ${brand} Model ${model}`);
        // console.log(chassis);

        // try{

        //     const serverDB = await Server.findOne({brand: brand, model: model});



        // }catch(error){
        //     console.error(`[ERROR] Could Not Save ${brand} ${model} in Database`);
        // }

    }


}

function extractTitle(title){
    // Should Be simple since xByte only does Dell servers 
    let words = title.split(' ');

    let brand = words[0];
    let model = `${words[1]} ${words[2]}`;

    return {brand, model};

}

function extractChassis(title){

}