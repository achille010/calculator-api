import express from "express";
import { addHistory } from "../middleware/history.js";

const router = express.Router();

router.get("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || (n <= 0)) {
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log(n);

    addHistory({ Operation: "Natural Logarithm", Operands: [n], Result: result });
    res.json({ result: result });
});

router.post("/:n", (req, res) => {
    const n = Number(req.params.n);
    if (isNaN(n) || (n <= 0)) {
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log(n);

    addHistory({ Operation: "Natural Logarithm", Operands: [n], Result: result });
    res.json({ result: result });
})

export default router;