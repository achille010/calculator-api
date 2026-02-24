import express from "express";
const router = express.Router();
import { addHistory } from "../middleware/history.js";

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  const unit = req.query.unit || 'deg';

  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }

  const radians = unit === 'rad' ? n : n * (Math.PI / 180);
  const result = Number(Math.tan(radians).toFixed(3));

  addHistory({ Operation: "Tangent", Operands: [n], Result: result, Unit: unit });
  res.json({ result });
});

router.post("/:n", (req, res) => {
  const n = Number(req.params.n);
  const unit = req.query.unit || 'deg';

  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }

  const radians = unit === 'rad' ? n : n * (Math.PI / 180);
  const result = Number(Math.tan(radians).toFixed(3));

  addHistory({ Operation: "Tangent", Operands: [n], Result: result, Unit: unit });
  res.json({ result });
});

export default router;
