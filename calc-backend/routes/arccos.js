import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || n < -1 || n > 1) {
        return res.status(400).json({
            error: "Invalid input!",
        });
    }
    let result = Math.acos(n);
    let unit = req.query.unit;
    if (unit === "deg") {
        result = result * (180 / Math.PI);
    }
    addHistory({
        Operation: "arccos",
        Operands: [n],
        Result: result,
        Unit: unit || "rad",
    });
    res.json({ result: result });
});

export default router;
