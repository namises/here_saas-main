import cron from "node-cron";
import creditLeaves from "./creditLeaves.js";
console.log("🕐 Crons are up");

cron.schedule("0 0 1 * *", creditLeaves);
// Monthly payroll is NO LONGER auto-generated for all employees. Admins run payroll per-employee,
// on demand, via POST /v1/payroll/generate (see controllers/payroll/generate.js).
