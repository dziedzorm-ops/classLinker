const express = require('express');
const teacherController = require('../controllers/teacherController');
const { protect, authorize, checkSchool } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(checkSchool);

// Routes accessible by all authenticated users
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacher);

// Admin only routes
router.use(authorize('Admin'));
router.post('/', teacherController.createTeacher);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);
router.put('/:id/subjects', teacherController.assignSubjects);
router.put('/:id/classes', teacherController.assignClasses);

module.exports = router;