import puppeteer from "puppeteer";
// Data handler controller library - Adds the parts and their information to DB

import cnAddCPU from "../../lib/DB_utilities/cpuDataHandlers/cpu_cnDataHandler.js";

// scraper for CPU collection page on Cloud Ninjas
export const cnCollectionCPU = async () => {
  const collectionURL =
    "https://cloudninjas.com/collections/cloud-ninjas-cpu-collection-processors";
  const website = "Cloud Ninjas";

  // extracted data from scraping will be held here and sent to controller to save on DB
  let scrapedData = [];

  // lauch puppeteer browser and open new page
  const browser = await puppeteer.launch({ headless: true }); // headless options allows browser runnning unattended and without visible UI
  const page = await browser.newPage();

  console.log(`[SCRAPPING] ${website}...`);

  try {
    // iterate through pages (pagination)
    for (let i = 1; i < 50; i++) {
      const pageURL = `${collectionURL}?page=${i}`;
      await page.goto(pageURL, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // check if page has any products - if no .list-card elements, we've reached the end
      const hasProducts = await page.$$(".list-card");
      if (hasProducts.length === 0) {
        console.log(
          `[INFO] No more products found on page ${i}, ending pagination.`,
        );
        break;
      }

      console.log(`[VISITING PAGE] ${pageURL}`);

      // Eval query selectors and extract title and prices from the list cards
      const pageTitles = await page.$$eval(".list-card", (listCards) =>
        listCards.map((card) => {
          const titleElement = card.querySelector(".listText a");
          return titleElement ? titleElement.textContent.trim() : "No Title";
        }),
      );

      const pagePrices = await page.$$eval(".list-card", (listCards) =>
        listCards.map((card) => {
          const priceElement = card.querySelector(".price-cart span");
          return priceElement ? priceElement.textContent.trim() : "No Price";
        }),
      );

      const pageLinks = await page.$$eval(".list-card", (listCards) =>
        listCards.map((card) => {
          const linkEl = card.querySelector(".listText a");
          const link = linkEl.href;
          return link ? link : "No Link Found";
        }),
      );

      // Pair each title with corresponding price and add to scrapedData
      pageTitles.forEach((title, idx) => {
        const price = pagePrices[idx];
        const link = pageLinks[idx];
        scrapedData.push({ title, price, link, website: website });
      });
    }
  } catch (err) {
    console.error(`[ERROR SCRAPING] ${website} -> ` + err);
    process.exit(1);
  }

  await browser.close();

  // Once scraped data hash map is populated from the scraping
  // call controller function with arguments of array type containing the title and the prices
  // controller will run asynchronously, when done we can close browser and kill process
  const TEST_MODE = process.env.TEST_MODE === "true";

  if (TEST_MODE) {
    console.log("[TEST MODE] Scraped data:");
    console.log(`Collection contains ${scrapedData.length} CPUs`);
    console.log(JSON.stringify(scrapedData, null, 2));
  } else if (scrapedData.length > 0) {
    await cnAddCPU(
      scrapedData.map((data) => data.title),
      scrapedData.map((data) => data.price),
      scrapedData.map((data) => data.link),
    );
    console.log("[INFO] Cloud Ninjas data saved to DB.");
  } else {
    console.warn("[INFO] No data scraped from Cloud Ninjas");
  }

  console.log("[PROCESS] Cloud Ninjas CPUs Scraped and Saved accordingly");
};
