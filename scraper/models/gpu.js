import mongoose from "mongoose";
const defaultVal = "N/A";
const defaultNum = 0;
const defaultIMG = "https://ik.imagekit.io/blooverh/EHDB/div.bg-muted.png";

const gpuSchema = new mongoose.Schema({
  brand: { type: String, default: defaultVal, required: true }, // PNY, MSI, NVIDIA, ETC...
  gpuBrand: { type: String, default: defaultVal, required: true }, // NVIDIA, AMD, Intel etc...
  model: { type: String, default: defaultVal, required: true },
  vram: { type: Number, default: defaultNum }, // In GB
  vramType: { type: String, default: defaultVal }, // GDDR6, HBM3 etc...
  coreClock: { type: Number, default: defaultNum }, // in MHz
  boostClock: { type: Number, default: defaultNum }, // in MHz
  power: { type: Number, default: defaultNum }, // in Watts
  powerConnectors: { type: String, default: defaultVal },
  cardDimensions: { type: String, default: defaultVal },
  pcieInterface: { type: String, default: defaultVal },
  coolingType: { type: String, default: defaultVal },
  videoOutputs: { type: [String], default: [defaultVal] }, // will be an array of possible outputs
  cudaCores: { type: Number, default: defaultNum },
  tensorCores: { type: Number, default: defaultNum },
  RayTracingCores: { type: Number, default: defaultNum },
  memoryBandwidth: { type: Number, default: defaultNum },
  gpuImage: { type: String, default: defaultIMG },
  slotWidth: { type: String, default: defaultVal },
  brandMPN: { type: String, default: defaultVal },
  gpuBrandMPN: { type: String, default: defaultVal },
  gpuWorkload: { type: String, default: defaultVal }, // Enterprise Consumer
  gpuTags: [{ type: [String], default: [defaultVal] }], // Tags for the GPU in array format ['Inference', 'Gaming', etc...]
  gpuInfo: [
    {
      website: { type: String, default: defaultVal },
      currPrice: { type: "Double", default: defaultNum },
      oldPrice: { type: "Double", default: defaultNum },
      priceChange: { type: "Double", default: defaultNum },
      websiteLink: { type: String, default: defaultVal },
      priceHistory: [
        {
          price: { type: "Double" },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  slug: { type: String, default: defaultVal },
});

// DB middleware to control percentage change on pricing
gpuSchema.pre("save", function (next) {
  if (this.isModified("gpuInfo")) {
    this.gpuInfo.forEach((infoEntry) => {
      if (
        infoEntry.oldPrice &&
        infoEntry.oldPrice > 0 &&
        infoEntry.currPrice !== infoEntry.oldPrice
      ) {
        const change =
          ((infoEntry.currPrice - infoEntry.oldPrice) / infoEntry.oldPrice) *
          100;
        infoEntry.priceChange = parseFloat(change.toFixed(2));
      }
    });
  }
  next();
});

export const GPU = mongoose.model("GPU", gpuSchema);
