const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  priority: { 
    type: String, 
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high'
    },
    default: 'medium' 
  },
  category: { 
    type: String, 
    default: 'personal',
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  tags: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(tags) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  dueDate: { 
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() { 
      // userId is required only if guestId is not provided
      return !this.guestId;
    },
    validate: {
      validator: function(v) {
        // Either userId or guestId must be provided, but not both
        return !(this.guestId && v);
      },
      message: 'Cannot provide both userId and guestId'
    }
  },
  guestId: {
    type: String,
    required: function() {
      // guestId is required only if userId is not provided
      return !this.userId;
    },
    index: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Source metadata for analytics/debugging (origin, referer, devtunnel flag)
todoSchema.add({
  source: {
    origin: { type: String, default: '' },
    referer: { type: String, default: '' },
    hostname: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    isDevTunnel: { type: Boolean, default: false },
  }
});

// Update the updatedAt field before saving
todoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
todoSchema.index({ userId: 1, createdAt: -1 });
todoSchema.index({ guestId: 1, createdAt: -1 });
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ guestId: 1, completed: 1 });
todoSchema.index({ userId: 1, priority: 1 });
todoSchema.index({ guestId: 1, priority: 1 });

module.exports = mongoose.model('Todo', todoSchema);
