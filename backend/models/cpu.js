const mongoose = require('mongoose');

const defaultVal = "N/A";

// Creating schema that defines the structure of cpu documents within a mongo DB collection
// includes fields, data types, and any constraints
const cpuSchema = new mongoose.Schema({
    brand: {type: String, default: defaultVal , required: true, lowercase: true},
    model: {type: String, default: defaultVal, required: true, unique: true, lowercase: true},
    codename: {type: String, default: defaultVal},
    generation: {type: String, default: defaultVal},
    memorySupport: {type: String, default: defaultVal},
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
    mpn: {type: String, default: defaultVal},
    pcieGen: {type: String, default: defaultVal},
    info: [{
        website: {type: String},
        currPrice: {type: Number, default: 0}, 
        oldPrice: {type: Number, default: 0},
        priceChange: {type: Number, default: 0}, 
        link: {type: URL, default: defaultVal}
    }],
    slug: {
        type: String, 
        required: true,
        unique: true
    }
});

//Mongoose pre-save hook to calculate the percentage value based on current and old price
/* .pre('method', [...options])  - defines a pre hook for the model

*/

cpuSchema.pre('save', function(next) {
    // `this` refers to document in question being saved
    // we only calculate percentage if currPrice has been changed
    // isModified() - Returns boolean value 
    if(this.isModified('info.currPrice') && this.info.oldPrice){
        if(this.info.oldPrice > 0) {
            const change = ((this.info.currPrice - this.info.oldPrice) / this.info.oldPrice) * 100;
            this.info.priceChange = parseFloat(change.toFixed(2));
        }
    }

    next();
});


const CPU = mongoose.model('CPU', cpuSchema);

module.exports = CPU;