const puppeteer = require('puppeteer');
// below libraries surpass security measures from cloudfare and others
const puppeteer_extra = require('puppeteer-extra');
const puppeteer_extra_plugin = require('puppeteer-extra-plugin-stealth');

// Data handler controller library - Adds the parts and their information to DB
const cnAddCPU = require('../../lib/cpuDataHandlers/cpu_cnDataHandler');

// scraper for CPU collection page on Cloud Ninjas
const cnCollectionCPU = async () => {

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
        // !!!! FIXME: We can refactor both functions below and merge them into one function
        cpuTitles = await page.$$eval('.list-card', listCards =>
            listCards.map(card => {
                const titleElement = card.querySelector('.listText a');
                return titleElement ? titleElement.textContent.trim() : 'No Title';
            })
        );

        // FIX ME ! PRICE HAS TO BE CONVERTED INTO A FLOAT NUMBER 
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

        console.log(scrapedData);

        console.log(`Scraping ${website} Completed`);


    }catch(err){
        console.error(`Error Scraping: ${website}`);
        console.error(err);
    }

    // Once scraped data hash map is populated from the scraping
    // call controller function with arguments of array type containing the title and the prices
    // controller will run asynchronously, when done we can close browser and kill process

    await browser.close();
    console.log('Browser Closed');
    process.exit(0);

};

module.exports = { cnCollectionCPU };