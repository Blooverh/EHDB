const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoString = process.env.MONGO_URI;

async function main() {
    
    //Connecting to Mongo Database
    try{
        if(!mongoString){
            console.error('No MongoDB string to connect to DB');
            process.exit(1);
        }else{
            await mongoose.connect(mongoString);
            console.log('Connected to MongoDB');
        }
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

main();