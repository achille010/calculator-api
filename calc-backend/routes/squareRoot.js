import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
  const n = req.params.n;
  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }
  const result = Math.sqrt(n);

  addHistory({ Operation: "SquareRoot", Operand: n, Result: result });
  res.json({ Result: result });
});

router.post("/", (req, res) => {
  const n = req.params.n;
  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }
  const result = Math.sqrt(n);

  addHistory({ Operation: "SquareRoot", Operand: n, Result: result });
  res.json({ Result : result });
});

export default router;