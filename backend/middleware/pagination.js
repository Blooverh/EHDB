export default function pagination(defaultLimit = 20) {
  return (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || defaultLimit);

    req.pagination = {
      page,
      limit,
      skip: (page - 1) * limit,
    };

    next();
  };
}
