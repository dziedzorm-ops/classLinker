const express = require('express');
const { body } = require('express-validator');
const resultController = require('../controllers/resultController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and school check to all routes
router.use(protect);
router.use(checkSchool);

// Validation middleware
const createResultValidation = [
  body('student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('academicYear')
    .notEmpty()
    .withMessage('Academic year is required'),
  body('term')
    .notEmpty()
    .withMessage('Term is required'),
  body('class')
    .notEmpty()
    .withMessage('Class is required'),
  body('examType')
    .isIn(['Mid-Term', 'End-of-Term', 'Mock', 'Final', 'Test'])
    .withMessage('Invalid exam type'),
  body('subjects')
    .isArray({ min: 1 })
    .withMessage('At least one subject is required'),
  body('subjects.*.subjectName')
    .notEmpty()
    .withMessage('Subject name is required'),
  body('subjects.*.subjectCode')
    .notEmpty()
    .withMessage('Subject code is required')
];

// Routes accessible by all authenticated users
router.get('/', resultController.getAllResults);
router.get('/student/:studentId', resultController.getStudentResults);
router.get('/class/:className', resultController.getClassResults);
router.get('/statistics', resultController.getResultStatistics);
router.get('/:id', resultController.getResult);

// Parent routes
router.get('/parent/children', authorize('Parent'), resultController.getChildrenResults);

// Teacher and Admin routes
router.use(authorize('Admin', 'Teacher'));
router.post('/', createResultValidation, resultController.createResult);
router.put('/:id', resultController.updateResult);
router.put('/:id/subject/:subjectIndex', resultController.updateSubjectResult);
router.put('/:id/attendance', resultController.updateAttendance);
router.put('/:id/behavior', resultController.updateBehavior);
router.put('/:id/comments', resultController.updateComments);
router.put('/:id/activities', resultController.updateActivities);

// Report card generation
router.post('/:id/generate-report', resultController.generateReportCard);
router.put('/:id/publish-report', resultController.publishReportCard);
router.get('/:id/report-pdf', resultController.downloadReportCard);

// Admin only routes
router.use(authorize('Admin'));
router.delete('/:id', resultController.deleteResult);
router.post('/bulk-create', resultController.bulkCreateResults);
router.put('/:id/status', resultController.updateResultStatus);
router.get('/class/:className/export', resultController.exportClassResults);
router.post('/calculate-positions', resultController.calculateClassPositions);

module.exports = router;