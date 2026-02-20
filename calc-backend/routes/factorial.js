import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

const factorial = (n) => {
  let fact = 1;
  if (n === 0 || n === 1) {
    fact = 1;
  } else {
    for (let i = n; i >= 2; i--) {
      fact *= i;
    }
  }
  return fact;
};

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
    return res.status(400).json({ error: "Not a number, Less than one or not an integer" });
  }
  const result = factorial(n);
  addHistory({ Operation: "Factorial", Operand: n, outcome: result });
  res.json({ result });
});

export default router;
