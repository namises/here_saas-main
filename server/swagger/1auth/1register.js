/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register new organization
 *     description: Creates a new organization, super admin user, associated employee record, hierarchy, and attendance code.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgName
 *               - domain
 *               - name
 *               - email
 *               - mobile
 *               - password
 *             properties:
 *               orgName:
 *                 type: string
 *                 example: Acme Corporation
 *               domain:
 *                 type: string
 *                 format: hostname
 *                 example: acme.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@acme.com
 *               mobile:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: SecurePass@123
 *     responses:
 *       200:
 *         description: Organization registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization registered successfully
 *                 orgId:
 *                   type: string
 *                   example: 64fd2ae79c27a45b2d674123
 */
