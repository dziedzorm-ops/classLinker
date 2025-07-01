const express = require('express');
const schoolController = require('../controllers/schoolController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Public routes (accessible by all authenticated users)
router.get('/me', schoolController.getMySchool);

// Apply school check for remaining routes
router.use(checkSchool);

// Admin only routes
router.use(authorize('Admin'));
router.put('/profile', schoolController.updateSchoolProfile);
router.put('/logo', schoolController.updateSchoolLogo);
router.put('/settings', schoolController.updateSchoolSettings);
router.post('/academic-year', schoolController.createAcademicYear);
router.put('/academic-year', schoolController.updateAcademicYear);
router.post('/terms', schoolController.createTerm);
router.put('/terms/:termId', schoolController.updateTerm);
router.put('/terms/:termId/activate', schoolController.activateTerm);
router.post('/subjects', schoolController.addSubject);
router.put('/subjects/:subjectId', schoolController.updateSubject);
router.delete('/subjects/:subjectId', schoolController.deleteSubject);
router.post('/classes', schoolController.addClass);
router.put('/classes/:classId', schoolController.updateClass);
router.delete('/classes/:classId', schoolController.deleteClass);
router.put('/grading-system', schoolController.updateGradingSystem);

module.exports = router;