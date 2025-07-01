const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id)
        .populate('school')
        .select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.'
        });
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication.'
    });
  }
};

// Authorize roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this route.`
      });
    }

    next();
  };
};

// Check if user belongs to the same school
exports.checkSchool = async (req, res, next) => {
  try {
    // Skip school check for system admin operations
    if (req.user.role === 'SuperAdmin') {
      return next();
    }

    if (!req.user.school) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User not associated with any school.'
      });
    }

    // If school ID is provided in params, check if it matches user's school
    if (req.params.schoolId && req.params.schoolId !== req.user.school._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access data from your school.'
      });
    }

    next();
  } catch (error) {
    console.error('School check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in school verification.'
    });
  }
};

// Rate limiting for login attempts
exports.loginRateLimit = (req, res, next) => {
  // This would typically be handled by express-rate-limit
  // But we can add additional custom logic here
  next();
};

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify email token
exports.verifyEmailToken = async (token) => {
  try {
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    return user;
  } catch (error) {
    console.error('Email token verification error:', error);
    return null;
  }
};

// Verify password reset token
exports.verifyPasswordResetToken = async (token) => {
  try {
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    return user;
  } catch (error) {
    console.error('Password reset token verification error:', error);
    return null;
  }
};

// Optional authentication (user may or may not be logged in)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)
          .populate('school')
          .select('-password');
        
        if (user && user.isActive && !user.isLocked) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log('Optional auth: Invalid token');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};