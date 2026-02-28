import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || n === 0) {
        return res.status(400).json({
            error: "Invalid input!",
        });
    }
    const result = 1 / n;

    addHistory({ Operation: "Inverse", Operands: [n], Result: result });
    res.json({ result });
});

router.post("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || n === 0) {
        return res.status(400).json({
            error: "Invalid input!",
        });
    }
    const result = 1 / n;

    addHistory({ Operation: "Inverse", Operands: [n], Result: result });
    res.json({ result });
});

export default router;
