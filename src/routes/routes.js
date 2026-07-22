/**
 * Main Router
 */
import express from "express";
import excelImportRoutes from "./excelImport.routes.js";
import vtRoutes from "./vt.routes.js";
import voltageRoutes from "./voltage.routes.js";
import currentRoutes from "./current.routes.js";
import bugSpeedRoutes from "./bugSpeed.routes.js";
import bugTorqueRoutes from "./bugTorque.routes.js";
import oilRoutes from "./oil.routes.js";
import vibrationRoutes from "./vibration.routes.js";
import ambientRoutes from "./ambient.routes.js";
import bugSpeedTorqueRoutes from "./bugSpeedTorque.routes.js";
import bugSpeedVibrationRoutes from "./bugSpeedVibration.routes.js";
import bugSpeedAmbientTemperatureRoutes from "./bugSpeedAmbientTemperature.routes.js";
import bugSpeedOilOutTemperatureRoutes from "./bugSpeedOilOutTemperature.routes.js";
import bugTorqueOilOutTemperatureRoutes from "./bugTorqueOilOutTemperature.routes.js";
import bugTorqueVibrationRoutes from "./bugTorqueVibration.routes.js";

import comparisonRoutes from "./comparison.routes.js";
import testAnalyticsRoutes from "./testAnalytics.routes.js";
import mechanicalRoutes from "./mechanical.routes.js";


import overviewRoutes from "./overview.routes.js";
const router = express.Router();
//Excel Import Routing
router.use("/excel-import", excelImportRoutes);
//Single Charts Routing
router.use("/vt", vtRoutes);
router.use("/voltage", voltageRoutes);
router.use("/current", currentRoutes);
router.use("/bug-speed", bugSpeedRoutes);
router.use("/bug-torque", bugTorqueRoutes);
router.use("/oil", oilRoutes);
router.use("/vibration", vibrationRoutes);
router.use("/ambient", ambientRoutes);
//Comparison charts Routing
router.use("/bug-speed-torque", bugSpeedTorqueRoutes);
router.use("/bug-speed-vibration", bugSpeedVibrationRoutes);
router.use("/bug-speed-ambient-temperature", bugSpeedAmbientTemperatureRoutes);
router.use("/bug-speed-oil-out-temperature", bugSpeedOilOutTemperatureRoutes);
router.use("/bug-torque-oil-out-temperature", bugTorqueOilOutTemperatureRoutes);
router.use("/bug-torque-vibration", bugTorqueVibrationRoutes);
router.use("/comparison", comparisonRoutes);
router.use("/overview", overviewRoutes);

router.use("/test-analytics",testAnalyticsRoutes);
router.use("/mechanical", mechanicalRoutes);

export default router;
