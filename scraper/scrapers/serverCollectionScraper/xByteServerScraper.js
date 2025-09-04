import PuppeteerExtra from "puppeteer-extra";
import PuppeteerStealthPlugin from "puppeteer-extra-plugin-stealth";

PuppeteerExtra.use(PuppeteerStealthPlugin);

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

        


    }catch(err){
        console.error(err);
    }


    await browser.close();

}