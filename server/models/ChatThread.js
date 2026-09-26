const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
  analysis: {
    emotion: { type: String },
    severity: { type: Number },
    trigger: { type: String },
    cbt: {
      title: { type: String },
      strategy: { type: String },
      exercise: { type: String }
    }
  }
});

const ChatThreadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  date: { type: Date, default: Date.now },
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.model('ChatThread', ChatThreadSchema);
