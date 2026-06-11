/**
 * @swagger
 * /v1/attendance/export:
 *   get:
 *     summary: Export attendance records to CSV
 *     description: >
 *       Exports attendance records based on filters into a downloadable CSV file.
 *       Requires appropriate permissions:
 *       - `attendance.read` for organization-wide access
 *       - `attendance.read.own` for self data only
 *     tags:
 *       - Attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: employee
 *         in: query
 *         schema:
 *           type: string
 *           format: objectId
 *         required: false
 *         description: Filter by employee ID (optional, auto-set for own access)
 *       - name: startDate
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 1715826600
 *         description: Start date as Unix timestamp (seconds)
 *       - name: endDate
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 1715913000
 *         description: End date as Unix timestamp (seconds)
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [present, absent, leave, holiday, week_off]
 *         description: Filter by attendance status
 *       - name: requested
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filter by whether the attendance was requested
 *
 *     responses:
 *       200:
 *         description: CSV file containing attendance data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *             example: |
 *               Name,Employee Code,Date,In Time,Out Time,Status,Latitude,Longitude,Requested,Comments
 *               John Doe,EMP001,16 May 2025,09:00,18:00,present,28.7041,77.1025,Yes,On time
 */
