const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: [true, 'School is required']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required']
  },
  term: {
    type: String,
    required: [true, 'Term is required']
  },
  class: {
    type: String,
    required: [true, 'Class is required']
  },
  examType: {
    type: String,
    enum: ['Mid-Term', 'End-of-Term', 'Mock', 'Final', 'Test'],
    required: [true, 'Exam type is required']
  },
  subjects: [{
    subjectName: {
      type: String,
      required: [true, 'Subject name is required']
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required']
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    scores: {
      classWork: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      homework: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      classTest: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      assignment: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      project: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      midTermExam: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      finalExam: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    },
    // Calculated fields
    totalScore: {
      type: Number,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', 'F']
    },
    gradePoint: {
      type: Number,
      min: 0,
      max: 4
    },
    remark: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Average', 'Below Average', 'Poor', 'Fail']
    },
    position: {
      type: Number,
      min: 1
    },
    totalStudents: {
      type: Number,
      min: 1
    },
    isPassed: {
      type: Boolean,
      default: false
    },
    passMark: {
      type: Number,
      default: 50
    },
    teacherComment: {
      type: String,
      maxlength: [200, 'Teacher comment cannot exceed 200 characters']
    },
    // Weightings for continuous assessment
    weightings: {
      classWork: { type: Number, default: 10 },
      homework: { type: Number, default: 10 },
      classTest: { type: Number, default: 20 },
      assignment: { type: Number, default: 10 },
      project: { type: Number, default: 10 },
      midTermExam: { type: Number, default: 20 },
      finalExam: { type: Number, default: 20 }
    }
  }],
  // Overall Performance Summary
  overallPerformance: {
    totalScore: {
      type: Number,
      min: 0
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 100
    },
    overallGrade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', 'F']
    },
    overallGPA: {
      type: Number,
      min: 0,
      max: 4
    },
    position: {
      type: Number,
      min: 1
    },
    totalStudents: {
      type: Number,
      min: 1
    },
    subjectsPassed: {
      type: Number,
      default: 0
    },
    subjectsFailed: {
      type: Number,
      default: 0
    },
    isPromoted: {
      type: Boolean,
      default: false
    },
    nextClass: String
  },
  // Attendance for the term
  attendance: {
    totalDays: {
      type: Number,
      default: 0
    },
    presentDays: {
      type: Number,
      default: 0
    },
    absentDays: {
      type: Number,
      default: 0
    },
    lateComings: {
      type: Number,
      default: 0
    },
    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  // Behavioral Assessment
  behavior: {
    conduct: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    attitude: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    punctuality: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    cooperation: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    }
  },
  // Comments
  comments: {
    classTeacher: {
      comment: String,
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    principal: {
      comment: String,
      principal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  // Extra-curricular activities for this term
  activities: [{
    name: String,
    grade: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
    },
    position: String,
    achievement: String
  }],
  // Report card generation
  reportCard: {
    isGenerated: {
      type: Boolean,
      default: false
    },
    generatedAt: Date,
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pdfUrl: String,
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // Next term information
  nextTerm: {
    resumptionDate: Date,
    newClass: String,
    feesForNextTerm: Number
  },
  // System fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Draft', 'Completed', 'Published', 'Archived'],
    default: 'Draft'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
resultSchema.index({ student: 1, academicYear: 1, term: 1 });
resultSchema.index({ school: 1, class: 1, academicYear: 1, term: 1 });
resultSchema.index({ status: 1, isActive: 1 });
resultSchema.index({ 'reportCard.isPublished': 1 });

// Virtual for calculating age at time of result
resultSchema.virtual('studentAge').get(function() {
  if (!this.student || !this.student.dateOfBirth) return null;
  const resultDate = this.createdAt || new Date();
  const birthDate = new Date(this.student.dateOfBirth);
  let age = resultDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = resultDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && resultDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Method to calculate total score for a subject
resultSchema.methods.calculateSubjectTotal = function(subject) {
  const scores = subject.scores;
  const weightings = subject.weightings;
  
  let total = 0;
  total += (scores.classWork * weightings.classWork) / 100;
  total += (scores.homework * weightings.homework) / 100;
  total += (scores.classTest * weightings.classTest) / 100;
  total += (scores.assignment * weightings.assignment) / 100;
  total += (scores.project * weightings.project) / 100;
  total += (scores.midTermExam * weightings.midTermExam) / 100;
  total += (scores.finalExam * weightings.finalExam) / 100;
  
  return Math.round(total * 100) / 100;
};

// Method to determine grade from score
resultSchema.methods.getGradeFromScore = function(score) {
  if (score >= 90) return { grade: 'A+', point: 4.0, remark: 'Excellent' };
  if (score >= 80) return { grade: 'A', point: 3.7, remark: 'Very Good' };
  if (score >= 75) return { grade: 'B+', point: 3.3, remark: 'Good' };
  if (score >= 70) return { grade: 'B', point: 3.0, remark: 'Good' };
  if (score >= 65) return { grade: 'C+', point: 2.7, remark: 'Average' };
  if (score >= 60) return { grade: 'C', point: 2.3, remark: 'Average' };
  if (score >= 55) return { grade: 'D+', point: 2.0, remark: 'Below Average' };
  if (score >= 50) return { grade: 'D', point: 1.7, remark: 'Below Average' };
  if (score >= 40) return { grade: 'E', point: 1.0, remark: 'Poor' };
  return { grade: 'F', point: 0.0, remark: 'Fail' };
};

// Method to calculate overall performance
resultSchema.methods.calculateOverallPerformance = function() {
  let totalScore = 0;
  let subjectsPassed = 0;
  let subjectsFailed = 0;
  let totalGradePoints = 0;
  
  this.subjects.forEach(subject => {
    totalScore += subject.totalScore || 0;
    totalGradePoints += subject.gradePoint || 0;
    
    if (subject.totalScore >= subject.passMark) {
      subjectsPassed++;
    } else {
      subjectsFailed++;
    }
  });
  
  const averageScore = this.subjects.length > 0 ? totalScore / this.subjects.length : 0;
  const gpa = this.subjects.length > 0 ? totalGradePoints / this.subjects.length : 0;
  const gradeInfo = this.getGradeFromScore(averageScore);
  
  this.overallPerformance = {
    totalScore: Math.round(totalScore * 100) / 100,
    averageScore: Math.round(averageScore * 100) / 100,
    overallGrade: gradeInfo.grade,
    overallGPA: Math.round(gpa * 100) / 100,
    subjectsPassed,
    subjectsFailed,
    isPromoted: subjectsFailed === 0 || (subjectsPassed / this.subjects.length) >= 0.6
  };
  
  return this.overallPerformance;
};

// Method to calculate attendance percentage
resultSchema.methods.calculateAttendancePercentage = function() {
  if (this.attendance.totalDays === 0) return 0;
  const percentage = (this.attendance.presentDays / this.attendance.totalDays) * 100;
  this.attendance.attendancePercentage = Math.round(percentage * 100) / 100;
  return this.attendance.attendancePercentage;
};

// Pre-save middleware to calculate totals and grades
resultSchema.pre('save', function(next) {
  // Calculate total scores and grades for each subject
  this.subjects.forEach(subject => {
    subject.totalScore = this.calculateSubjectTotal(subject);
    const gradeInfo = this.getGradeFromScore(subject.totalScore);
    subject.grade = gradeInfo.grade;
    subject.gradePoint = gradeInfo.point;
    subject.remark = gradeInfo.remark;
    subject.isPassed = subject.totalScore >= subject.passMark;
  });
  
  // Calculate overall performance
  this.calculateOverallPerformance();
  
  // Calculate attendance percentage
  this.calculateAttendancePercentage();
  
  next();
});

module.exports = mongoose.model('Result', resultSchema);