/**
 * @swagger
 * /v1/leaves/reject:
 *   post:
 *     summary: Reject a leave request
 *     description: Rejects a pending leave request for an employee within the organization.
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
 *         description: The ObjectId of the leave request to reject.
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave rejected
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
