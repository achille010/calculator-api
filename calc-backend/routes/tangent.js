import express from "express";
const router = express.Router();
import { addHistory } from "../middleware/history.js";

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }

  const radians = n * (Math.PI / 180);
  const result = Number(Math.tan(radians).toFixed(3));

  addHistory({ Operation: Tangent, Operand: n, Result: result });
  res.json({ result });
});

router.post("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }

  const radians = n * (Math.PI / 180);
  const result = Number(Math.tan(radians).toFixed(3));

  addHistory({ Operation: Tangent, Operand: n, Result: result });
  res.json({ result });
});

export default router;
