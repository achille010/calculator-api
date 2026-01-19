import express from "express";
import add from "./routes/add.js";
import subtract from "./routes/subtract.js";
import divide from "./routes/div.js";
import multiply from "./routes/multi.js";
import factorial from "./routes/factorial.js";
import history from "./routes/history.js";
import power from "./routes/power.js";
import summarray from "./routes/summarray.js";
import { logger } from "./middleware/logger.js";
import { controlAccess } from "./middleware/access.js";

export const serverOn = (port = 3000) => {
  const app = express();

  app.use(express.json());
  app.use(logger);

  app.use(controlAccess);
  app.use("/add", add);
  app.use("/subtract", subtract);
  app.use("/divide", divide);
  app.use("/multiply", multiply);
  app.use("/factorial", factorial);
  app.use("/power", power);
  app.use("/sumarray", summarray);
  app.use("/history", history);

  app.get("/", (req, res) => {
    res.send(`
        <div style="background-color: #1e1e1e; 
                padding: 20px; 
                border-radius: 8px; 
                display: inline-block;">
          <code style="color: #4af626; 
                      font-family: 'Courier New', Courier, monospace; 
                      font-size: 1.5rem;">
              > Welcome to our calculator API_
          </code>
        </div>`);
    res.json({
      message: "server running on http://localhost:{specified_port} !",
    });
  });

  app.listen(port, () => {
    console.log(`Calculator API on http://localhost:${port}`);
  });
};
