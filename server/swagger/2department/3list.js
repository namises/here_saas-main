/**
 * @swagger
 * /v1/department/list:
 *   get:
 *     summary: Get list of departments with pagination and filtering
 *     description: Retrieves a paginated list of departments filtered by optional name, code, and description within the authenticated user's organization.
 *     tags:
 *       - Department
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 64
 *         description: Partial or full department name to filter by
 *         example: Operations
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]+$'
 *           minLength: 2
 *           maxLength: 16
 *         description: Partial or full department code to filter by
 *         example: OPS
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *           maxLength: 256
 *         description: Partial or full department description to filter by
 *         example: handles daily ops
 *     responses:
 *       200:
 *         description: Departments fetched successfully
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
 *                       example: Departments fetched successfully
 *                     result:
 *                       type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 6828ed52b92b58230c31b7a1
 *                               name:
 *                                 type: string
 *                                 example: Operationss
 *                               code:
 *                                 type: string
 *                                 example: OPS1
 *                               description:
 *                                 type: string
 *                                 example: something new
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             totalResults:
 *                               type: integer
 *                               example: 2
 *                             previousPage:
 *                               type: integer
 *                               nullable: true
 *                               example: null
 *                             currentPage:
 *                               type: integer
 *                               example: 1
 *                             nextPage:
 *                               type: integer
 *                               nullable: true
 *                               example: null
 *                             lastPage:
 *                               type: integer
 *                               example: 1
 *                             limit:
 *                               type: integer
 *                               example: 10
 */
