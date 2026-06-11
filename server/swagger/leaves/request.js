/**
 * @swagger
 * /v1/leaves/request:
 *   post:
 *     summary: Request leave
 *     description: Submits a leave request for the authenticated employee.
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
 *               - leaveType
 *               - fromDate
 *               - toDate
 *             properties:
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
 *                 example: Feeling unwell
 *     responses:
 *       200:
 *         description: Leave applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave applied Successfully
 *       400:
 *         description: Invalid request or employee not found
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
 *                   example: Employee not found
 */
