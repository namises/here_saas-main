/**
 * @swagger
 * /v1/leaves/approve:
 *   post:
 *     summary: Approve a leave request
 *     description: Approves a pending leave request for an employee within the organization.
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: leaveId
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: The ObjectId of the leave request to approve.
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave approoved Successfully
 *       400:
 *         description: Invalid request or leave not found
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
 *                   example: Leave request not found
 */
