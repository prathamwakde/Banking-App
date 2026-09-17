// Small field checker so controllers stay readable.
// Usage: router.post("/", requireFields("amount", "account"), handler)
export const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((f) => {
    const v = req.body[f];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (missing.length) {
    return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
  }
  next();
};

export const isPositiveNumber = (field) => (req, res, next) => {
  const value = Number(req.body[field]);
  if (!Number.isFinite(value) || value <= 0) {
    return res.status(400).json({ message: `${field} must be a number above zero` });
  }
  req.body[field] = value;
  next();
};
