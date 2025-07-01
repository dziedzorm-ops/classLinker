const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Middle name cannot exceed 50 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required']
  },
  photo: {
    type: String,
    default: 'https://via.placeholder.com/150x150?text=Student'
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  currentClass: {
    type: String,
    required: [true, 'Current class is required']
  },
  level: {
    type: String,
    enum: ['Nursery', 'Primary', 'JHS', 'SHS'],
    required: true
  },
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required'],
    default: Date.now
  },
  admissionNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Transferred', 'Expelled'],
    default: 'Active'
  },
  // Contact Information
  contact: {
    phone: String,
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  // Parent/Guardian Information
  parents: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    relationship: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian', 'Other'],
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    canReceiveReports: {
      type: Boolean,
      default: true
    }
  }],
  // Academic Information
  academic: {
    house: String, // School house system
    previousSchool: {
      name: String,
      lastClass: String,
      reasonForLeaving: String
    },
    specialNeeds: {
      hasSpecialNeeds: { type: Boolean, default: false },
      description: String,
      accommodations: [String]
    },
    behavior: {
      conduct: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        default: 'Good'
      },
      attendance: {
        totalDays: { type: Number, default: 0 },
        presentDays: { type: Number, default: 0 },
        absentDays: { type: Number, default: 0 },
        lateComings: { type: Number, default: 0 }
      }
    }
  },
  // Health Information
  health: {
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    allergies: [String],
    medicalConditions: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    doctorContact: {
      name: String,
      phone: String,
      hospital: String
    }
  },
  // Financial Information
  financial: {
    feesOwed: { type: Number, default: 0 },
    scholarshipStatus: {
      hasScholarship: { type: Boolean, default: false },
      type: String,
      percentage: Number,
      sponsor: String
    }
  },
  // Academic Records across terms
  academicRecords: [{
    academicYear: String,
    term: String,
    class: String,
    results: [{
      subject: String,
      scores: {
        classTest: Number,
        assignment: Number,
        midTerm: Number,
        finalExam: Number,
        total: Number,
        grade: String,
        remark: String
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    overallPerformance: {
      totalScore: Number,
      percentage: Number,
      position: Number,
      totalStudents: Number,
      grade: String,
      remark: String,
      promoted: Boolean,
      nextClass: String
    },
    attendance: {
      totalDays: Number,
      presentDays: Number,
      absentDays: Number,
      percentage: Number
    },
    conduct: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor']
    },
    principalComment: String,
    classTeacherComment: String
  }],
  // Extra-curricular activities
  activities: [{
    name: String,
    type: {
      type: String,
      enum: ['Sports', 'Arts', 'Music', 'Drama', 'Debate', 'Science', 'Other']
    },
    position: String,
    achievements: [String],
    year: String
  }],
  // Disciplinary records
  disciplinaryRecords: [{
    date: { type: Date, default: Date.now },
    offense: String,
    action: String,
    remarks: String,
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
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
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
studentSchema.index({ school: 1, currentClass: 1 });
studentSchema.index({ studentId: 1, school: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ 'parents.user': 1 });
studentSchema.index({ status: 1, isActive: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return this.middleName 
    ? `${this.firstName} ${this.middleName} ${this.lastName}`
    : `${this.firstName} ${this.lastName}`;
});

// Virtual for age
studentSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for current academic record
studentSchema.virtual('currentAcademicRecord').get(function() {
  if (!this.academicRecords || this.academicRecords.length === 0) return null;
  return this.academicRecords[this.academicRecords.length - 1];
});

// Method to get primary parent
studentSchema.methods.getPrimaryParent = function() {
  return this.parents.find(parent => parent.isPrimary);
};

// Method to add academic record
studentSchema.methods.addAcademicRecord = function(recordData) {
  this.academicRecords.push(recordData);
  return this.save();
};

// Method to update attendance
studentSchema.methods.updateAttendance = function(present = true) {
  if (!this.academic.behavior.attendance) {
    this.academic.behavior.attendance = {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      lateComings: 0
    };
  }
  
  this.academic.behavior.attendance.totalDays += 1;
  if (present) {
    this.academic.behavior.attendance.presentDays += 1;
  } else {
    this.academic.behavior.attendance.absentDays += 1;
  }
  
  return this.save();
};

// Method to calculate attendance percentage
studentSchema.methods.getAttendancePercentage = function() {
  const attendance = this.academic.behavior.attendance;
  if (!attendance || attendance.totalDays === 0) return 0;
  return Math.round((attendance.presentDays / attendance.totalDays) * 100);
};

// Pre-save middleware to generate student ID if not provided
studentSchema.pre('save', async function(next) {
  if (!this.studentId && this.isNew) {
    const year = new Date().getFullYear().toString().substr(-2);
    const count = await this.constructor.countDocuments({ school: this.school });
    this.studentId = `STU${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to ensure only one primary parent
studentSchema.pre('save', function(next) {
  const primaryParents = this.parents.filter(parent => parent.isPrimary);
  if (primaryParents.length > 1) {
    // Keep only the first primary parent
    this.parents.forEach((parent, index) => {
      if (index > 0 && parent.isPrimary) {
        parent.isPrimary = false;
      }
    });
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);