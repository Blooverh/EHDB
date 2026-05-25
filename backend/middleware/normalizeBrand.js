const brandMap = {
  dell: "Dell",
  hpe: "HPE",
  supermicro: "Supermicro",
  "cloud-ninjas": "Cloud Ninjas",
  gigabyte: "Gigabyte",
  asus: "ASUS",
  tyan: "Tyan",
};

export default function normalizeBrand(req, res, next) {
  if (!req.params.brand) return next();

  const key = req.params.brand.toLowerCase().replace(/\s+/g, "-");
  req.normalizedBrand = brandMap[key] || null;
  next();
}
