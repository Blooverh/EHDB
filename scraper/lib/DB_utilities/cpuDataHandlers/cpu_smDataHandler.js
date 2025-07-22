import { CPU } from "../../../models/cpu.js";


export default async function smAddCPU(titleArr, priceArr, linkArr){

    //Check if all 3 arrays have the same length 
    if(titleArr.length !== priceArr.length || priceArr.length !== linkArr.length ){
        throw new Error('Arrays do not have same length hence data cannot be added to Database')
    }

    for(let i =0; i < titleArr.length; i++){

        const {brand, model} = extractTitle(titleArr[i]);

        const price = parseFloat(priceArr[i].replace(/[^0-9.]/g, '')) || 0;
        const link = linkArr[i];

        // console.log(`${brand} ${model} - Price: ${price} - Link: ${link}`);

        try {

            const cpu = await CPU.findOne({ brand: brand, model: model });

            // check if cpu exists in database, if not continue to next iteration
            if(!cpu) {
                console.log(`[SKIPPING] ${brand} - ${model}`);
                continue;
            }

            // check if website entry exists in database, so we know to update entry's price or create new entry
            let existsWebsite = cpu.info.find(entry => entry.website === 'Server Monkey');

            if(existsWebsite){

                if(existsWebsite.currPrice !== price){
                    existsWebsite.oldPrice = existsWebsite.currPrice;
                    existsWebsite.currPrice = price
                }

                console.log(`[UPDATED PRICING] ${cpu.brand} ${cpu.model} -> Price: ${price}`);

            }else {
                cpu.info.push({website: 'Server Monkey', currPrice: price, oldPrice: price, link: link });
                console.log(`[SAVED ENTRY] ${cpu.brand} ${cpu.model} -> Price: ${price} link: ${link}`);
            }

            await cpu.save();

        }catch(err){
            // we finish process as if there is an error we do not want to save data to the database yet
            console.error(`[ERROR] CPU data could not be saved: ` + err);
            process.exit(1);
        }

    }


}

export function extractTitle(title){

    let trimmedTitle = title.trim();
    let words = trimmedTitle.split(' ');

    // find brand in array of words 
    let brand = words.find(word => word === 'AMD' || word === 'Intel');

    // if brand does not exist in title assign 'unknown'
    // this should not happen, however if it happens it is ignored as we only do a check on exitance of cpu for this function
    if(!brand){
        return {brand: 'Unknown', model: 'unknown'};
    }

    // find index of brand name in array
    let brandIndex = words.indexOf(brand);
    // find index of processor as in Server monkey it is the first words to ignore when building model
    let processorIndex = words.indexOf("Processor");

    // ternary operator that checks if processorIndex (word 'processor') exists in array words
    // if it does not exist by default it return -1
    // if exists (returns true) returns new array that starts on index after brand and ends on first index of processorIndex exclusive
    // if does not exist (returns false) returns new array that starts on index after brand and ends at the end of the array
    let modelWords = processorIndex !== -1 ? words.slice(brandIndex + 1, processorIndex) : words.slice(brandIndex + 1);

    // to check for Xeon E..-xxxx series
    // .test() executes a search for a match betwen a regex the modelWords[1] string value
    if (modelWords[0] === "Xeon" && /^E\d/.test(modelWords[1])) {
        let modelParts = modelWords[1].match(/(E\d+-\d+)([A-Za-z0-9]*)/); // creates a new array based on matched groups from modelwords[1]
        // like ['E3-1270v6', 'E3-1270', 'v6'] for modelParts[0], modelParts[1] and modelParts[2]

        // if model parts is not null
        if (modelParts) {
            modelWords[1] = modelParts[1]; // E3-1230 - we add to second index the the first index of modelParts [1]
            if (modelParts[2]) { // if it does not return null we add it to 3rd index of 
                //splice(2, 0, ...) means: at index 2, remove 0 elements, and insert the new item
                //(modelParts[2]).
                modelWords.splice(2, 0, modelParts[2]); // Insert separated version part (e.g., "v6")
            }   
        }
    }

    // return brand and return model a a string built from modelWords array
    return {
        brand, model: modelWords.join(' ')
    };

}