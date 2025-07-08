// import { CPU } from '../../../../backend/models/cpu.js';
import { CPU } from '../../../models/cpu.js';
import slugify from 'slugify';
/* 
Objective of this module

 - A dedicated function that will receive the titles and prices
 that were extracted from scraping a collection of cpus for Cloud Ninjas
    - will check if it exists on DB 
    - Will extract and tailor the titles extracted to contain only Brand and model in title for DB 

 - A dedidcated function that will receive an object containing information 
 about a single cpu from a single CPU page 

 - Might add 2 extra functions for bulk adding based on JSON or CSV files - FUTURE FEATURE
*/

// Function that receives arrays of titles and prices from extracted data object 
export default async function cnAddCPU(titleArr, priceArr){

    // Check if both title array and price array have the same length 
    // so they can be mapped together 
    if(titleArr.length !== priceArr.length){
        console.error('Array of titles and array of prices do not have same length; thus cannot be added to DB');
        // Using process.exit(1) so we let main file know there was a failure
        process.exit(1);
    }

    for(let i =0; i < titleArr.length; i++){
        let originalName = titleArr[i];
        // since price is scraped in a string format, we have to parse to a float number 
        // as price properties in database are of number type
        let priceInFloat = parseFloat(priceArr[i].replace(/[^0-9.]/g, '')) || 0;

        const { brand, model } = extractCpuName(originalName);

        const slug = slugify(model, {
            replacement: '-',
            lower: true,
            strict: true
        });
        // console.log(`Slug for ${brand} - ${model} is ${slug} - Price ${priceInFloat}`);

        // Add cpus, or update cpus to database
        try{
            // fech CPU from DB
            let cpu = await CPU.findOne({ model: model });

            // If CPU exists, update pricing properties to DB
            if(cpu){    
                // check if CPU has a property info.website for Cloud Ninjas
                let existingWebsite = cpu.info.find(website => website.website === 'Cloud Ninjas');

                console.log(`Does website Cloud Ninjas exist in DB: ${existingWebsite}`);
                // if website exists grab current price
                // if different from price in DB update currPrice to new scraped price
                // price on DB will go to oldPrice
                // if website does not exists, push object to array cpu.info with website, current price and old price
                if(existingWebsite){
                    if(existingWebsite.currPrice !== priceInFloat){
                        existingWebsite.oldPrice = existingWebsite.currPrice;
                        existingWebsite.currPrice = priceInFloat;
                    }
                }else{
                    cpu.info.push({website: 'Cloud Ninjas ', currPrice: priceInFloat, oldPrice: priceInFloat });
                }

                // save CPU with updated info 
                // !!!! THERE MIGHT BE A BETTER OR MORE CORRECT WAY TO DO THIS 
                await cpu.save();

            }else {

                cpu = new CPU({
                    brand: brand,
                    model: model, 
                    slug: slug,
                    info: [{
                        website: 'Cloud Ninjas',
                        currPrice: priceInFloat,
                        oldPrice: priceInFloat
                    }]
                });

                await cpu.save();
                
                console.log(`Saved new CPU: ${cpu.brand} ${cpu.model} | Slug: ${cpu.slug} | current price: ${cpu.info[0].currPrice} | old price: ${cpu.info[0].oldPrice}`);
            }

            // for each cpu give 5ms to return data extracted with a promise,
            // if rejected throw promise reject as it was not saved to DB 
            await new Promise(resolve => setTimeout(resolve, 800)); 

        }catch(err){
            console.error(`Error updating CPU ${brand} ${model}:`, err);
            process.exit(1);
        }
    }
}

// Function to extract cpu Name correctly within the Cloud Ninjas website 

function extractCpuName(name){
    let trimmedName = name.trim(); // remove whitespaces in front and back if exist

    // Normalize common dash characters (en dash, em dash) to a standard hyphen-minus
    let normalizedName = trimmedName.replace(/[–—]/g, '-');

    // Extract the brand (first word)
    let brand = normalizedName.split(' ')[0];

    // Start with everything after the brand as the potential model
    let model = normalizedName.substring(brand.length).trim();

    // Try to find the first occurrence of " - " (space-hyphen-space)
    let separationIndex = model.indexOf(" - ");

    if (separationIndex !== -1) {
        // If found, take only the part before this separator
        model = model.substring(0, separationIndex).trim();
    } else {
        // If " - " not found, try to find just "-" (hyphen) as a secondary separator
        separationIndex = model.indexOf("-");
        if (separationIndex !== -1) {
            // If found, take only the part before this separator
            model = model.substring(0, separationIndex).trim();
        }
    }

    // console.log(`${brand} - ${ model }`);
    return { brand, model };
}