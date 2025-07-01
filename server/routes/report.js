const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkSchool);

// Routes accessible by authenticated users
router.get('/student/:studentId/term/:term', reportController.getStudentReport);
router.get('/download/:reportId', reportController.downloadReport);

// Parent routes
router.get('/parent/children', authorize('Parent'), reportController.getChildrenReports);

// Teacher and Admin routes
router.use(authorize('Admin', 'Teacher'));
router.post('/generate', reportController.generateReport);
router.put('/:reportId/publish', reportController.publishReport);
router.get('/class/:className/batch', reportController.generateBatchReports);

// Admin only routes
router.use(authorize('Admin'));
router.get('/analytics', reportController.getReportAnalytics);
router.post('/templates', reportController.createReportTemplate);
router.put('/templates/:templateId', reportController.updateReportTemplate);

module.exports = router;