/**
 * @swagger
 * /v1/leaves/list:
 *   get:
 *     summary: List leave requests
 *     description: Retrieves a paginated list of leave requests for the authenticated user or their subordinates, with optional filters.
 *     tags:
 *       - Leaves
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         required: false
 *         description: Filter by leave request status
 *       - in: query
 *         name: date
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter by date (timestamp)
 *       - in: query
 *         name: leaveType
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by leave type
 *       - in: query
 *         name: self
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, fetches only the authenticated user's leaves; otherwise, fetches subordinates' leaves
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Page number
 *     responses:
 *       200:
 *         description: Leaves fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leaves fetched successfully
 *                 leaves:
 *                   type: object
 *                   description: Paginated leave request results
 *       400:
 *         description: Invalid request or error fetching leaves
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
 *                   example: Error fetching leaves
 */
