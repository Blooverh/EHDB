import { GPU } from "../../../models/gpu.js";
import slugify from "slugify";

export default async function cnAddGPU(titleArr, priceArr, linksArr) {
  if (
    titleArr.length !== priceArr.length &&
    titleArr.length !== linksArr.length &&
    priceArr.length !== linksArr.length
  ) {
    console.error(
      "[ERROR] Arrays containg data for links, titles and prices are not the same length hence cannot be saved on DB",
    );
    process.exit(1);
  }

  // console.log(titleArr);
  // console.log(priceArr);
  // console.log(linksArr);

  for (let i = 0; i < titleArr.length; i++) {
    const originalName = titleArr[i];
    const priceInFloat = parseFloat(priceArr[i].replace(/,/g, ""));
    const link = linksArr[i];

    const { brand, model } = extractGpuName(titleArr[i]);

    const gpu = await findGPUByModel(model, brand);

    const slug = slugify(model, {
      replacement: "-",
      lower: true,
      strict: true,
    });

    try {
      if (gpu) {
        // store value of Cloud Ninjas if GPU has a Cloud Ninjas Entry
        let existingWebsite = gpu.gpuInfo.find(
          (website) => website.website === "Cloud Ninjas",
        );

        // check if Cloud Ninjas entry exists so we can update pricing and price change, if not create new entry for cloud ninjas
        if (existingWebsite) {
          // if scraped price is not equal to current price stored in DB, add to price history with Date
          // and add old price as the current price before scrape and add new scraped price as current price
          if (existingWebsite.currPrice !== priceInFloat) {
            existingWebsite.priceHistory.push({
              price: existingWebsite.currPrice,
              timestamp: new Date(),
            });
            existingWebsite.oldPrice = existingWebsite.currPrice;
            existingWebsite.currPrice = priceInFloat;
            await gpu.save();
          }

          if (existingWebsite.websiteLink === "N/A") {
            existingWebsite.websiteLink = link;
          }

          console.log(
            `[UPDATED PRICING] ${gpu.brand} - ${gpu.model} -> Price: ${priceInFloat}`,
          );
        } else {
          gpu.gpuInfo.push({
            website: "Cloud Ninjas",
            currPrice: priceInFloat,
            oldPrice: priceInFloat,
            priceHistory: [],
            websiteLink: link,
          });

          console.log(
            `[UPDATED ENTRY] ${gpu.brand} - ${gpu.model} -> Price: ${priceInFloat}`,
          );

          await gpu.save();
        }
      } else {
        gpu = new GPU({
          brand: brand,
          gpuBrand: brand,
          model: model,
          slug: slug,
          gpuInfo: [
            {
              website: "Cloud Ninjas",
              currPrice: priceInFloat,
              oldPrice: priceInFloat,
              priceHistory: [],
              websiteLink: link,
            },
          ],
        });

        await gpu.save();

        console.log(
          `[SAVED] ${gpu.brand} ${gpu.model} | Slug: ${gpu.slug} | current price: ${priceInFloat} | old price: ${priceInFloat} | link: ${link}`,
        );
      }
    } catch (err) {
      console.error(`[ERROR] GPU ${brand} ${model} not updated: `, err);
    }
  }
}

export function extractGpuName(gpuName) {
  const nvidiaMatch = gpuName.match(/(NVIDIA\s+)(.+)/i);
  if (nvidiaMatch) {
    return { brand: "NVIDIA", model: nvidiaMatch[2].trim() };
  }

  const brandPatterns = [
    { regex: /(AMD\s+)?(Radeon\s+)?(RX\s+[^,]+)/i, brand: "AMD" },
    { regex: /(Intel\s+)?((Arc|A)\s*[^,]+)/i, brand: "Intel" },
  ];

  for (const { regex, brand } of brandPatterns) {
    const match = gpuName.match(regex);
    if (match) {
      const model = match[2].replace(/\s+/g, " ").trim();
      return { brand, model };
    }
  }

  return { brand: null, model: null };
}

export async function findGPUByModel(model, brand) {
  const keyMatch = model.match(/(RTX|RX|Arc)\s*\d{3,4}[A-Z]*|A\d{3,4}[A-Z]*/i);
  if (!keyMatch) return null;

  let key = keyMatch[0].replace(/\s+/g, " ");
  if (brand === "Intel" && !key.startsWith("Arc")) {
    key = `Arc ${key}`;
  }

  return await GPU.findOne({
    brand: { $options: "i", $regex: brand },
    model: { $regex: key, $options: "i" },
  });
}
