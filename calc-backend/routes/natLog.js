import epxress from "express";
import { addHistory } from "../middleware/history.js";

const router = epxress.Router;

router.get("/:n", (req, res) => {
    const n = req.params.n;
    if(isNaN(n) || (n <= 1)){
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log(n);

    addHistory({Operation: "Natural Logarithm", Operand: n, Result: result});
    res.json({Result: result});
});

router.post("/:n", (req, res) => {
    const n = req.params.n;
    if(isNaN(n) || (n <= 1)){
        return res.status(400).json({
            error: "Invalid input!"
        });
    }

    const result = Math.log(n);

    addHistory({Operation: "Natural Logarithm", Operand: n, Result: result});
    res.json({Result: result});
})

export default router;