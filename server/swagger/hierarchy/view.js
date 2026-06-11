/**
 * @swagger
 * /v1/hierarchy/view:
 *   get:
 *     summary: View employee hierarchy
 *     description: |
 *       Returns the reporting hierarchy for a given employee or the entire organization if the user is a super admin. If employeeId is not provided and the user is a super admin, the full hierarchy tree is returned.
 *     tags:
 *       - Hierarchy
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           format: objectId
 *           default: null
 *         required: false
 *         description: The ObjectId of the employee to view the hierarchy for. If omitted and user is super admin, returns the full hierarchy.
 *     responses:
 *       200:
 *         description: Hierarchy fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hierarchy fetched Successfully successfully.
 *                 hierarchy:
 *                   type: object
 *                   description: Hierarchy tree or node
 *       400:
 *         description: Invalid request or hierarchy not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Hierarchy not found for this employee
 */
