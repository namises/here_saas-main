import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { objectIdValidator } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";

import { getSubTree } from "../hierarchy/view.js";

async function handler(req, res) {
  try {
    const { matchedPermissions, organization, employee: selfEmployeeId } = req.user;
    const { employee: _id } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.employee.read);
    const canReadOwn = matchedPermissions.includes(permissions.employee.readOwn);

    console.log({ canReadAll, canReadOwn });
    let employee = null;
    if (canReadAll) {
      employee = await DB.Employee.findOne({ organization, _id }).select("-hashedPassword").populate({ path: "shift" }).populate({ path: "department" }).populate({
        path: "manager",
        select: "name email mobile empCode designation",
      });
    } else if (canReadOwn) {
      employee = await DB.Employee.findOne({ organization, _id: selfEmployeeId }).select("-hashedPassword").populate({ path: "shift" }).populate({ path: "department" }).populate({
        path: "manager",
        select: "name email mobile empCode designation",
      });
    }
    if (!employee) throw new Error("Employee not found");
    // get benefits
    const benefits = await DB.Benefit.find({ employee: employee._id });
    // get ctcs
    const ctcs = await DB.CTC.find({ employee: employee._id });
    //get hierarchy

    // Fetch current node
    const currentNode = await DB.Hierarchy.findOne({ employee: employee._id, organization }).populate({ path: "employee", select: "name designation" });
    if (!currentNode) throw new Error("Hierarchy not found for this employee");
    // Fetch manager (one level up)
    const managerNode = await DB.Hierarchy.findOne({ employee: currentNode.reportsTo, organization }).populate({ path: "employee", select: "name designation" });
    // Fetch children (recursive)
    const children = await getSubTree(employee._id, organization);
    const hierarchy = {
      name: managerNode?.employee?.name,
      attributes: {
        designation: managerNode?.employee.designation,
      },
      children: [
        {
          name: currentNode?.employee.name,
          attributes: {
            designation: currentNode?.employee.designation,
          },
          children,
        },
      ],
    };
    //get Leave Requests
    const leaveRequests = await DB.LeaveRequest.find({ employee: employee._id });
    //get payroll
    const payrolls = await DB.Payroll.find({ employee: employee._id });
    //get AttendanceRequests

    let attendanceRequestsIds = await DB.Attendance.find({ employee: employee._id, requested: true });
    attendanceRequestsIds = attendanceRequestsIds.map((v) => v._id);

    const attendanceRequests = await DB.AttendanceRequest.find({
      attendance: { $in: attendanceRequestsIds },
    });
    return handleResponse(res, {
      message: "Employee fetched successfully",
      employee: {
        ...employee.toJSON(),
        benefits,
        ctcs,
        hierarchy,
        leaveRequests,
        payrolls,
        attendanceRequests,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  employee: objectIdValidator.optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
