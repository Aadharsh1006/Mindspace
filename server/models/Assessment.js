const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true, index: true },
  type: { type: String, enum: ['PHQ-9', 'GAD-7'], required: true },
  score: { type: Number, required: true },
  max_score: { type: Number, required: true },
  severity_tier: { type: String, required: true },
  answers: { type: Object },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
