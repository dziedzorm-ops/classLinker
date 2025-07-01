const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and school check to all routes
router.use(protect);
router.use(checkSchool);

// Validation middleware
const createStudentValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender must be Male or Female'),
  body('currentClass')
    .notEmpty()
    .withMessage('Current class is required'),
  body('level')
    .isIn(['Nursery', 'Primary', 'JHS', 'SHS'])
    .withMessage('Level must be Nursery, Primary, JHS, or SHS'),
  body('admissionNumber')
    .trim()
    .notEmpty()
    .withMessage('Admission number is required')
];

// Public routes (accessible by all authenticated users)
router.get('/', studentController.getAllStudents);
router.get('/search', studentController.searchStudents);
router.get('/class/:className', studentController.getStudentsByClass);
router.get('/statistics', studentController.getStudentStatistics);
router.get('/:id', studentController.getStudent);

// Admin and Teacher routes
router.use(authorize('Admin', 'Teacher'));
router.post('/', createStudentValidation, studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.put('/:id/photo', studentController.updateStudentPhoto);
router.put('/:id/attendance', studentController.updateAttendance);
router.post('/:id/academic-record', studentController.addAcademicRecord);
router.put('/:id/academic-record/:recordId', studentController.updateAcademicRecord);

// Admin only routes
router.use(authorize('Admin'));
router.delete('/:id', studentController.deleteStudent);
router.put('/:id/status', studentController.updateStudentStatus);
router.post('/bulk-import', studentController.bulkImportStudents);
router.get('/export/csv', studentController.exportStudentsCSV);
router.get('/export/pdf', studentController.exportStudentsPDF);

module.exports = router;