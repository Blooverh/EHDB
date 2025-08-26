import PuppeteerExtra from "puppeteer-extra";
import puppeteerStealthPlugIn from "puppeteer-extra-plugin-stealth";

// use plug in since server monkey uses extra bot detection measures 
PuppeteerExtra.use(puppeteerStealthPlugIn());

let serverMonkeyDellCollection = 'https://www.servermonkey.com/servers/refurbished-dell.html';
let serverMonkeyHpeCollection = 'https://www.servermonkey.com/servers/refurbished-hpe.html';
// let serverMonkeySupermicroCollection = '';

export async function smCollectionServer() {

    // will hold all pages within Dell and HPE collections, since there is multiple pages with multiple servers
    let collectionPages = [];

    let scrapedServers = [];

    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    try{

        console.log('[SCRAPING IN PROGRESS]....');

        let serverTitles = [];
        let serverUrls = [];

        // Since there is no functionality to capture the amount of pages in a server collection
        // we use a dummy variable of 20 pages 
        let dummyPageLimit = 20;

        // scraping Dell Collection
        for(let i = 1; i < dummyPageLimit; i++ ){
            let currPg = `${serverMonkeyDellCollection}?p=${i}`;
            await page.goto(currPg, {waitUntil: 'domcontentloaded', timeout: 60000});

            // we check if page is empty by evaluating a specific selector 
            if(await page.$('.message.info.empty')){
                break;
            }else{
                collectionPages.push(currPg);
            }
        }

        //Scraping HPE collection 
        for(let i = 1; i < dummyPageLimit; i++){
            let currPg = `${serverMonkeyHpeCollection}?p=${i}`;
            await page.goto(currPg, {waitUntil: 'domcontentloaded', timeout: 60000});

            if(await page.$('.message.info.empty')){
                break;
            }else{
                collectionPages.push(currPg);
            }
            
        }

        console.log(collectionPages);

    }catch(error){
        console.error('[ERROR] Could Not Scrape Server Monkey Servers');
        process.exit(1);
    }

    await browser.close();


    console.log('[PROCESS] Server Monkey Servers Scraped and Saved to DB Accordingly');
}