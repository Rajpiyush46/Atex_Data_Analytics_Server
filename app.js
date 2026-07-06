import express from "express";
import cors from "cors";
import routes from "./src/routes/routes.js";

const app = express();
// need to check  in which file  it shuld be pleaced  >>> Piyush
/**
 * CORS
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", routes);

export default app;
