import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log10(n);

    addHistory({ Operation: "Logarithm (Base 10)", Operands: [n], Result: result });
    res.json({ result: result });
});

router.post("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log10(n);

    addHistory({ Operation: "Logarithm (Base 10)", Operands: [n], Result: result });
    res.json({ result: result });
});

export default router;
