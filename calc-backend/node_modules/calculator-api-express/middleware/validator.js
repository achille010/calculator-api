export const validateNums = (req, res, next) => {
  let a = req.query.a ?? req.body.a;
  let b = req.query.b ?? req.body.b;

  a = Number(a);
  b = Number(b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: "Invalid Numbers" });
  }

  req.numbers = { a, b };
  next();
};
