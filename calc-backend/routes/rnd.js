import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/", (req, res) => {
    const result = Math.random();
    addHistory({
        Operation: "Rnd",
        Operands: [],
        Result: result,
    });
    res.json({ result: result });
});

export default router;
