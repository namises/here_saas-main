/**
 * @swagger
 * /v1/employee/create:
 *   post:
 *     summary: Create a new user and employee record with hierarchy
 *     description: |
 *       Creates a new user with hashed password and an associated employee profile within the authenticated user's organization.
 *       Automatically assigns default employee permissions and establishes reporting hierarchy under the specified manager.
 *       This operation is transactional to ensure data integrity.
 *     tags:
 *       - Employee
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
 *               - email
 *               - joiningDate
 *               - manager
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 64
 *                 example: John Doe 2
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe2@example.com
 *               mobile:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 description: 10-digit mobile number (optional)
 *                 example: '9876543210'
 *               dob:
 *                 type: integer
 *                 description: Date of birth as Unix timestamp (seconds)
 *                 example: 631152000
 *               joiningDate:
 *                 type: integer
 *                 description: Joining date as Unix timestamp (seconds)
 *                 example: 1715126400
 *               department:
 *                 type: string
 *                 format: objectId
 *                 description: Department ObjectId (optional)
 *                 example: 68260e279c8d1dfd3966ef88
 *               designation:
 *                 type: string
 *                 maxLength: 128
 *                 example: Assistant Operations Manager
 *               manager:
 *                 type: string
 *                 format: objectId
 *                 description: Manager employee ObjectId (required)
 *                 example: 68260d87528627c1f4a3da0c
 *               empCode:
 *                 type: string
 *                 example: EMP1234
 *               status:
 *                 type: string
 *                 enum: [active, inactive, resigned, terminated]
 *                 default: active
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Strong password with minimum 8 chars, uppercase, lowercase, digit & special char
 *                 example: Passw0rd!
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - url
 *                     - type
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Resume
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/resume.pdf
 *                     type:
 *                       type: string
 *                       example: pdf
 *     responses:
 *       200:
 *         description: User and Employee created successfully
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
 *                       example: User and Employee created successfully.
 *                     employee:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 6828f0a4ba7c6f2ec696ec73
 *                           organization:
 *                             type: string
 *                             example: 68260d87528627c1f4a3da08
 *                           name:
 *                             type: string
 *                             example: John Doe 2
 *                           joiningDate:
 *                             type: integer
 *                             example: 1715126400
 *                           designation:
 *                             type: string
 *                             example: Assistant Operations Manager
 *                           user:
 *                             type: string
 *                             example: 6828f0a4ba7c6f2ec696ec71
 *                           department:
 *                             type: string
 *                             example: 68260e279c8d1dfd3966ef88
 *                           manager:
 *                             type: string
 *                             example: 68260d87528627c1f4a3da0c
 *                           status:
 *                             type: string
 *                             example: active
 *                           documents:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: Resume
 *                                 url:
 *                                   type: string
 *                                   format: uri
 *                                   example: https://example.com/resume.pdf
 *                                 type:
 *                                   type: string
 *                                   example: pdf
 *                           _leaveMeta:
 *                             type: object
 *                             description: Leave metadata (empty object)
 *                           leaveBalances:
 *                             type: array
 *                             description: Leave balances (empty array)
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-17T20:25:08.173Z
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2025-05-17T20:25:08.173Z
 *                           __v:
 *                             type: integer
 *                             example: 0
 *
 */
