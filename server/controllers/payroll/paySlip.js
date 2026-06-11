import Joi from "joi";
import { handleError } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";

import { generateSalarySlip } from "../../utils/docGenerator/docGenerator.js";

async function handler(req, res) {
  try {
    const { employee: selfEmployeeId, matchedPermissions, organization } = req.user;
    const { payrollId } = req.queryParams;

    const canReadAll = matchedPermissions.includes(permissions.payroll.read);
    const canReadOwn = matchedPermissions.includes(permissions.payroll.readOwn);

    if (!canReadAll && !canReadOwn) throw new Error(errorStrings.notPermitted);

    const rawFilter = {
      organization,
      _id: payrollId,
    };
    const payroll = await DB.Payroll.findOne(rawFilter)
      .populate({ path: "organization", select: "name address email phone logo" })
      .populate({
        path: "employee",
        select: "name empCode designation bankAccount ifsc",
        populate: {
          path: "department",
          select: "name",
        },
      });
    if (!payroll) throw new Error("Payroll not found");
    let toGenerate = null;

    if (canReadAll) {
      toGenerate = payroll;
    } else if (canReadOwn && payroll.employee === selfEmployeeId) {
      toGenerate = payroll;
    }

    if (!toGenerate) throw new Error(errorStrings.notPermitted);

    return generateSalarySlip(
      res,
      {
        organization: {
          name: payroll.organization?.name ?? "",
          address: payroll.organization?.address ?? "",
          email: payroll.organization?.email ?? "",
          phone: payroll.organization?.phone ?? "",
          logo: payroll.organization?.logo ?? "",
        },
        employee: {
          name: payroll.employee?.name ?? "",
          code: payroll.employee?.empCode ?? "",
          designation: payroll.employee?.designation ?? "",
          department: payroll.employee?.department?.name ?? "",
          bankAccount: payroll.employee?.bankAccount ?? "",
          ifsc: payroll.employee?.ifsc ?? "",
        },
        salaryMonth: `${payroll.month} ${payroll.financialYear.split("-")[0]}`,
        earnings: payroll.components.filter((c) => c.type === "earnings").map(({ name, amount }) => ({ name, amount })),
        deductions: payroll.components.filter((c) => c.type === "deductions").map(({ name, amount }) => ({ name, amount })),
        totalEarnings: payroll.components.filter((c) => c.type === "earnings").reduce((sum, comp) => sum + comp.amount, 0),
        totalDeductions: payroll.components.filter((c) => c.type === "deductions").reduce((sum, comp) => sum + comp.amount, 0),
        netPay: payroll.netSalary,
      },
      payrollId
    );
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  payrollId: objectIdValidator.required(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
