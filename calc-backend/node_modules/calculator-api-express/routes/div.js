import express from "express";
import { addHistory } from "../middleware/history.js";
import { validateNums } from "../middleware/validator.js";

const router = express.Router();

router.get("/", validateNums, (req, res) => {
  const { a, b } = req.numbers;
  if (b === 0) return res.json({ error: "The divisor can't be zero" });
  const result = a / b;
  addHistory({ Operation: "Division", Operands: [a, b], Outcome: result });
  res.json({ result });
});

router.post("/", validateNums, (req, res) => {
  const { a, b } = req.numbers;
  if (b === 0) return res.json({ error: "The divisor can't be zero" });
  const result = a / b;
  addHistory({ Operation: "Division", Operands: [a, b], Outcome: result });
  res.json({ result });
});

export default router;
