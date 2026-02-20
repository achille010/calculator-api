import express from "express";
import { getHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getHistory());
});

export default router;
