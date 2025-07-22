import PuppeteerExtra from "puppeteer-extra";
import puppeteerStealthPlugIn from "puppeteer-extra-plugin-stealth";
import smAddCPU from "../../lib/DB_utilities/cpuDataHandlers/cpu_smDataHandler.js";

export const serverMonkeyCollectionCpu = async () => {
    const serverMonkeyPages = [];

    // adding puppeteer stealth plugin 
    PuppeteerExtra.use(puppeteerStealthPlugIn());
    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    let scrappedData = [];

    console.log("[SCRAPPING] Server Monkey");

    try{

        let cpuTitles =[];
        let cpuPrices =[];
        let cpuLinks = [];

        // goes to each page and checks if message that collection page is empty exists
        // if it exists break from conditional, if it does not exist, add URL to array of pages 
        for(let i =1; i < 50; i++){
            await page.goto(`https://www.servermonkey.com/parts-and-upgrades/processors.html?p=${i}`, {waitUntil: 'domcontentloaded', timeout: 60000});

            //check if HTML element that displays text of no products exists
            if(await page.$('div.message.info.empty')){
                break;
            }else{
                serverMonkeyPages.push(`https://www.servermonkey.com/parts-and-upgrades/processors.html?p=${i}`)
            }

            console.log('[CHECKING] Server Monkey Collection Pages....')
        }   

        // iterate through each page, and add title and price to respective arrays 
        // then create and add object containing the title of CPU and respective price
        for (let i =0; i < serverMonkeyPages.length; i++ ){
            await page.goto(serverMonkeyPages[i], {waitUntil: 'domcontentloaded', timeout: 60000});


            console.log(`[VISITING PAGE] ${serverMonkeyPages[i]}`);

            cpuTitles = await page.$$eval('.product-item', listCards =>
                listCards.map(card => {
                    const titleElement = card.querySelector('.product-item-link');
                    return titleElement ? titleElement.textContent.trim() : 'No Title';
                })
            );
    
            cpuPrices = await page.$$eval('.product-item', listCards =>
                listCards.map(card => {
                    const priceElement = card.querySelector('.price');
                    return priceElement ? priceElement.textContent.trim() : 'No Price';
                })
            );

            cpuLinks = await page.$$eval('.product-item', listCards =>
                listCards.map(card => {
                    const linkElement = card.querySelector('.product-item-link');
                    const link = linkElement.href;
                    return link ? link : 'No Link Found';
                })
            );

            // **Pair each title with its corresponding price**
            cpuTitles.forEach((title, index) => {
                const price = cpuPrices[index];
                const link = cpuLinks[index];
                scrappedData.push({ title, price, link });
            });

        }

    }catch(err){
        console.error(`Error Scraping Server Monkey Website`);
        process.exit(1);
    }

    await browser.close();

    // console.log(scrappedData);

    // After scraping CPUs for this website, save the data
    if (scrappedData.length > 0) {
        await smAddCPU(scrappedData.map(d => d.title), scrappedData.map(d => d.price), scrappedData.map(d => d.link));
        console.log(`[DATA SAVED IN DB]`);
    } else {
        console.warn(`[ERROR] No data scraped for ${websiteName}`);
    }


    console.log(`[PROCESS] Server Monkey CPUs Scraped and Saved Accordingly`);
    process.exit(0);
}