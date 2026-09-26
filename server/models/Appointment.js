const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true, index: true },
  student_name: { type: String, required: true },
  counselor_name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  topic: { type: String, default: 'General Counseling Support' },
  institution: { type: String, default: 'General' },
  meeting_link: { type: String, default: '' },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'], default: 'Confirmed' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
