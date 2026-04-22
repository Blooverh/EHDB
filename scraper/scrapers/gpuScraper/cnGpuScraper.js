import puppeteer from "puppeteer";

// Import gpu data handler (controller to add gpus to database)
import cnAddGPU from "../../lib/DB_utilities/gpuDataHandlers/gpu_cnDataHandler.js";

export const cnCollectionGpu = async () => {
  const collectionUrl =
    "https://cloudninjas.com/collections/nvidia-gpus-for-ai-high-performance-computing";
  let collectionPageArr = [];
  const website = "Cloud Ninjas";

  let scrapedData = [];

  // Initializa headless browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let totalPages = 0;

  console.log(`[SCRAPPING GPUS] ${website}...`);

  try {
    await page.goto(collectionUrl, {
      waitUntil: "domcontentloaded",
      timeout: 6000,
    });

    let pageArr = await page.$$eval(".box-page", (pages) =>
      pages.map((page) => {
        return page.textContent.trim();
      }),
    );

    totalPages = pageArr.length > 0 ? Number(pageArr.at(-1)) : 1;
    console.log("total pages: " + totalPages);

    if (pageArr.length === 0) {
      console.log("WARNING: No pagination found. Checking if page 2 exists...");
    }

    for (let i = 1; i <= totalPages; i++) {
      collectionPageArr.push(`${collectionUrl}?page=${i}`);
    }

    let gpuTitles = [];
    let gpuUrls = [];
    let gpuPrices = [];

    for (let i = 0; i < collectionPageArr.length; i++) {
      await page.goto(collectionPageArr[i], {
        waitUntil: "domcontentloaded",
        timeout: 6000,
      });

      console.log(`[VISITING PAGE] ${collectionPageArr[i]}`);

      gpuUrls = await page.$$eval(".cardImage", (gpuUrl) =>
        gpuUrl.map((url) => {
          const linkEllement = url.querySelector("a");
          const link = linkEllement.href;
          return link ? link : "No Link";
        }),
      );

      gpuTitles = await page.$$eval(".cardImage", (gpuTitle) => 
       gpuTitle.map((title) => {
        const el = title.querySelector('.product-title').textContent.replace(' GPU', '').trim();

        return el ? el : 'No title found';
       }) 
     );

     gpuPrices = await page.$$eval(".pr", (gpuPrice) => 
        gpuPrice.map((price) => {
            const priceElement = price.querySelector(".pr-price").textContent.replace("$",'').trim();

            return priceElement ? priceElement : 'No Price Found';
        })
     )

      gpuUrls.forEach((url, idx) => {
        const title = gpuTitles[idx];
        const price = gpuPrices[idx];
        scrapedData.push({title, price, url});
      });
    }

    // console.log(scrapedData);

  } catch (err) {
    console.error(`[ERROR SCRAPING] ${website} Closing scraping -> ` + err);
    process.exit(1);
  }

  await browser.close();

  if(scrapedData.length > 0){
    cnAddGPU(
        scrapedData.map((data) => data.title),
        scrapedData.map((data) => data.price),
        scrapedData.map((data) => data.url)
    )
  }

  console.log("[PROCESS] Cloud Ninjas GPUs Scraped and Saved accordingly");
};
