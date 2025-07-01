const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkSchool);

// Routes for all authenticated users
router.get('/overview', dashboardController.getOverview);

// Admin dashboard
router.get('/admin', authorize('Admin'), dashboardController.getAdminDashboard);

// Teacher dashboard
router.get('/teacher', authorize('Teacher'), dashboardController.getTeacherDashboard);

// Parent dashboard
router.get('/parent', authorize('Parent'), dashboardController.getParentDashboard);

// Analytics routes
router.get('/analytics/students', dashboardController.getStudentAnalytics);
router.get('/analytics/results', dashboardController.getResultAnalytics);
router.get('/analytics/attendance', dashboardController.getAttendanceAnalytics);

module.exports = router;