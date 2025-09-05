import PuppeteerExtra from "puppeteer-extra";
import PuppeteerStealthPlugin from "puppeteer-extra-plugin-stealth";
import xbyteAddServer from "../../lib/DB_utilities/serverDataHandler/server_xbyteDataHandler.js";

PuppeteerExtra.use(PuppeteerStealthPlugin());

// xByte's page containing all Dell servers (what they specialize)
const xByteServerURL = 'https://www.xbyte.com/products?class=Servers&class_id=84';

export async function xByteCollectionServer(){
    let xBytePageCollection =[xByteServerURL];

    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    let scrapedServers = []; // hold titles and links of each server in collection page 

    try {

        // checking initial number of collection pages 
        await page.goto(xByteServerURL, {waitUntil: 'domcontentloaded', timeout: 60000});

        console.log(`[INFO] SCRAPING Total Number of collection pages`);

        let totalPages = await page.$eval('span.total[title="Total pages"]', el => el.textContent.replace('/', '').trim()); // default number of pages (will change on scraping)
        totalPages = parseInt(totalPages);

        console.log(`There are ${totalPages} collection pages containin servers`);

        for(let i = 2; i <= totalPages; i++){
            xBytePageCollection.push(`https://www.xbyte.com/products?class=Servers&class_id=84&p=${i}&product_layout=product-list#results`);
        }

        console.log(xBytePageCollection);

        // Scraping each server from list from collection of pages above scraped

        for(let i =0; i < xBytePageCollection.length; i++){

            await page.goto(xBytePageCollection[i], {waitUntil: 'domcontentloaded', timeout: 60000});

            let serverTitles = [];
            let serverUrls = [];

            serverTitles = await page.$$eval('.results > li', listCards => listCards.map(card => {
                const titleEl = card.querySelector('.title');

                return titleEl ? titleEl.textContent.trim() : 'No Title Found';
            }));

            // Servers with configurator will display options when url has '?config='
            serverUrls = await page.$$eval('.results > li', listCards => listCards.map(card => {
                const urlEl = card.querySelector('a.product-card');
                const confUrl = urlEl.href + '?config=';

                return confUrl ? confUrl : 'No Link Found';
            }));

            serverTitles.forEach((title, idx) => {
                const url = serverUrls[idx];
                scrapedServers.push({title, url});
            });

        }

        console.log(scrapedServers);


    }catch(err){
        console.error(err);
        process.exit(1);
    }


    await browser.close();

    await xbyteAddServer(scrapedServers);

    console.log('[PROCESS] xByte Servers Scraped and Saved to DB Accordingly');

}