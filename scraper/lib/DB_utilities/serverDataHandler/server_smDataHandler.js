import { Server } from '../../../models/server.js';
import slugify from 'slugify';


export default async function smAddServer(dataArr){
    // redundant check for if there are servers in array
    if(dataArr.length < 1 ){
        throw new Error('[ERROR] Array does not contain any servers');
    }

    for(const server of dataArr){
        let originalTitle = server.title;
        let originalChassis = server.chassis
        let price = server.price;
        let link = server.link;
        let brand, model;


        try{

            ({ brand, model } = extractTitle(originalTitle));
            // console.log(`${brand} ${model}`);
            let chassis = extractChassis(originalChassis);
            // console.log(chassis);
            let serverDb = await Server.findOne({brand: brand, model: model}); 

            if(serverDb){
                
                let chassisToUpdate = serverDb.chassisInfo.find(info => 
                    info.website === 'Server Monkey' && info.chassis === chassis
                )

                // if entry of website and chassis exists on website, update pricing if there is new pricing
                if(chassisToUpdate){
                    if(chassisToUpdate.currPrice !== price){
                        chassisToUpdate.oldPrice = chassisToUpdate.currPrice;
                        chassisToUpdate.currPrice = price;

                        console.log(`[PRICE UPDATE] Server ${serverDb.brand} ${serverDb.model}, chassis: ${chassisToUpdate.chassis}, NEW PRICE: ${chassisToUpdate.currPrice}`);
                    }
                }else{
                    // add new entry for server in DB if does not exist on database
                    serverDb.chassisInfo.push({website: 'Server Monkey', currPrice: price, oldPrice: price, chassis: chassis, websiteLink: link});

                    console.log(`[NEW CHASSIS ENTRY] ${serverDb.brand} ${serverDb.model} - chassis: ${chassis}, Price: ${price}`);
                }

                await serverDb.save();

            }else{
                console.log(`${brand} ${model} does not exist in database - Adding to database`);
                const newSlug= slugify(model, {
                replacement: '-',
                    lower: true,
                    strict: true
                });

                serverDb = new Server({
                    brand: brand,
                    model: model,
                    chassisInfo: [{
                        website: 'Server Monkey',
                        currPrice: price,
                        oldPrice: price,
                        websiteLink: link,
                        chassis: chassis
                    }],
                    slug: newSlug
                })

                await serverDb.save();

                console.log(`[NEW SERVER SAVED] ${brand} - ${model}`);

            }


        }catch(error){

            console.log(`[SERVER FAILED] Could Not Save ${brand} ${model} - [ERROR] ${error.message}`);
        }
            
    }

}

// function to extract brand, model from title
function extractTitle(title){
    let originalTitle = title.replace('Refurbished' , '').trim();

    let words = originalTitle.split(' ');
    let model = '';
    let brand = words[0];
    
    if(brand === 'Dell' && words[1] === 'PowerEdge'){
        model = `${words[1]} ${words[2]}`;
    }else if((brand === 'HPE' || brand === 'HP') && words[1] === 'ProLiant'){

        if(words[4] === 'Plus'){
            model = `${words[1]} ${words[2]} ${words[3]} ${words[4]}`;
        }else{
            model = `${words[1]} ${words[2]} ${words[3]}`;
        }
    
    }

    return { brand, model };

}

// function to manipulate chassis strings and extract the correct chassis 

function extractChassis(chassis){
    let originalChassis = chassis.replace('Chassis','').replace('Refurbished', '').trim();

    let words = originalChassis.split(' ');
    words = words.filter( item => item != '');

    let finalChassis = '';

    if(words[0] === 'Dell'){
        finalChassis = `${words.splice(3).join(' ').trim()}`;
    }else if(words[0] === 'HPE' || words[0] === 'HP'){
        if(words[4] === 'Plus'){
            finalChassis = `${words.splice(5).join(' ')}`;
        }else{
            finalChassis = `${words.splice(4).join(' ')}`;
        }
    }

    return finalChassis;



}