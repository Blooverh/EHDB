import { Server } from '../../../models/server.js';
import slugify from 'slugify';
import puppeteer from 'puppeteer';

export default async function cnAddServer(dataArr){
    if(dataArr.length < 1){
        throw new Error('[Error] Array does not contain any Server information');
    }

    // console.log(dataArr);

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    for(const server of dataArr){

        let originalTitle = server.title;

        try{
            let {brand, model} = extractTitle(originalTitle);

            console.log(`${brand} - ${model} Extracted`);

            // go to individual page and extract chassis and pricing for each server 
            let chassis =[]; // will hold all chassis for each server 
            let price = []; // will hold all prices of each chassis

            /*
            Need to add a case where if server does not have a brand, we skip this 
            server and continue to the next server and its link
            */

            if(brand != null ){
                await page.goto(server.url, {waitUntil: 'domcontentloaded', timeout: 60000});

                chassis = await page.$$eval('option[data-var-idt]', els => 
                    els.map(chassis => 
                        chassis.getAttribute('data-var-idt') || ['No Chassis or Sold Out']
                    )
                );

                console.log(chassis);

                console.log('/////////');

            }else{
                console.log(`[ERROR] Should not scrape ${model}`);
            }
            // If there are no chassis scraped, the server will not be added to database

        }catch(err){
            // console.error(`[Error] Server ${brand} ${model}`);
            console.error(err);
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