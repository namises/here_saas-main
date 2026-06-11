/**
 * @swagger
 * /v1/attendance/approve:
 *   post:
 *     summary: Approve an attendance request
 *     description: Approves a pending attendance request for an employee. Only authorized approvers can perform this action. Requires Bearer token.
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendanceRequestId
 *               - checkIn
 *               - checkOut
 *               - status
 *               - reason
 *             properties:
 *               attendanceRequestId:
 *                 type: string
 *                 format: objectId
 *                 example: 665bc5efbe76103f4d8a7201
 *               checkIn:
 *                 oneOf:
 *                   - type: number
 *                     example: 1715826600000
 *                   - type: boolean
 *                     example: false
 *               checkOut:
 *                 oneOf:
 *                   - type: number
 *                     example: 1715841000000
 *                   - type: boolean
 *                     example: false
 *               status:
 *                 type: string
 *                 enum: [present, absent, leave, holiday, week_off]
 *                 example: present
 *               reason:
 *                 type: string
 *                 example: Corrected shift timings after field duty
 *     responses:
 *       200:
 *         description: Attendance request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance req approved successfully
 */
