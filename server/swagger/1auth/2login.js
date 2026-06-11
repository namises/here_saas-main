/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates the user using email and password. Returns a JWT token and user metadata.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@acme.com
 *               password:
 *                 type: string
 *                 example: SecurePass@123
 *     responses:
 *       200:
 *         description: Logged in successfully
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
 *                       example: Logged in successfully
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 68260e4c9c8d1dfd3966ef8c
 *                         email:
 *                           type: string
 *                           example: john.doe3@example.com
 *                         isSuperAdmin:
 *                           type: boolean
 *                           example: false
 *                         organization:
 *                           type: string
 *                           example: 68260d87528627c1f4a3da08
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - employee.read.own
 *                             - attendance.read.own
 *                             - leave.create
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         employee:
 *                           type: string
 *                           example: 68260e4c9c8d1dfd3966ef8e
 *                         manager:
 *                           type: string
 *                           example: 68260d87528627c1f4a3da0c
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 */
