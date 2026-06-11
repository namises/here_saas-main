import cron from "node-cron";
import creditLeaves from "./creditLeaves.js";
import generateMonthlyPayroll from "./generateMonthlyPayroll.js";
console.log("🕐 Crons are up");

cron.schedule("0 0 1 * *", creditLeaves);
cron.schedule("0 0 1 * *", generateMonthlyPayroll);
