import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { numbers } = req.body;

  if (
    !Array.isArray(numbers) ||
    numbers.some((n) => typeof n !== "number") ||
    numbers.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Not array, empty array or contains non-numbers" });
  }
  const result = numbers.reduce((sum, n) => sum + n, 0);
  addHistory({
    Operation: "Array addition",
    Operands: [...numbers],
    Outcome: result,
  });
  res.json({ result });
});

export default router;
