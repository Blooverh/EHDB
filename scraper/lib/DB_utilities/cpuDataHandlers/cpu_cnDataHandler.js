import { CPU } from '../../../../backend/models/cpu.js';

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
        let price = priceArr[i];

        const { brand, model } = extractCpuName(originalName);
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

    console.log(`${brand} - ${ model }`);
    return { brand, model };
}