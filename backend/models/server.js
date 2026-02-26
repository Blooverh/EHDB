import mongoose from "mongoose";
const defVal = 'N/A';
const defaultIMG = "https://ik.imagekit.io/blooverh/EHDB/div.bg-muted.png";

const serverSchema = new mongoose.Schema({
    brand: {type: String, default: defVal},
    model: {type: String, default: defVal},
    chassisInfo: [{
        website: {type: String, default: defVal}, 
        currPrice: {type: Number, default: 0},
        oldPrice: {type: Number, default: 0},
        chassis: {type: String, default: defVal},
        priceChange: {type: Number, default: 0},
        websiteLink: {type: String, default: defVal}, 
        priceHistory: [{
            oldPrice: {type: Number}, 
            timestamp: {type: Date, defautl: Date.now}
        }]
    }],
    socketInfo: {type: String, default: defVal},
    compatibleCpuGen: [{type: String, default: defVal}],
    motherboardType: {type: String, default: defVal},
    memorySpecs: {
        memory_type: [{type: String, default: defVal}],
        speeds: [{type: Number, default: 0}],
        max_configs:[{type: String, default: defVal}] 
    },
    ssdInterfaces: [{type: String, default: defVal}],
    expansionSlots: [{type: String, default: defVal}],
    compatibleRaids: [{type: String, default: defVal}],
    compatibleOs: [{type: String, default: defVal}],
    compatibleNics: [{type: String, default: defVal}],
    nicInterfaces: [{type: String, default: defVal}],
    compatiblePSU: [{type: String, default: defVal}],
    serverType: {type: String, default: defVal},
    userManual: {type: String, default: defVal},
    techSpecs: {type: String, default: defVal},
    sysManagement: [{type: String, default: defVal}],
    featureImg: {type: String, default: defaultIMG},
    slug: {type: String, default: defVal},

});

/* 
    .index() - used for indexing in a pre-sorted list the follow properties of cpus for fast search like indexing a book by indexing each cpu document based on
    brand, model, codename, generation, etc... (can add more indexing properties if possible)
    by indexing to 'text' allows handling of word variations like pluralism, ignores filler words like 'a', 'the', 'in' etc...
    Helps pre-organizing our database documents (objects) based on text matching for fast look up
*/

serverSchema.index({ brand: 'text', model: 'text', socketInfo: 'text', compatibleCpuGen: 'text' }); // indexing different properties of CPU for searching 

export const Server = mongoose.model('Server', serverSchema);