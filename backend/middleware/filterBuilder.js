export default function filterBuilder({
  filterableFields = [],
  numericFields = [],
  exactMatchFields = [], // This fields have to be exactly matched such as number based filters, or brand string etc.. 
}) {
  return (req, res, next) => {
    const filter = {};

    filterableFields.forEach((field) => {
      const queryParam = req.query[field];
      if (!queryParam) return;

      if (numericFields.includes(field)) {
        const values = Array.isArray(queryParam)
          ? queryParam
          : String(queryParam).split(",");
        const numericValues = values
          .map((val) => parseInt(val, 10))
          .filter((num) => !isNaN(num));

        if (numericValues.length > 1) {
          filter[field] = { $in: numericValues };
        } else if (numericValues.length === 1) {
          filter[field] = numericValues[0];
        }
      } else {
        const values = Array.isArray(queryParam)
          ? queryParam
          : String(queryParam).split(",");

        if (values.length > 1) {
          if (exactMatchFields.includes(field)) {
            filter[field] = { $in: values };
          } else {
            const regexArray = values.map(
              (val) =>
                new RegExp(
                  `^${val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                  "i",
                ),
            );
            filter[field] = { $in: regexArray };
          }
        } else if (values.length === 1 && values[0]) {
          const escapedValue = values[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          filter[field] = { $regex: `^${escapedValue}$`, $options: "i" };
        }
      }
    });

    req.filter = filter;
    next();
  };
}
