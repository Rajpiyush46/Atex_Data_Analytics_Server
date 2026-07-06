/**
 * @file server.js
 *
 * Application Entry Point
 */

import dotenv from "dotenv";
import app from "./app.js";

import { connectDatabase } from "./src/config/database.js";
import { initializeDatabase } from "./db/index.js";

dotenv.config();

/**
 * Start Application
 */
async function startServer() {
  try {
    await connectDatabase();
    await initializeDatabase();

    app.listen(process.env.PORT, () => {
      console.log(` Server Running On Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(" Application Startup Failed");
    console.error(error);
  }
}
startServer();
