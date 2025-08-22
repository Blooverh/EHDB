import mongoose from "mongoose";
const defVal = 'N/A';

const serverSchema = new mongoose.Schema({
    brand: {type: String, default: defVal},
    model: {type: String, default: defVal},
    chassisInfo: [{
        website: {type: String, default: defVal}, 
        currPrice: {type: Number, default: 0},
        oldPrice: {type: Number, default: 0},
        chassis: {type: String, default: defVal},
        priceChange: {type: Number, default: 0},
        websiteLink: {type: String, default: defVal}
    }],
    socketInfo: {type: String, default: defVal},
    compatibleCpuGen: {type: String, default: defVal},
    motherboardType: {type: String, default: defVal},
    memorySpecs: {
        memory_type: [{type: [String], default: [defVal]}],
        speeds: [{type: [Number], default: [0]}],
        max_configs:[{type: [String], default: [defVal]}] 
    },
    ssdInterfaces: [{type: [String], default: [defVal]}],
    expansionSlots: [{type: [String], default: [defVal]}],
    compatibleRaids: [{type: [String], default: [defVal]}],
    compatibleOs: [{type: [String], default: [defVal]}],
    compatibleNics: [{type: [String], default: [defVal]}],
    nicInterfaces: [{type: [String], default: [defVal]}],
    compatiblePSU: [{type: [String], default: [defVal]}],
    releaseDate: {
        type: Date,
        set: (val) => new Date(val)
    },
    userManual: {type: String, default: defVal},
    techSpecs: {type: String, default: defVal},
    sysManagement: [{type: [String], default: [defVal]}],
    slug: {type: String, default: defVal},

});

serverSchema.pre('save', function(next){
    if(this.isModified('chassisInfo')){
        this.chassisInfo.forEach(entry => {
            if(entry.oldPrice && entry.currPrice > 0 && entry.oldPrice !== entry.currPrice){
                const change = ((entry.currPrice - entry.oldPrice)/ entry.oldPrice) * 100;
                entry.priceChange = parseFloat(change.toFixed(2));
            }
        });
    }

    next();
})

// pre save hook for price change percentage functionality

export const Server = mongoose.model('Server', serverSchema);