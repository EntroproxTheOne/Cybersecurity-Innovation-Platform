const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['malware', 'phishing', 'ddos', 'data_breach', 'insider_threat', 'vulnerability', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'investigating', 'resolved', 'false_positive', 'closed'],
    default: 'active'
  },
  source: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  ipAddress: {
    type: String,
    trim: true,
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Invalid IP address format']
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  detectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  additionalData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  likelihood: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  affectedSystems: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  indicators: [{
    type: {
      type: String,
      enum: ['ip', 'domain', 'url', 'file_hash', 'email', 'other']
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  timeline: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }],
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  relatedThreats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Threat'
  }],
  escalation: {
    escalated: {
      type: Boolean,
      default: false
    },
    escalatedAt: {
      type: Date
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
threatSchema.index({ detectedAt: -1 });
threatSchema.index({ severity: 1 });
threatSchema.index({ status: 1 });
threatSchema.index({ type: 1 });
threatSchema.index({ detectedBy: 1 });
threatSchema.index({ source: 1 });
threatSchema.index({ ipAddress: 1 });
threatSchema.index({ tags: 1 });
threatSchema.index({ 'indicators.value': 1 });
threatSchema.index({ createdAt: -1 });

// Compound indexes
threatSchema.index({ status: 1, severity: 1 });
threatSchema.index({ detectedAt: -1, status: 1 });
threatSchema.index({ type: 1, severity: 1 });

// Virtual for threat age in hours
threatSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.detectedAt) / (1000 * 60 * 60));
});

// Virtual for response time in hours
threatSchema.virtual('responseTimeInHours').get(function() {
  if (this.resolvedAt) {
    return Math.floor((this.resolvedAt - this.detectedAt) / (1000 * 60 * 60));
  }
  return null;
});

// Pre-save middleware
threatSchema.pre('save', function(next) {
  // Auto-calculate risk score based on severity and impact
  if (this.isModified('severity') || this.isModified('impact')) {
    const severityScores = { low: 25, medium: 50, high: 75, critical: 100 };
    const impactScores = { low: 25, medium: 50, high: 75, critical: 100 };
    
    this.riskScore = Math.round(
      (severityScores[this.severity] + impactScores[this.impact]) / 2
    );
  }

  // Auto-set resolvedAt when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }

  next();
});

// Instance methods
threatSchema.methods.addTimelineEntry = function(action, performedBy, details = '') {
  this.timeline.push({
    action,
    performedBy,
    details,
    timestamp: new Date()
  });
  return this.save();
};

threatSchema.methods.escalate = function(escalatedTo, reason) {
  this.escalation = {
    escalated: true,
    escalatedAt: new Date(),
    escalatedTo,
    reason
  };
  return this.save();
};

threatSchema.methods.addIndicator = function(type, value, description = '') {
  this.indicators.push({
    type,
    value,
    description
  });
  return this.save();
};

threatSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

threatSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Static methods
threatSchema.statics.findBySeverity = function(severity) {
  return this.find({ severity, status: { $ne: 'closed' } });
};

threatSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

threatSchema.statics.findByType = function(type) {
  return this.find({ type });
};

threatSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    detectedAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

threatSchema.statics.getThreatStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
      }
    }
  ]);
};

// Text search index
threatSchema.index({
  title: 'text',
  description: 'text',
  source: 'text',
  notes: 'text'
});

module.exports = mongoose.model('Threat', threatSchema);
