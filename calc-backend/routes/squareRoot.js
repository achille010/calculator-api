import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n)) {
    return res.status(400).json({
      error: "Invalid input!",
    });
  }
  const result = Math.sqrt(n);

  addHistory({ Operation: "SquareRoot", Operands: [n], Result: result });
  res.json({ result });
});

router.post("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n)) {
    return res.status(400).json({
      error: "Invalid input!",
    });
  }
  const result = Math.sqrt(n);

  addHistory({ Operation: "SquareRoot", Operands: [n], Result: result });
  res.json({ result });
});

export default router;