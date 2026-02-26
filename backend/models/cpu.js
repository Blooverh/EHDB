import mongoose from "mongoose";
const defaultVal = "N/A";
const defaultIMG = "https://ik.imagekit.io/blooverh/EHDB/div.bg-muted.png";

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
    featureImg: {type: String, default: defaultIMG},
    pcieGen: {type: String, default: defaultVal},
    info: [{
        website: {type: String},
        currPrice: {type: Number, default: 0},
        oldPrice: {type: Number, default: 0},
        priceChange: {type: Number, default: 0},
        link: {type: String, default: defaultVal}, 
        priceHistory: [{
            oldPrice: {type: Number}, 
            timestamp: {type: Date, defautl: Date.now}
        }]
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

/* 
    .index() - used for indexing in a pre-sorted list the follow properties of cpus for fast search like indexing a book by indexing each cpu document based on
    brand, model, codename, generation, etc... (can add more indexing properties if possible)
    by indexing to 'text' allows handling of word variations like pluralism, ignores filler words like 'a', 'the', 'in' etc...
    Helps pre-organizing our database documents (objects) based on text matching for fast look up
*/

cpuSchema.index({ brand: 'text', model: 'text', codename: 'text', generation: 'text' }); 

export const CPU = mongoose.model('CPU', cpuSchema);