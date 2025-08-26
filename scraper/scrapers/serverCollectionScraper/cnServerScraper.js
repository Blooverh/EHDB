import puppeteer from "puppeteer";
import cnAddServer from "../../lib/DB_utilities/serverDataHandler/server_cnDataHandler.js";

// URL for main collection of all servers 1st page 
const CN_COLLECTION_URL = 'https://cloudninjas.com/collections/cloud-ninjas-servers';
let CN_URLS =[CN_COLLECTION_URL];

export const cnCollectionServer = async () => {

    let scrapedData = []; 
    let totalPages = 0;

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    try{
        // 1st step, get all total pages 
        await page.goto(CN_COLLECTION_URL, {waitUntil: 'domcontentloaded', timeout: 60000});

        let pageArr = await page.$$eval('.box-page', pages => 
            pages.map(page => {
                return page.textContent.trim();
            })
        )
        
        totalPages = pageArr.at(-1);
        
        for(let i=2; i <= totalPages; i++){
            CN_URLS.push(`${CN_COLLECTION_URL}?page=${i}`);
        }

        let serverTitles = [];
        let serverURLs = [];

        for(let i=0; i < CN_URLS.length; i++){
            await page.goto(CN_URLS[i], {waitUntil: 'domcontentloaded', timeout: 60000});

            serverTitles = await page.$$eval('.card_server-title', cards => 
                cards.map(card => {
                    const title = card.querySelector('a').textContent.trim();
                    
                    return title ? title : 'No Title Found';
                })
            );

            serverURLs = await page.$$eval('.card_server-title', cards => 
                cards.map(card => {
                    const url = card.querySelector('a').href;

                    return url ? url : 'No Link Found';
                })
            );

            serverTitles.forEach((title, idx) => {
                const url = serverURLs[idx];
                scrapedData.push({title, url});
            });
        }

    }catch(e){
        console.error(e);
        process.exit(1); 
    }

    await browser.close();

    if(scrapedData.length > 1){
        await cnAddServer(scrapedData);
    }else{
        console.warn('[INFO] No Servers Scraped from Cloud Ninjas')
    }

    console.log('[PROCESS] Cloud Ninjas Servers Scraped and Saved Accordingly');
}

