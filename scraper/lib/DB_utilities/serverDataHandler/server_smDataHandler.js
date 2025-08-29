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


        try{

            let { brand, model } = extractTitle(originalTitle);

            console.log(`${brand} - ${model}`);
            
            let chassis = extractChassis(originalChassis);

            console.log(chassis);

            


        }catch(error){

            console.log(`[ERROR] Could Not Save Server to DataBase`)
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
    let finalChassis = '';

    if(words[0] === 'Dell'){
        finalChassis = `${words.splice(3).join(' ')}`;
    }else if(words[0] === 'HPE' || words[0] === 'HP'){
        if(words[4] === 'Plus'){
            finalChassis = `${words.splice(5).join(' ')}`;
        }else{
            finalChassis = `${words.splice(4).join(' ')}`;
        }
    }

    return finalChassis;



}