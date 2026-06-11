/**
 * @swagger
 * /v1/department/create:
 *   post:
 *     summary: Create a department
 *     description: Creates a new department within the authenticated user's organization.
 *     tags:
 *       - Department
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 64
 *                 example: Operations
 *               code:
 *                 type: string
 *                 pattern: '^[a-zA-Z0-9]+$'
 *                 minLength: 2
 *                 maxLength: 16
 *                 example: OPS1
 *               description:
 *                 type: string
 *                 maxLength: 256
 *                 example: Handles all operational tasks.
 *     responses:
 *       200:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: department created Successfully
 *                     department:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6828ed52b92b58230c31b7a1
 *                         organization:
 *                           type: string
 *                           example: 68260d87528627c1f4a3da08
 *                         name:
 *                           type: string
 *                           example: Operationss
 *                         code:
 *                           type: string
 *                           example: OPS1
 *                         description:
 *                           type: string
 *                           example: ops
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:10:58.809Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:10:58.809Z
 *                         __v:
 *                           type: integer
 *                           example: 0
 *       400:
 *         description: Department with name or code already exists
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
 *                   example: Department with name or code already exists
 */
