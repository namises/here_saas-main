import dayjs from "dayjs";
import pMap from "p-map"; // npm install p-map
import DB from "../db/index.js";
import { getMonthsDiff } from "../utils/index.js";

const setMeta = (user, key) => user._leaveMeta.set(key, true);
const getMeta = (user, key) => user._leaveMeta.get(key);

export default async function creditLeaves() {
  console.log("Cron Start: creditLeaves");

  const now = dayjs();
  const unixTime = now.unix();
  const month = now.month();
  const year = now.year();

  const financialYear = month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  const quarter = getQuarter(month);

  try {
    const organizations = await DB.Organization.find().lean();

    await pMap(
      organizations,
      async (org) => {
        const employees = await DB.Employee.find({ organization: org._id }, "name joiningDate leaveBalances _leaveMeta");

        await pMap(employees, (emp) => processEmployee(emp, org, { financialYear, quarter, month, now, unixTime }), { concurrency: 3 });

        console.log(`✅ Processed organization: ${org.name}`);
      },
      { concurrency: 1 }
    );

    console.log("Cron Completed: creditLeaves");
  } catch (err) {
    console.error("❌ creditLeaves failed", err);
  }
}

async function processEmployee(emp, org, context) {
  const { financialYear, quarter, month, unixTime } = context;

  const monthsSinceJoining = getMonthsDiff(emp.joiningDate, unixTime);
  let hasChanges = false;

  for (const policy of org.leavePolicy) {
    if (monthsSinceJoining < policy.applicableAfterMonths) continue;
    if (!emp._leaveMeta) emp._leaveMeta = new Map();
    if (!emp.leaveBalances || !Array.isArray(emp.leaveBalances)) {
      emp.leaveBalances = [];
    }

    const accrualUnit = policy.maxPerYear;
    const creditKey = getCreditKey(policy, financialYear, quarter, month);

    let balance = emp.leaveBalances.find((b) => b.code === policy.code);

    if (!balance) {
      balance = {
        leaveType: policy.leaveType,
        code: policy.code,
        credited: 0,
        used: 0,
        carryForwarded: 0,
      };
    }

    if (!getMeta(emp, creditKey)) {
      const creditAmount = getCreditAmount(policy, accrualUnit, month);
      // console.log(`Crediting ${creditAmount} for policy: ${policy.code}, employee: ${emp.name}, month: ${month + 1}, year: ${financialYear}`);
      balance.credited += creditAmount;
      setMeta(emp, creditKey);
      hasChanges = true;
    }

    // Handle carry forward in March (month === 2)
    if (policy.carryForward && month === 2) {
      const unused = balance.credited - balance.used;
      const carry = Math.min(unused, policy.maxCarryForward ?? unused);
      balance.carryForwarded = carry;
      hasChanges = true;
    }

    // Handle encashment in March
    if (policy.encashable && month === 2) {
      const unused = balance.credited - balance.used;
      const encashableAmount = Math.min(unused, policy.maxEncashable ?? 0);
      // TODO: Implement encashment processing
    }
    const index = emp.leaveBalances.findIndex((b) => b.code === policy.code);
    if (index === -1) {
      emp.leaveBalances.push(balance);
    } else {
      emp.leaveBalances[index] = balance; // overwrite to be safe
    }
  }

  if (hasChanges) {
    await emp.save();
  }
}

function getQuarter(month) {
  if ([3, 4, 5].includes(month)) return "Q1";
  if ([6, 7, 8].includes(month)) return "Q2";
  if ([9, 10, 11].includes(month)) return "Q3";
  return "Q4";
}

function getCreditKey(policy, fy, quarter, month) {
  switch (policy.accrualFrequency) {
    case "monthly":
      return `${fy}-${quarter}-${month}-${policy.code}`;
    case "quarterly":
      return `${fy}-${quarter}-${policy.code}`;
    case "annually":
      return `${fy}-annual-${policy.code}`;
    default:
      return `${fy}-unknown-${policy.code}`;
  }
}

function getCreditAmount(policy, accrualUnit, currentMonth) {
  let value = 0;

  switch (policy.accrualFrequency) {
    case "monthly":
      value = accrualUnit / 12;
      // console.log({ currentMonth, freq: policy.accrualFrequency, accrualUnit, value });
      return value;

    case "quarterly":
      if ([2, 5, 8, 11].includes(currentMonth)) {
        value = accrualUnit / 4;
        // console.log({ currentMonth, freq: policy.accrualFrequency, accrualUnit, value });
        return value;
      }
    case "annually":
      if (currentMonth === 3) {
        value = accrualUnit;
        // console.log({ currentMonth, freq: policy.accrualFrequency, accrualUnit, value });
        return value;
      }
  }
  return value;
}
