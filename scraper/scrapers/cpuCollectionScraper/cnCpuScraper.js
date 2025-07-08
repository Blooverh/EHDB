
import puppeteer from 'puppeteer';
// Data handler controller library - Adds the parts and their information to DB

import cnAddCPU from '../../lib/DB_utilities/cpuDataHandlers/cpu_cnDataHandler.js';

// scraper for CPU collection page on Cloud Ninjas
export const cnCollectionCPU = async () => {

    const collectionURL = 'https://cloudninjas.com/collections/cloud-ninjas-cpu-collection-processors';
    const website = "Cloud Ninjas";

    // extracted data from scraping will be held here and sent to controller to save on DB
    let scrapedData = [];

    // lauch puppeteer browser and open new page 
    const browser = await puppeteer.launch({ headless: true }); // headless options allows browser runnning unattended and without visible UI
    const page = await browser.newPage(); 

    console.log(`Starting to Scrape ${website}...`);

    try{

        console.log('Getting Page ' + `${collectionURL}`);
        // browse to page wait for document to load, overhead is 1 second wait before timing out
        await page.goto(collectionURL, {waitUntil: 'domcontentloaded', timeout: 60000});

        // arrays to hold title, mpn, cache and price 
        let cpuTitles = [];
        let cpuPrices = [];

        // Eval query selectors and extract title and prices from the list cards 

        cpuTitles = await page.$$eval('.list-card', listCards =>
            listCards.map(card => {
                const titleElement = card.querySelector('.listText a');
                return titleElement ? titleElement.textContent.trim() : 'No Title';
            })
        );

        cpuPrices = await page.$$eval('.list-card', listCards =>
            listCards.map(card => {
                const priceElement = card.querySelector('.price-cart span');
                return priceElement ? priceElement.textContent.trim() : 'No Price';
            })
        );

        // Pair each title with correspoding price
        cpuTitles.forEach((title, idx) => {
            const price = cpuPrices[idx] || 'No Price';
            // push both title, price and website name to hashmap
            scrapedData.push({title, price, website: website});
        });

        console.log(`Scraping ${website} Completed`);


    }catch(err){
        console.error(`Error Scraping: ${website}`);
        console.error(err);
    }

    // Once scraped data hash map is populated from the scraping
    // call controller function with arguments of array type containing the title and the prices
    // controller will run asynchronously, when done we can close browser and kill process
    if(scrapedData.length > 0){
        await cnAddCPU(scrapedData.map(data => data.title), scrapedData.map(data => data.price));
        console.log('Cloud Ninjas Scraped and Saved Successfully to Database');
    }else{
        console.warn('No Data Scraped from Cloud Ninjas Could Be Saved in Database');
    }

    await browser.close();
    console.log('Browser Closed');
    process.exit(0);

};
