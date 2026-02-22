import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
  const n = Number(req.params.n);
  if (isNaN(n)) {
    return res.status(400).json({
      Error: "Invalid input!",
    });
  }

  const radians = n * (Math.PI / 180);
  const result = Number(Math.cos(radians).toFixed(3));

  addHistory({ Operation: "Cosine", Operands: [n], Result: result });
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
  const result = Number(Math.cos(radians).toFixed(2));

  addHistory({ Operation: "Cosine", Operands: [n], Result: result });
  res.json({ result });
});

export default router;
