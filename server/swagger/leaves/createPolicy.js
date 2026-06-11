/**
 * @swagger
 * /v1/leaves/policy/create:
 *   post:
 *     summary: Create a leave policy
 *     description: Creates a new leave policy for the organization.
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
 *               - name
 *               - code
 *               - maxPerYear
 *               - accrualFrequency
 *             properties:
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
 *         description: Leave policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave policy created successfully
 *                 leavePolicy:
 *                   type: object
 *                   description: The created leave policy
 *       400:
 *         description: Invalid request or organization not found
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
 *                   example: Organization not found
 */
