import puppeteer from "puppeteer";
import PuppeteerExtra from "puppeteer-extra";
import puppeteerStealthPlugIn from "puppeteer-extra-plugin-stealth";

export const serverMonkeyCollectionCpu = async () => {
    const serverMonkeyPages = [];

    // adding puppeteer stealth plugin 
    PuppeteerExtra.use(puppeteerStealthPlugIn());
    const browser = await PuppeteerExtra.launch({headless: true});
    const page = await browser.newPage();

    let scrappedData = [];

    try{

        let cpuTitles =[];
        let cpuPrices =[];

        // goes to each page and checks if message that collection page is empty exists
        // if it exists break from conditional, if it does not exist, add URL to array of pages 
        for(let i =1; i < 50; i++){
            await page.goto(`https://www.servermonkey.com/parts-and-upgrades/processors.html?p=${i}`, {waitUntil: 'domcontentloaded', timeout: 60000});
            // console.log(`visiting page ${i}`);

            //check if HTML element that displays text of no products exists
            if(await page.$('div.message.info.empty')){
                break;
            }else{
                serverMonkeyPages.push(`https://www.servermonkey.com/parts-and-upgrades/processors.html?p=${i}`)
            }
        }   

        console.log(serverMonkeyPages.length)
        // iterate through each page, and add title and price to respective arrays 
        // then create and add object containing the title of CPU and respective price
        for (let i =0; i < serverMonkeyPages.length; i++ ){
            await page.goto(serverMonkeyPages[i], {waitUntil: 'domcontentloaded', timeout: 60000});

            console.log(`visiting page ${serverMonkeyPages[i]}`);

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

            // **Pair each title with its corresponding price**
            cpuTitles.forEach((title, index) => {
                const price = cpuPrices[index] || 'No Price';
                scrappedData.push({ title, price, website: 'Server Monkey' });
            });

        }

        console.log(scrappedData);

        // After scraping CPUs for this website, save the data
        // if (scrappedData.length > 0) {
        //     await serverMonkeyAddCPU(scrappedData.map(d => d.title), scrappedData.map(d => d.price));
        //     console.log(`Finished scraping ${websiteName}, data saved to DB.`);
        // } else {
        //     console.warn(`No data scraped for ${websiteName}`);
        // }


    }catch(err){
        console.error(`Error Scraping Server Monkey Website`);
        process.exit(0);
    }

    await browser.close();
    console.log(`Scraping of Server Monkey complete`);
    process.exit(1);
}