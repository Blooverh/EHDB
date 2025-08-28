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

            let { brand, title } = extractTitle(originalTitle);
            
            let chassis = extractChassis(originalChassis);

            


        }catch(error){

            console.log(`[ERROR] Could Not Save Server to DataBase`)
        }
            
    }

}

// function to extract brand, model from title
function extractTitle(title){

}

// function to manipulate chassis strings and extract the correct chassis 

function extractChassis(chassis){

}