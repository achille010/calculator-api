import express from "express";
import { getHistory, clearHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getHistory());
});

router.delete("/", (req, res) => {
  clearHistory();
  res.status(204).end();
});

export default router;
