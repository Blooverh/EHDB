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

        for(let i =0; i < collectionPages.length; i++){
            await page.goto(collectionPages[i], {waitUntil: 'domcontentloaded', timeout: 60000});
            console.log(`[VISITING] page ${collectionPages[i]}`);
            serverTitles = await page.$$eval('.product-item-name', listCards => 
                listCards.map(card => {
                    const title = card.querySelector('a.product-item-link');
                    return title ? title.textContent.trim() : 'No Title Found';
                })
            );

            serverUrls = await page.$$eval('.product-item-name', listCards => 
                listCards.map(card => {
                    const url = card.querySelector('a.product-item-link');
                    return url ? url.href: 'No URL Found';
                })
            );

            serverTitles.forEach((title, index) => {
                const url = serverUrls[index];
                scrapedServers.push({title, url});
            });
        }
        
        console.log(scrapedServers);

        let chassisArr = [];
        let priceArr = [];

        let scrapedData = [];

        for(const server of scrapedServers){

            if(server.title !== 'No Title Found' || server.url !== 'No URL Found'){
                console.log(`[SCRAPING] ${server.title}`);
                
                await page.goto(server.url, {waitUntil: 'domcontentloaded', timeout: 60000});

                chassisArr = await page.$$eval('div[data-option-name="chassis"]', el => 
                    el.map(chassiOption => {
                        const chassis = chassiOption.querySelector('.product-name');
                        return chassis ? chassis.textContent.trim(): 'No Chassis Found';
                    })
                );

                priceArr = await page.$$eval('div[data-option-name="chassis"]', el => 
                    el.map(priceEl => {
                        let pricing = priceEl.querySelector('span.price').textContent.trim();
                        let priceInFloat = parseFloat(pricing.replace(/[^0-9.]/g, '')) || -1;
                        return priceInFloat;
                    })
                );
            }

            chassisArr.forEach((chassis, index) => {
                const price = priceArr[index];
                scrapedData.push({title:server.title, link: server.url, chassis, price})
            });

            
        }

        console.log(scrapedData);


    }catch(error){
        console.error('[ERROR] Could Not Scrape Server Monkey Servers: ' + error);
        process.exit(1);
    }

    await browser.close();


    console.log('[PROCESS] Server Monkey Servers Scraped and Saved to DB Accordingly');
}