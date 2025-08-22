import { Server } from '../../../models/server.js';
import slugify from 'slugify';
import puppeteer from 'puppeteer';

export default async function cnAddServer(dataArr){
    if(dataArr.length < 1){
        throw new Error('[Error] Array does not contain any Server information');
    }

    // console.log(`There are ${dataArr.length} Servers`);

    let serverData = [];

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    console.log('[SCRAPING INDIVIDUAL PAGES] In Progress....')

    for(const server of dataArr){

        let originalTitle = server.title;

        try{
            let {brand, model} = extractTitle(originalTitle);

            // go to individual page and extract chassis and pricing for each server 
            let chassis =[]; // will hold all chassis for each server 
            let prices = []; // will hold all prices of each chassis

            /*
            Need to add a case where if server does not have a brand, we skip this 
            server and continue to the next server and its link

            !!!! SERVERS WITH NO PRICING AND NO CHASSIS OPTIONS ARE SCRAPED BUT NO ADDED 
            TO ARRAY THAT SAVES THEM TO THE DATABASE
            */

            if(brand != null ){

                await page.goto(server.url, {waitUntil: 'domcontentloaded', timeout: 60000});

                chassis = await page.$$eval('option[data-var-idt]', els => 
                    els.map(chassis => 
                        chassis.getAttribute('data-var-idt') || 'No Chassis'
                    )
                );

                prices = await page.$$eval('option[data-custom-price]', priceEl => 
                    priceEl.map(pricing => pricing.getAttribute('data-custom-price') || 0)
                );

                if (prices.length !== chassis.length) {
                    throw new Error('Num of chassis has to equal num of prices, each chassis has its price');
                }

                // forEach loop skips if array is empty, servers with no chassis options are skipped from being added to serverData and considered to be saved to Database
                if (chassis.length === 0) {
                    console.log(`[SKIPPED] Server: ${brand} - ${model} has no chassis or price information.`);
                } else {
                    chassis.forEach((chassi, index) => {
                        // parse price string to a float, replace all non-numeric values with empty
                        const price = parseFloat(prices[index].replace(/[^0-9.]/g, '')) || 0;
                        serverData.push({serverBrand: brand, serverModel: model, website: 'Cloud Ninjas', pricing: price, chassisType: chassi, serverLink: server.url });
                    });
                    console.log(`[SCRAPED] ${brand} - ${model}`);
                }

            }else{
                console.log(`[SKIPPED] Should not scrape ${model}`);
            }
            // If there are no chassis scraped, the server will not be added to database

        }catch(err){

            console.error(`[SCRAPE FAILED] Error processing server: ${originalTitle} - URL: ${server.url}`);
            console.error(err);
        }
    }

    /* logic to add server to database, check if server exists and add new chassis or website entry for chassis
    or just add new server and first chassis scraped 
    */ 

    if(serverData.length < 1){
        throw new Error('Array contains no Servers and Chassis');
    }

    for(const data of serverData){

        try{
            let server = await Server.findOne({brand: data.serverBrand, model: data.serverModel});

            if(server){

                let chassisToUpdate = server.chassisInfo.find(info => 
                    info.website === 'Cloud Ninjas' && info.chassis === data.chassisType
                );

                // if chassis for a website already exists then we only check to update pricing 
                if(chassisToUpdate){
                    if(chassisToUpdate.currPrice !== data.pricing){
                        chassisToUpdate.oldPrice = chassisToUpdate.currPrice;
                        chassisToUpdate.currPrice = data.pricing;

                        console.log(`[UPDATING] Server: ${server.brand} ${server.model}, Chassis: ${chassisToUpdate.chassis}, New Price: ${chassisToUpdate.currPrice}`)
                    }
                }else{ 
                    // if chassis for website does not exist create new entry of that chassis for that website

                    server.chassisInfo.push({website: data.website, currPrice: data.pricing, oldPrice: data.pricing, chassis: data.chassisType, websiteLink: data.serverLink});
                    
                    console.log(`[NEW CHASSIS ADDED] Server: ${server.brand} ${server.model} - chassis: ${data.chassisType}, Price: ${data.pricing}`);

                }

                await server.save();

            }else{
                const slug = slugify(data.serverModel, {
                    replacement: '-',
                    lower: true,
                    strict: true
                });

                server = new Server({
                    brand: data.serverBrand,
                    model: data.serverModel,
                    chassisInfo: [{
                        website: data.website,
                        currPrice: data.pricing,
                        oldPrice: data.pricing,
                        websiteLink: data.serverLink,
                        chassis: data.chassisType
                    }], 
                    slug: slug
                })

                await server.save();

                console.log(`[NEW SERVER SAVED] ${data.serverBrand} - ${data.serverModel}`);
            }
        }catch(error){
            console.error(`[SERVER FAILED PROCESSING] ${data.serverBrand} - ${data.serverModel}. [ERROR] ${error.message}`);
        }

        
    }

    await browser.close();

    
}


function extractTitle(title){
    // since we extract the title from scraping we trim white space to make sure title has no unecessary whitespaces
    const processedTitle = title.trim();

    // Array of possible brands, if new brand not in array, add it 
    const brands = ['Dell', 'HPE', 'Supermicro', 'ASUS', 'ASRock', 'Gigabyte', 'Cloud Ninjas', 'Tyan', 'MSI'];

    // sort brands by length, descending so longer brand strings are checked first 
    const sortedBrands = [...brands].sort((a,b) => b.length - a.length);

    let brand = null; 
    let model = processedTitle; // we default model to whole title if no model if found in title

    for(const b of sortedBrands){
        // use startWith method to check 
        // make sure we make it case insensitive to avoid any titles that contain a mix such as ASRock
        if(processedTitle.toLowerCase().startsWith(b.toLowerCase())){
            // Slice the original title to preserve casing for the brand
            brand = processedTitle.substring(0, b.length);
            model = processedTitle.substring(b.length).replace('Server', '').trim();
            
            break; // Exit loop once the first (and longest) match is found
        }
    }

    return {brand, model};

}