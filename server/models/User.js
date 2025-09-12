const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'analyst', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: ''
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      threatAlerts: {
        type: Boolean,
        default: true
      },
      systemUpdates: {
        type: Boolean,
        default: false
      }
    },
    dashboard: {
      widgets: [{
        type: String,
        enum: ['threatOverview', 'recentThreats', 'analytics', 'geographic', 'performance']
      }]
    }
  },
  securitySettings: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      default: ''
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    }
  },
  apiKeys: [{
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'admin']
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.securitySettings.twoFactorSecret;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.securitySettings.lockUntil && this.securitySettings.lockUntil > Date.now());
});

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.securitySettings.passwordChangedAt = Date.now();
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.securitySettings.lockUntil && this.securitySettings.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'securitySettings.lockUntil': 1 },
      $set: { 'securitySettings.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'securitySettings.loginAttempts': 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.securitySettings.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'securitySettings.lockUntil': Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { 'securitySettings.loginAttempts': 1, 'securitySettings.lockUntil': 1 }
  });
};

userSchema.methods.generateApiKey = function(name, permissions = ['read']) {
  const crypto = require('crypto');
  const key = crypto.randomBytes(32).toString('hex');
  
  this.apiKeys.push({
    name,
    key,
    permissions,
    createdAt: new Date()
  });
  
  return key;
};

userSchema.methods.revokeApiKey = function(keyId) {
  this.apiKeys = this.apiKeys.filter(key => key._id.toString() !== keyId);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Middleware to update lastLogin on successful authentication
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
