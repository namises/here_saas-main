/**
 * @swagger
 * /v1/leaves/policy/update:
 *   post:
 *     summary: Update a leave policy
 *     description: Updates an existing leave policy for the organization.
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
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 64
 *                 example: Sick Leave
 *               code:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 16
 *                 example: SL
 *               description:
 *                 type: string
 *                 maxLength: 256
 *                 example: Sick leave for employees
 *               maxPerYear:
 *                 type: number
 *                 example: 12
 *               accrualFrequency:
 *                 type: string
 *                 enum: [monthly, quarterly, annually]
 *                 example: monthly
 *               applicableAfterMonths:
 *                 type: number
 *                 example: 0
 *               carryForward:
 *                 type: boolean
 *                 example: false
 *               maxCarryForward:
 *                 type: number
 *                 example: 0
 *               encashable:
 *                 type: boolean
 *                 example: false
 *               maxEncashable:
 *                 type: number
 *                 example: 0
 *     responses:
 *       200:
 *         description: Leave policy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave policy updated successfully
 *                 leavePolicy:
 *                   type: object
 *                   description: The updated leave policy
 *       400:
 *         description: Invalid request or leave policy not found
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
 *                   example: Leave policy not found
 */
