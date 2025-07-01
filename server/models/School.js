const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    website: { type: String }
  },
  logo: {
    type: String,
    default: process.env.DEFAULT_SCHOOL_LOGO
  },
  motto: {
    type: String,
    default: process.env.DEFAULT_SCHOOL_MOTTO
  },
  type: {
    type: String,
    enum: ['Public', 'Private', 'International', 'Montessori', 'NGO'],
    required: true
  },
  level: {
    type: [String],
    enum: ['Nursery', 'Primary', 'JHS', 'SHS'],
    required: true
  },
  academicYear: {
    current: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  terms: [{
    name: { type: String, required: true }, // e.g., "First Term", "Second Term"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false }
  }],
  gradingSystem: {
    type: {
      type: String,
      enum: ['Percentage', 'Letter', 'Custom'],
      default: 'Percentage'
    },
    scale: [{
      grade: String, // A, B, C or custom
      minScore: Number,
      maxScore: Number,
      description: String // Excellent, Good, etc.
    }],
    passMarkDefault: { type: Number, default: 50 }
  },
  subjects: [{
    name: { type: String, required: true },
    code: { type: String, required: true },
    level: { type: String, required: true },
    isCore: { type: Boolean, default: false },
    passMark: { type: Number, default: 50 }
  }],
  classes: [{
    name: { type: String, required: true }, // e.g., "Grade 1A", "Form 1"
    level: { type: String, required: true },
    capacity: { type: Number, default: 30 },
    classTeacher: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Teacher' 
    }
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['Basic', 'Premium', 'Enterprise'],
      default: 'Basic'
    },
    status: {
      type: String,
      enum: ['Trial', 'Active', 'Expired', 'Suspended'],
      default: 'Trial'
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    maxStudents: { type: Number, default: 100 },
    maxTeachers: { type: Number, default: 10 }
  },
  settings: {
    allowParentAccess: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true },
    reportCardTemplate: { type: String, default: 'Standard' },
    language: { type: String, default: 'English' },
    currency: { type: String, default: 'GHS' }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
schoolSchema.index({ name: 'text', 'address.city': 'text' });
schoolSchema.index({ owner: 1 });
schoolSchema.index({ isActive: 1 });

// Virtual for getting active term
schoolSchema.virtual('activeTerm').get(function() {
  return this.terms.find(term => term.isActive);
});

// Method to add new academic year
schoolSchema.methods.startNewAcademicYear = function(yearData) {
  this.academicYear = yearData;
  this.terms = [];
  return this.save();
};

// Method to set active term
schoolSchema.methods.setActiveTerm = function(termId) {
  this.terms.forEach(term => {
    term.isActive = term._id.toString() === termId.toString();
  });
  return this.save();
};

// Pre-save middleware
schoolSchema.pre('save', function(next) {
  // Ensure only one active term at a time
  const activeTerms = this.terms.filter(term => term.isActive);
  if (activeTerms.length > 1) {
    this.terms.forEach((term, index) => {
      if (index > 0) term.isActive = false;
    });
  }
  next();
});

module.exports = mongoose.model('School', schoolSchema);