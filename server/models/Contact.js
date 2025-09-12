const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
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
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'support', 'sales', 'partnership', 'security', 'other'],
    default: 'general'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  response: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ''
  },
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
    }
  }],
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    scheduledAt: {
      type: Date
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'social_media', 'referral', 'other'],
    default: 'website'
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ submittedAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ name: 1 });

// Compound indexes
contactSchema.index({ status: 1, priority: 1 });
contactSchema.index({ submittedAt: -1, status: 1 });
contactSchema.index({ category: 1, status: 1 });

// Virtual for response time in hours
contactSchema.virtual('responseTimeInHours').get(function() {
  if (this.resolvedAt) {
    return Math.floor((this.resolvedAt - this.submittedAt) / (1000 * 60 * 60));
  }
  return null;
});

// Virtual for age in hours
contactSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60));
});

// Pre-save middleware
contactSchema.pre('save', function(next) {
  // Auto-set resolvedAt when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }

  // Auto-set priority based on keywords in message
  if (this.isModified('message') && this.isNew) {
    const urgentKeywords = ['urgent', 'emergency', 'critical', 'asap', 'immediately'];
    const highKeywords = ['important', 'priority', 'soon', 'quickly'];
    
    const messageLower = this.message.toLowerCase();
    
    if (urgentKeywords.some(keyword => messageLower.includes(keyword))) {
      this.priority = 'urgent';
    } else if (highKeywords.some(keyword => messageLower.includes(keyword))) {
      this.priority = 'high';
    }
  }

  next();
});

// Instance methods
contactSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  this.status = 'in_progress';
  return this.save();
};

contactSchema.methods.addNote = function(note) {
  this.notes = this.notes ? `${this.notes}\n${note}` : note;
  return this.save();
};

contactSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

contactSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

contactSchema.methods.scheduleFollowUp = function(scheduledAt, notes = '') {
  this.followUp = {
    required: true,
    scheduledAt,
    notes,
    completed: false
  };
  return this.save();
};

contactSchema.methods.completeFollowUp = function(notes = '') {
  this.followUp.completed = true;
  if (notes) {
    this.followUp.notes = this.followUp.notes ? `${this.followUp.notes}\n${notes}` : notes;
  }
  return this.save();
};

// Static methods
contactSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

contactSchema.statics.findByPriority = function(priority) {
  return this.find({ priority });
};

contactSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

contactSchema.statics.findOverdue = function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.find({
    status: { $in: ['new', 'in_progress'] },
    submittedAt: { $lt: oneDayAgo }
  });
};

contactSchema.statics.findPendingFollowUp = function() {
  return this.find({
    'followUp.required': true,
    'followUp.completed': false,
    'followUp.scheduledAt': { $lte: new Date() }
  });
};

contactSchema.statics.getContactStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
      }
    }
  ]);
};

// Text search index
contactSchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text',
  company: 'text'
});

module.exports = mongoose.model('Contact', contactSchema);
