import puppeteer from "puppeteer";
import puppeteerExtra from 'puppeteer-extra'; // plug in to bypass cloudflare
import xByteAddCPU from "../../lib/DB_utilities/cpuDataHandlers/cpu_xByteDataHandler.js";

export const xByteCollectionCpu = async () => {

    // array containing all pages that contain a collection of CPUs 
    const xBytePages = ['https://www.xbyte.com/products?class_id=39'];

    // lauch browser with extra plug-in to by pass cloudflare and other security measures 
    const browser = await puppeteerExtra.launch({headless: true}); 
    const page = await browser.newPage();

    // will hold both title and price of CPUs to send to function that extracts 
    // title correctly and the price 
    let scrappedData =[];

    console.log("[SCRAPPING] xByte");

    try{
        await page.goto(xBytePages[0], {waitUntil: 'domcontentloaded', timeout: 60000});

        /*  // we check based on page 1 how may pages exist within this collection
            // everytime we run the function if a new page is added it will scrape that new page  
        */

        // Evaluate the first instance of the HTML element that contains the total of pages 
        const totalPages = await page.$eval('.total[title="Total pages"]', el => el.textContent.trim().replace('/','').trim());

        for(let i =2; i <= totalPages; i++){
            xBytePages.push(`https://www.xbyte.com/products?class=CPUs&class_id=39&p=${i}&product_layout=product-list#results`);
        }

        let cpuTitles = [];
        let cpuPrices = [];

        // iterate through each page and scrape titles and prices of CPUs and add them 
        // as an object within ScrappedData array 

        for(let i = 0; i < xBytePages.length; i++){
            await page.goto(xBytePages[i], {waitUntil: 'domcontentloaded', timeout: 60000 });

            console.log(`[VISITING PAGE]  ${i}`);

            /*
                we run 2 for loops on top of the main loop
                there should be a faster way of extracting and adding
                info to the 2 arrays and avoid performing this option in 
                O(p * 2n) or O(p * n)
            */

            /* For better speeds this 2 calculations should be reafctored into one */
            // FIX ME !!!!! 
            // Extract Titles 
             cpuTitles = await page.$$eval('.results > li', listCards =>
                listCards.map(card => {
                    const titleElement = card.querySelector('.title');
                    return titleElement ? titleElement.textContent.trim() : 'No Title';
                })
            );

            // Extract Prices 
            cpuPrices = await page.$$eval('.results > li', listCards => 
                listCards.map(card => {
                    const price = card.querySelector('.individual-price');
                    return price ? price.textContent.trim() : 'No Price';
                })
            );

            // pair each title and price into an object and add to array 

            cpuTitles.forEach((title, index) => {
                 const price = cpuPrices[index];
                 scrappedData.push({title, price });
            });
        }
        
    }catch(err){
        console.error(err);
        process.exit(1);
    }

     await browser.close();

    if (scrappedData.length > 0) {
        await xByteAddCPU(scrappedData.map(d => d.title), scrappedData.map(d => d.price));
        console.log(`[INFO] xByte data saved to DB.`);
    } else {
        console.warn(`[INFO] No data scraped from xByte`);
    }

    console.log('[PROCESS] xByte CPUs Scraped and Saved accordingly');
    process.exit(1);
}
