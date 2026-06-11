/**
 * @swagger
 * /v1/leaves/update:
 *   post:
 *     summary: Update a leave request
 *     description: Updates a pending leave request for the authenticated employee.
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaveId
 *             properties:
 *               leaveId:
 *                 type: string
 *                 format: objectId
 *                 example: 60d21b4667d0d8992e610c85
 *               leaveType:
 *                 type: string
 *                 example: Sick Leave
 *               fromDate:
 *                 type: number
 *                 example: 1716240000
 *               toDate:
 *                 type: number
 *                 example: 1716326400
 *               reason:
 *                 type: string
 *                 maxLength: 256
 *                 example: Updated reason
 *     responses:
 *       200:
 *         description: Leave request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave request updated Successfully
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
