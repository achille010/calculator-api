import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  const unit = req.query.unit || 'deg';

  if (isNaN(n)) {
    return res.status(400).json({ Error: "Invalid numbers" });
  }
  const radians = unit === 'rad' ? n : (n * (Math.PI / 180));

  let result = Number(Math.sin(radians).toFixed(2));

  addHistory({ Operation: "Sine", Operands: [n], Result: result, Unit: unit });
  res.json({ result });
});

router.post("/:n", (req, res) => {
  const n = Number(req.params.n);
  const unit = req.query.unit || 'deg';

  if (isNaN(n)) {
    return res.status(400).json({ Error: "Invalid numbers" });
  }
  const radians = unit === 'rad' ? n : (n * (Math.PI / 180));

  let result = Number(Math.sin(radians).toFixed(2));

  addHistory({ Operation: "Sine", Operands: [n], Result: result, Unit: unit });
  res.json({ result });
});

export default router;
