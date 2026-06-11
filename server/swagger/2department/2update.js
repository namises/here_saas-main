/**
 * @swagger
 * /v1/department/update:
 *   post:
 *     summary: Update an existing department
 *     description: Updates department details such as name, code, and description within the user's organization.
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
 *               - departmentId
 *             properties:
 *               departmentId:
 *                 type: string
 *                 format: objectId
 *                 example: 6828ed52b92b58230c31b7a1
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 64
 *                 example: Operationss
 *               code:
 *                 type: string
 *                 pattern: '^[a-zA-Z0-9]+$'
 *                 minLength: 2
 *                 maxLength: 16
 *                 example: OPS1
 *               description:
 *                 type: string
 *                 maxLength: 256
 *                 example: something new
 *     responses:
 *       200:
 *         description: Department updated successfully
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
 *                       example: Department updated successfully
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
 *                           example: something new
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:10:58.809Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:14:10.143Z
 *                         __v:
 *                           type: integer
 *                           example: 0
 *
 */
