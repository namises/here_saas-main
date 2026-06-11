import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";

export const getSubTree = async (employeeId, organization) => {
  const children = await DB.Hierarchy.find({ reportsTo: employeeId, organization })
    .populate({
      path: "employee",
      select: "name designation",
    })
    .sort({ level: 1 });

  const subTree = await Promise.all(
    children.map(async (node) => {
      const nestedChildren = await getSubTree(node.employee._id, organization);
      return {
        name: node.employee.name,
        attributes: {
          designation: node.employee.designation,
        },
        children: nestedChildren,
      };
    })
  );

  return subTree;
};

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { employeeId } = req.queryParams;

    const employeeDoc = await DB.Employee.findOne({ _id: employeeId, organization });

    let hierarchy = [];
    // If user is admin, return entire top-level tree
    if (employeeDoc.isSuperAdmin) {
      hierarchy = await getSubTree(null, organization);
      return handleResponse(res, { message: "Hierarchy fetched Successfully.", hierarchy: hierarchy[0] });
    }
    // Fetch current node
    const currentNode = await DB.Hierarchy.findOne({ employee: employeeId, organization }).populate({ path: "employee", select: "name designation" });
    if (!currentNode) throw new Error("Hierarchy not found for this employee");
    // Fetch manager (one level up)
    const managerNode = await DB.Hierarchy.findOne({ employee: currentNode.reportsTo, organization }).populate({ path: "employee", select: "name designation" });
    // Fetch children (recursive)
    const children = await getSubTree(employeeId, organization);
    hierarchy = [
      {
        name: managerNode.employee.name,
        attributes: {
          designation: managerNode.employee.designation,
        },
        children: [
          {
            name: currentNode.employee.name,
            attributes: {
              designation: currentNode.employee.designation,
            },
            children,
          },
        ],
      },
    ];
    return handleResponse(res, { message: "Hierarchy fetched Successfully.", hierarchy: hierarchy[0] });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  employeeId: objectIdValidator.optional().default(null),
});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
