/**
 * @swagger
 * /v1/leaves/policy/list:
 *   get:
 *     summary: List leave policies
 *     description: Retrieves a list of leave policies for the organization, with optional filters.
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by leave type or code
 *       - in: query
 *         name: accrualFrequency
 *         schema:
 *           type: string
 *           enum: [monthly, quarterly, annually]
 *         required: false
 *         description: Filter by accrual frequency
 *       - in: query
 *         name: carryForward
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by carry forward
 *       - in: query
 *         name: encashable
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter by encashable
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Page number
 *     responses:
 *       200:
 *         description: Leave policies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave policies fetched successfully
 *                 leavePolicies:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: List of leave policies
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
