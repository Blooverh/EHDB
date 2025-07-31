import mongoose from "mongoose";
const defaultVal = "N/A";

// Creating schema that defines the structure of cpu documents within a mongo DB collection
// includes fields, data types, and any constraints

const cpuSchema = new mongoose.Schema({
    brand: {type: String, default: defaultVal , required: true, lowercase: true},
    model: {type: String, default: defaultVal, required: true, unique: true, lowercase: true},
    codename: {type: String, default: defaultVal},
    generation: {type: String, default: defaultVal},
    memorySupport: [{type: String, default: defaultVal}],
    ratedSpeeds: {type: Number, default: 0},
    socket: {type: String, default: defaultVal},
    socketPackage: {type: String, default: defaultVal},
    processSize: {type: String, default: defaultVal},
    coreNum: {type: Number, default: 0},
    threadNum: {type: Number, default: 0},
    frequency: {type: Number, default: 0},
    turboFrequency: {type: Number, default: 0},
    tdp: {type: Number, default: 0},
    memoryBus: {type: String, default: defaultVal},
    partNum: {type: String, default: defaultVal},
    eccMemory: {type: Boolean, default: false},
    cache: {
        cacheL1: {type: String, default: defaultVal},
        cacheL2: {type: String, default: defaultVal},
        cacheL3: {type: String, default: defaultVal},
    },
    pcieGen: {type: String, default: defaultVal},
    info: [{
        website: {type: String},
        currPrice: {type: Number, default: 0},
        oldPrice: {type: Number, default: 0},
        priceChange: {type: Number, default: 0},
        link: {type: String, default: defaultVal}
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

/*
pre-hook function which is middleware that executes before a specific action. 
- For example, argument has 'save' method, meaning this middleware 
will execute before saving a document to the database such as 
`await cpu.save()`

This middleware calculates the percentage change 
between new price and the old price of CPU when scraping.
 - checks if info property has been modfied, and checks 
 if there has been a new price extracted that is different from the current price
then 
*/
cpuSchema.pre('save', function(next) {
    if (this.isModified('info')) {
        this.info.forEach(infoEntry => {
            if (infoEntry.oldPrice && infoEntry.oldPrice > 0 && infoEntry.currPrice !== infoEntry.oldPrice) {
                const change = ((infoEntry.currPrice - infoEntry.oldPrice) / infoEntry.oldPrice) * 100;
                infoEntry.priceChange = parseFloat(change.toFixed(2));
            }
        });
    }
    next();
});

export const CPU = mongoose.model('CPU', cpuSchema);