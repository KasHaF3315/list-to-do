const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // Source metadata: where the account was created from
  createdFrom: {
    origin: { type: String, default: '' },
    referer: { type: String, default: '' },
    hostname: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    isDevTunnel: { type: Boolean, default: false },
  },
  // Last access metadata
  lastAccess: {
    origin: { type: String, default: '' },
    referer: { type: String, default: '' },
    hostname: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    isDevTunnel: { type: Boolean, default: false },
    at: { type: Date }
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

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
