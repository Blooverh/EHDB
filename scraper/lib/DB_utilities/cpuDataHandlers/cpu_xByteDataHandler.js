import { CPU } from '../../../models/cpu.js';
import slugify from 'slugify';

export default async function xByteAddCPU(titleArr, priceArr){

    // check if both argument arrays have the same length
    // if not same length console error and terminate process
    if(titleArr.length !== priceArr.length){
        console.error('Both Title and Price array do not have same length');
        process.exit(1); // end process due to error
    }

    for(let i=0; i< titleArr.length; i++){
        let originalTitle = titleArr[i];

        // parse price to a float as it is a string originally
        let priceInFloat = parseFloat(priceArr[i].replace(/[^0-9.]/g, '')) || 0;

        // extract brand and model from title
        const { brand, model } = extractTitle(originalTitle);
        
        // create a slug 
        const slug = slugify(model, {
            replacement: '-',
            lower: true,
            strict: true
        });
        
        try{

            let cpu = await CPU.findOne({ model: model });


            // if cpu does not exists, skip to next step
            if(!cpu) {
                console.log(`⚠️ CPU not found: ${brand} ${model}, skipping...`);
                continue;
            }

            console.log(`✅ Brand: ${cpu.brand}, Model: ${cpu.model}, xByte Price: ${priceInFloat}`);

            // let existsBrand  = cpu.info.find(entry => entry.website === 'xByte');

            // if(existsBrand){
            //     if(existsBrand.currPrice !== priceInFloat ){
            //         existsBrand.oldPrice = currPrice;
            //         currPrice = priceInFloat;
            //     }
            // }else{
            //     cpu.info.push({ website: 'xByte', currPrice: price, oldPrice: price});
            // }

            // await cpu.save();

            // await new Promise(resolve => setTimeout(resolve, 500));



        }catch(err){
            console.error(`Error updating CPU ${brand} ${model}: `, err);
            process.exit(1);
        }
    }

    process.exit(0);

}

// function to extract the titles from xbyte scraping

export function extractTitle(title){

    let trimmedName = title.trim(); // remove white spaces 
    let words = trimmedName.split(' '); // split title into array of words
    let brand = ""; // variable to hold brand name 
    let model = ""; // variable to hold model name after custom extraction of model in words array
    // Conditional to only add brand as Intel or AMD based on title first word
    if(words[0] === 'Intel'){
        brand = words[0];
    }else if (words[0] === 'AMD'){
        brand = words[0];
    }

    /* 
        - within xByte titles we assume word after EPYC is the model number EPYC 9124
        - for Intel (Intel Gold 6122) we check if words[1] is type of model and words[2] is number of model
        -    
        This is not fully accurate as there might be AMD threadrippers or other type cpu models
    */

    if(words[1] == 'EPYC'){
        
        model = words[1] + " " + words[2]; 

    }else if (words[1] == 'Gold' || words[1] == 'Silver' || words[1] == 'Platinum'){
        model = 'Xeon ' + words[1] + " " + words[2];
    }else if (words[1].charAt(0) === 'E'){
        let versionSeparation = words[1].replace(/(v\d+)$/, ' $1');
        model = 'Xeon ' + versionSeparation;
    }

    brand.charAt(0).toUpperCase();

    // console.log(brand + " " + model);

    return { brand, model };

}