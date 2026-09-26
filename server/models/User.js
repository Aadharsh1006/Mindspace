const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'counselor', 'admin'], default: 'student' },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  institution: { type: String, default: null },
  qualification: { type: String, default: null },
  experience: { type: String, default: null },
  licenseNumber: { type: String, default: null },
  clinicName: { type: String, default: null },
  student_id: { type: String, default: null },
  counselor_id: { type: String, default: null },
  token: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
