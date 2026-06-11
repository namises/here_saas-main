/**
 * @swagger
 * /v1/employee/update:
 *   post:
 *     summary: Update an existing employee profile
 *     description: |
 *       Updates employee information including personal details, organizational data, and hierarchical reporting.
 *       Permissions are enforced to allow updates only by authorized users or owners of the employee record.
 *       If the manager field is updated, the employee's reporting hierarchy and level are recalibrated accordingly.
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
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *                 format: objectId
 *                 description: The unique identifier of the employee to update
 *                 example: 6828f0a4ba7c6f2ec696ec73
 *               organization:
 *                 type: string
 *                 format: objectId
 *                 description: Organization ObjectId (optional)
 *                 example: 68260d87528627c1f4a3da08
 *               name:
 *                 type: string
 *                 maxLength: 128
 *                 example: John Doe 2
 *               mobile:
 *                 type: string
 *                 pattern: '^[0-9]{10}$'
 *                 description: 10-digit mobile number (optional)
 *                 example: '9876543210'
 *               dob:
 *                 type: integer
 *                 description: Date of birth as Unix timestamp (seconds)
 *                 example: 946684835
 *               joiningDate:
 *                 type: integer
 *                 description: Joining date as Unix timestamp (seconds)
 *                 example: 1715126400
 *               designation:
 *                 type: string
 *                 maxLength: 128
 *                 example: Assistant Operations Manager
 *               user:
 *                 type: string
 *                 format: objectId
 *                 description: Linked user ObjectId (optional)
 *                 example: 6828f0a4ba7c6f2ec696ec71
 *               department:
 *                 type: string
 *                 format: objectId
 *                 description: Department ObjectId (optional)
 *                 example: 68260e279c8d1dfd3966ef88
 *               manager:
 *                 type: string
 *                 format: objectId
 *                 description: Manager employee ObjectId (optional)
 *                 example: 68260d87528627c1f4a3da0c
 *               status:
 *                 type: string
 *                 enum: [active, inactive, resigned, terminated]
 *                 description: Employment status (optional)
 *                 example: active
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
 *         description: Employee updated successfully
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
 *                       example: Employee updated successfully
 *                     employee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6828f0a4ba7c6f2ec696ec73
 *                         organization:
 *                           type: string
 *                           example: 68260d87528627c1f4a3da08
 *                         name:
 *                           type: string
 *                           example: John Doe 2
 *                         joiningDate:
 *                           type: integer
 *                           example: 1715126400
 *                         designation:
 *                           type: string
 *                           example: Assistant Operations Manager
 *                         user:
 *                           type: string
 *                           example: 6828f0a4ba7c6f2ec696ec71
 *                         department:
 *                           type: string
 *                           example: 68260e279c8d1dfd3966ef88
 *                         manager:
 *                           type: string
 *                           example: 68260d87528627c1f4a3da0c
 *                         status:
 *                           type: string
 *                           example: active
 *                         documents:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: Resume
 *                               url:
 *                                 type: string
 *                                 format: uri
 *                                 example: https://example.com/resume.pdf
 *                               type:
 *                                 type: string
 *                                 example: pdf
 *                         _leaveMeta:
 *                           type: object
 *                           description: Leave metadata (empty object)
 *                         leaveBalances:
 *                           type: array
 *                           description: Leave balances (empty array)
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:25:08.173Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-05-17T20:28:55.426Z
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                         dob:
 *                           type: integer
 *                           example: 946684835
 *
 */
