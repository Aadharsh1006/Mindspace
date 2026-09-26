require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const { connectDB, isConnected } = require('./config/db');
const User = require('./models/User');
const ChatThread = require('./models/ChatThread');
const Assessment = require('./models/Assessment');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5001;
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://127.0.0.1:5000';

app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// Fallback JSON Directory setup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const ASSESSMENTS_FILE = path.join(DATA_DIR, 'assessments.json');
const CHAT_THREADS_FILE = path.join(DATA_DIR, 'chat_threads.json');

// Helper for JSON read/write fallbacks
const readJSON = (file, defaultData = []) => {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return defaultData;
  }
};

const writeJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('JSON write error:', err.message);
  }
};

// -------------------------------------------------------------
// USER AUTHENTICATION ENDPOINTS (MongoDB + Mongoose)
// -------------------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      age,
      gender,
      institution,
      qualification,
      experience,
      licenseNumber,
      clinicName
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const userId = 'USER_' + Date.now();
      const studentId = role === 'student' ? ('STUDENT_' + Math.floor(1000 + Math.random() * 9000)) : null;
      const counselorId = role === 'counselor' ? ('COUNSELOR_' + Math.floor(100 + Math.random() * 900)) : null;
      const token = 'TOKEN_' + Date.now() + '_' + Math.random().toString(36).substring(2);

      const newUser = await User.create({
        id: userId,
        name,
        email,
        password: hashedPassword,
        role,
        age: age ? Number(age) : null,
        gender: gender || null,
        institution: institution || null,
        qualification: qualification || null,
        experience: experience || null,
        licenseNumber: licenseNumber || null,
        clinicName: clinicName || null,
        student_id: studentId,
        counselor_id: counselorId,
        token
      });

      const userProfile = newUser.toObject();
      if (userProfile.role === 'student' && !userProfile.student_id) {
        userProfile.student_id = userProfile.id;
      }
      delete userProfile.password;
      return res.json({ token, user: userProfile });
    } else {
      const users = readJSON(USERS_FILE);
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const newUser = {
        id: 'USER_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        role,
        age: age ? Number(age) : null,
        gender: gender || null,
        institution: institution || null,
        qualification: qualification || null,
        experience: experience || null,
        licenseNumber: licenseNumber || null,
        clinicName: clinicName || null,
        student_id: role === 'student' ? ('STUDENT_' + Math.floor(1000 + Math.random() * 9000)) : null,
        counselor_id: role === 'counselor' ? ('COUNSELOR_' + Math.floor(100 + Math.random() * 900)) : null,
        token: 'TOKEN_' + Date.now() + '_' + Math.random().toString(36).substring(2)
      };

      users.push(newUser);
      writeJSON(USERS_FILE, users);

      const { password: _, ...userProfile } = newUser;
      if (userProfile.role === 'student' && !userProfile.student_id) {
        userProfile.student_id = userProfile.id;
      }
      res.json({ token: newUser.token, user: userProfile });
    }
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password).catch(() => false) || user.password === password;
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Upgrade plain password if legacy
      if (user.password === password) {
        user.password = await bcrypt.hash(password, 10);
      }

      if (user.role === 'student' && !user.student_id) {
        user.student_id = user.id || ('STUDENT_' + Math.floor(1000 + Math.random() * 9000));
      }

      const token = 'TOKEN_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      user.token = token;
      await user.save();

      const userProfile = user.toObject();
      delete userProfile.password;
      return res.json({ token, user: userProfile });
    } else {
      const users = readJSON(USERS_FILE);
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      let isMatch = false;
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {}
      if (!isMatch && user.password === password) {
        isMatch = true;
        user.password = await bcrypt.hash(password, 10);
      }

      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

      if (user.role === 'student' && !user.student_id) {
        user.student_id = user.id || ('STUDENT_' + Math.floor(1000 + Math.random() * 9000));
      }

      const token = 'TOKEN_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      user.token = token;
      writeJSON(USERS_FILE, users);

      const { password: _, ...userProfile } = user;
      res.json({ token, user: userProfile });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.replace('Bearer ', '');

    if (isConnected()) {
      const user = await User.findOne({ token });
      if (!user) return res.status(401).json({ error: 'Invalid or expired session' });

      const userProfile = user.toObject();
      if (userProfile.role === 'student' && !userProfile.student_id) {
        userProfile.student_id = userProfile.id || userProfile._id;
      }
      delete userProfile.password;
      return res.json({ user: userProfile });
    } else {
      const users = readJSON(USERS_FILE);
      const user = users.find(u => u.token === token);
      if (!user) return res.status(401).json({ error: 'Invalid or expired session' });

      const { password: _, ...userProfile } = user;
      if (userProfile.role === 'student' && !userProfile.student_id) {
        userProfile.student_id = userProfile.id || userProfile._id;
      }
      res.json({ user: userProfile });
    }
  } catch (err) {
    res.status(500).json({ error: 'Session check failed' });
  }
});

// -------------------------------------------------------------
// CHAT CONVERSATION THREADS (MongoDB Mongoose)
// -------------------------------------------------------------

app.get('/api/chats/threads', async (req, res) => {
  try {
    const student_id = req.query.student_id || 'STUDENT_0001';

    if (isConnected()) {
      const threads = await ChatThread.find({ student_id }).sort({ updatedAt: -1 });
      return res.json(threads);
    } else {
      const threads = readJSON(CHAT_THREADS_FILE);
      const userThreads = threads.filter(t => t.student_id === student_id);
      return res.json(userThreads);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat threads' });
  }
});

app.post('/api/chats/threads', async (req, res) => {
  try {
    const { student_id = 'STUDENT_0001', title = 'New Conversation' } = req.body;
    const threadId = 'THREAD_' + Date.now();

    const initialMessage = {
      sender: 'bot',
      text: "Hello! How can I support your mental well-being today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (isConnected()) {
      const newThread = await ChatThread.create({
        id: threadId,
        student_id,
        title,
        date: new Date(),
        messages: [initialMessage]
      });
      return res.json(newThread);
    } else {
      const newThread = {
        id: threadId,
        student_id,
        title,
        date: new Date().toISOString(),
        messages: [initialMessage]
      };
      const threads = readJSON(CHAT_THREADS_FILE);
      threads.unshift(newThread);
      writeJSON(CHAT_THREADS_FILE, threads);
      return res.json(newThread);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat thread' });
  }
});

app.get('/api/chats/threads/:id', async (req, res) => {
  try {
    const threadId = req.params.id;
    const { student_id } = req.query;

    if (isConnected()) {
      const query = { id: threadId };
      if (student_id) query.student_id = student_id;
      const thread = await ChatThread.findOne(query);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      return res.json(thread);
    } else {
      const threads = readJSON(CHAT_THREADS_FILE);
      const thread = threads.find(t => t.id === threadId && (!student_id || t.student_id === student_id));
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      return res.json(thread);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// Chatbot Dialogue Endpoint (MongoDB Mongoose + Python AI Proxy)
app.post('/api/chat', async (req, res) => {
  try {
    const { thread_id = 'THREAD_001', student_id = 'STUDENT_0001', message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    let latestAssessment = null;
    if (isConnected()) {
      latestAssessment = await Assessment.findOne({ student_id }).sort({ createdAt: -1 });
    } else {
      const assessments = readJSON(ASSESSMENTS_FILE);
      const studentAssm = assessments.filter(a => a.student_id === student_id);
      if (studentAssm.length > 0) {
        latestAssessment = studentAssm[studentAssm.length - 1];
      }
    }

    // Predict Emotion, Severity, Trigger via Python AI Microservice
    const aiRes = await axios.post(`${PYTHON_AI_URL}/api/predict_session`, {
      text: message,
      latest_assessment: latestAssessment
    });
    const sessionData = aiRes.data;

    const botMessageText = sessionData.empathetic_response || 
      `I hear you regarding ${sessionData.predicted_trigger.toLowerCase()}. I'm here to support you through this.`;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: message, timestamp };
    const botMsg = {
      sender: 'bot',
      text: botMessageText,
      timestamp,
      analysis: {
        emotion: sessionData.predicted_emotion,
        severity: sessionData.severity_score,
        trigger: sessionData.predicted_trigger,
        cbt: sessionData.cbt_recommendation
      }
    };

    let updatedThread = null;

    if (isConnected()) {
      let thread = await ChatThread.findOne({ id: thread_id });
      if (!thread) {
        thread = new ChatThread({
          id: thread_id,
          student_id,
          title: message.slice(0, 24) + (message.length > 24 ? '...' : ''),
          messages: []
        });
      } else if (thread.title === 'New Conversation' || thread.title === 'New Discussion') {
        thread.title = message.slice(0, 24) + (message.length > 24 ? '...' : '');
      }
      thread.messages.push(userMsg);
      thread.messages.push(botMsg);
      await thread.save();
      updatedThread = thread;
    } else {
      const threads = readJSON(CHAT_THREADS_FILE);
      let thread = threads.find(t => t.id === thread_id);
      if (!thread) {
        thread = { id: thread_id, student_id, title: message.slice(0, 24) + (message.length > 24 ? '...' : ''), date: new Date().toISOString(), messages: [] };
        threads.unshift(thread);
      } else if (thread.title === 'New Conversation' || thread.title === 'New Discussion') {
        thread.title = message.slice(0, 24) + (message.length > 24 ? '...' : '');
      }
      thread.messages.push(userMsg);
      thread.messages.push(botMsg);
      writeJSON(CHAT_THREADS_FILE, threads);
      updatedThread = thread;
    }

    res.json({
      reply: botMessageText,
      emotion: sessionData.predicted_emotion,
      severity: sessionData.severity_score,
      trigger: sessionData.predicted_trigger,
      cbt_recommendation: sessionData.cbt_recommendation,
      thread: updatedThread
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

app.put('/api/chats/threads/:id', async (req, res) => {
  try {
    const threadId = req.params.id;
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title cannot be empty' });

    if (isConnected()) {
      const thread = await ChatThread.findOne({ id: threadId });
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      thread.title = title.trim();
      await thread.save();
      return res.json(thread);
    } else {
      const threads = readJSON(CHAT_THREADS_FILE);
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      thread.title = title.trim();
      writeJSON(CHAT_THREADS_FILE, threads);
      return res.json(thread);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename thread' });
  }
});

app.delete('/api/chats/threads/:id', async (req, res) => {
  try {
    const threadId = req.params.id;

    if (isConnected()) {
      await ChatThread.deleteOne({ id: threadId });
      return res.json({ success: true, message: 'Thread deleted' });
    } else {
      let threads = readJSON(CHAT_THREADS_FILE);
      threads = threads.filter(t => t.id !== threadId);
      writeJSON(CHAT_THREADS_FILE, threads);
      return res.json({ success: true, message: 'Thread deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete thread' });
  }
});

// -------------------------------------------------------------
// ASSESSMENTS & APPOINTMENTS (MongoDB Mongoose)
// -------------------------------------------------------------

app.get('/api/assessments/questions', (req, res) => {
  res.json({
    phq9: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure",
      "Trouble concentrating on things, such as reading or studying",
      "Moving or speaking so slowly that other people have noticed",
      "Thoughts that you would be better off dead, or of hurting yourself"
    ],
    gad7: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen"
    ],
    scoring_options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 }
    ]
  });
});

app.post('/api/assessments', async (req, res) => {
  try {
    const { student_id = 'STUDENT_0001', type, score, answers } = req.body;
    let tier = 'Minimal';
    if (type === 'PHQ-9') {
      if (score >= 20) tier = 'Severe Depression';
      else if (score >= 15) tier = 'Moderately Severe Depression';
      else if (score >= 10) tier = 'Moderate Depression';
      else if (score >= 5) tier = 'Mild Depression';
    } else {
      if (score >= 15) tier = 'Severe Anxiety';
      else if (score >= 10) tier = 'Moderate Anxiety';
      else if (score >= 5) tier = 'Mild Anxiety';
    }

    const recordId = 'ASM_' + Date.now();
    const maxScore = type === 'PHQ-9' ? 27 : 21;

    if (isConnected()) {
      const record = await Assessment.create({
        id: recordId,
        student_id,
        type,
        score,
        max_score: maxScore,
        severity_tier: tier,
        answers,
        date: new Date()
      });
      return res.json({ success: true, record });
    } else {
      const record = {
        id: recordId,
        student_id,
        type,
        score,
        max_score: maxScore,
        severity_tier: tier,
        date: new Date().toISOString()
      };
      const assessments = readJSON(ASSESSMENTS_FILE);
      assessments.push(record);
      writeJSON(ASSESSMENTS_FILE, assessments);
      return res.json({ success: true, record });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment: ' + err.message });
  }
});

app.get('/api/assessments', async (req, res) => {
  try {
    const { student_id } = req.query;
    if (isConnected()) {
      const query = student_id ? { student_id } : {};
      const records = await Assessment.find(query).sort({ date: -1 });
      return res.json(records);
    } else {
      let records = readJSON(ASSESSMENTS_FILE);
      if (student_id) records = records.filter(r => r.student_id === student_id);
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json(records);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// -------------------------------------------------------------
// COUNSELORS & COLLEGE FILTERING ENDPOINTS
// -------------------------------------------------------------

const DEFAULT_COUNSELORS = [
  { id: 'C_GEN_1', name: 'Dr. MindSpace Virtual Desk', title: '24/7 Crisis & Wellness Specialist', institution: 'General', type: 'General Counselor', specialization: 'General Mental Health Support', room: 'Online Tele-Consult' },
  { id: 'C_GEN_2', name: 'National Student Care Desk', title: 'Licensed Youth Therapist', institution: 'General', type: 'General Counselor', specialization: 'Youth & Family Counseling', room: 'Online Video Session' }
];

app.get('/api/counselors', async (req, res) => {
  try {
    const studentCollege = (req.query.institution || '').trim().toLowerCase();
    
    let dbCounselors = [];
    if (isConnected()) {
      dbCounselors = await User.find({ role: 'counselor' }, '-password');
    } else {
      dbCounselors = readJSON(USERS_FILE).filter(u => u.role === 'counselor');
    }

    const allCounselors = [...DEFAULT_COUNSELORS];
    dbCounselors.forEach(c => {
      if (!allCounselors.some(dc => dc.name === c.name)) {
        allCounselors.push({
          id: c.id || c._id,
          name: c.name,
          title: c.qualification || 'Licensed Counselor',
          institution: c.institution || 'General',
          type: (c.institution && c.institution.toLowerCase() !== 'general') ? 'College Counselor' : 'General Counselor',
          specialization: c.experience ? `${c.experience} yrs exp` : 'Student Guidance',
          room: c.clinicName || 'Campus Desk'
        });
      }
    });

    const collegeCounselors = studentCollege ? allCounselors.filter(c => 
      c.institution.toLowerCase() === studentCollege
    ) : [];

    const generalCounselors = allCounselors.filter(c => 
      c.institution.toLowerCase() === 'general' || c.institution.toLowerCase() === 'all colleges'
    );

    res.json({
      college: req.query.institution || 'All Campuses',
      college_counselors: collegeCounselors,
      general_counselors: generalCounselors
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch counselors: ' + err.message });
  }
});

// -------------------------------------------------------------
// APPOINTMENT & SLOT AVAILABILITY ENDPOINTS
// -------------------------------------------------------------

app.get('/api/appointments/booked-slots', async (req, res) => {
  try {
    const { counselor_name, date } = req.query;
    if (!counselor_name || !date) {
      return res.status(400).json({ error: 'counselor_name and date parameters are required' });
    }

    let bookedTimes = [];
    if (isConnected()) {
      const apts = await Appointment.find({
        counselor_name,
        date,
        status: { $ne: 'Cancelled' }
      });
      bookedTimes = apts.map(a => a.time);
    } else {
      const apts = readJSON(APPOINTMENTS_FILE);
      bookedTimes = apts
        .filter(a => a.counselor_name === counselor_name && a.date === date && a.status !== 'Cancelled')
        .map(a => a.time);
    }

    res.json({ counselor_name, date, booked_slots: bookedTimes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booked slots' });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const { student_id, counselor_name, institution, scope = 'all' } = req.query;
    if (isConnected()) {
      let query = {};
      if (student_id) {
        query.student_id = student_id;
      } else if (scope === 'my' && counselor_name) {
        query.counselor_name = { $regex: new RegExp(counselor_name, 'i') };
      } else if (institution && institution.toLowerCase() !== 'general') {
        query.institution = { $regex: new RegExp(institution, 'i') };
      }
      const appointments = await Appointment.find(query).sort({ createdAt: -1 });
      return res.json(appointments);
    } else {
      let appointments = readJSON(APPOINTMENTS_FILE);
      if (student_id) {
        appointments = appointments.filter(a => a.student_id === student_id);
      } else if (scope === 'my' && counselor_name) {
        appointments = appointments.filter(a => a.counselor_name && a.counselor_name.toLowerCase().includes(counselor_name.toLowerCase()));
      } else if (institution && institution.toLowerCase() !== 'general') {
        appointments = appointments.filter(a => a.institution && a.institution.toLowerCase().includes(institution.toLowerCase()));
      }
      return res.json(appointments);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Student Clinical Case File (Full Psychological History for Counselors)
app.get('/api/counselor/student-casefile/:student_id', async (req, res) => {
  try {
    const student_id = req.params.student_id;

    let studentProfile = null;
    let assessments = [];
    let chatThreads = [];
    let appointments = [];

    if (isConnected()) {
      studentProfile = await User.findOne({ $or: [{ student_id }, { id: student_id }] }, '-password');
      assessments = await Assessment.find({ student_id }).sort({ date: -1 });
      chatThreads = await ChatThread.find({ student_id }).sort({ updatedAt: -1 });
      appointments = await Appointment.find({ student_id }).sort({ createdAt: -1 });
    } else {
      const users = readJSON(USERS_FILE);
      studentProfile = users.find(u => u.student_id === student_id || u.id === student_id);
      if (studentProfile) delete studentProfile.password;

      assessments = readJSON(ASSESSMENTS_FILE).filter(a => a.student_id === student_id);
      chatThreads = readJSON(CHAT_THREADS_FILE).filter(t => t.student_id === student_id);
      appointments = readJSON(APPOINTMENTS_FILE).filter(a => a.student_id === student_id);
    }

    res.json({
      student_id,
      profile: studentProfile || { name: student_id, student_id },
      assessments,
      chat_threads_count: chatThreads.length,
      recent_triggers: chatThreads.flatMap(t => t.messages.filter(m => m.analysis).map(m => m.analysis.trigger)).slice(0, 5),
      appointments
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student case file: ' + err.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { student_id = 'STUDENT_0001', student_name = 'Student', counselor_name, date, time, topic, institution = 'SKCET' } = req.body;
    const aptId = 'APT_' + Date.now();
    const counselor = counselor_name || 'Mr. R. Karunamoorthi (Senior Counselor)';
    const defaultTopic = topic || 'General Counseling Support';

    // 1. Conflict Check (Ensure Slot is Not Already Booked)
    let existingBooking = false;
    if (isConnected()) {
      const conflict = await Appointment.findOne({
        counselor_name: counselor,
        date,
        time,
        status: { $ne: 'Cancelled' }
      });
      if (conflict) existingBooking = true;
    } else {
      const apts = readJSON(APPOINTMENTS_FILE);
      existingBooking = apts.some(a => a.counselor_name === counselor && a.date === date && a.time === time && a.status !== 'Cancelled');
    }

    if (existingBooking) {
      return res.status(409).json({
        error: `Slot ${time} on ${date} is already booked for ${counselor}. Please select another time slot.`
      });
    }

    // 2. Create Appointment
    const meetingLink = `https://meet.jit.si/MindSpace_${aptId}`;

    if (isConnected()) {
      const newApt = await Appointment.create({
        id: aptId,
        student_id,
        student_name,
        counselor_name: counselor,
        date,
        time,
        topic: defaultTopic,
        institution,
        meeting_link: meetingLink,
        status: 'Confirmed'
      });
      return res.json({ success: true, appointment: newApt });
    } else {
      const newApt = {
        id: aptId,
        student_id,
        student_name,
        counselor_name: counselor,
        date,
        time,
        topic: defaultTopic,
        institution,
        meeting_link: meetingLink,
        status: 'Confirmed'
      };
      const appointments = readJSON(APPOINTMENTS_FILE);
      appointments.push(newApt);
      writeJSON(APPOINTMENTS_FILE, appointments);
      return res.json({ success: true, appointment: newApt });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment: ' + err.message });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { status, notes, meeting_link } = req.body;
    const aptId = req.params.id;

    if (isConnected()) {
      const apt = await Appointment.findOne({ id: aptId });
      if (!apt) return res.status(404).json({ error: 'Appointment not found' });
      if (status) apt.status = status;
      if (notes !== undefined) apt.notes = notes;
      if (meeting_link !== undefined) apt.meeting_link = meeting_link;
      await apt.save();
      return res.json({ success: true, appointment: apt });
    } else {
      const appointments = readJSON(APPOINTMENTS_FILE);
      const aptIndex = appointments.findIndex(a => a.id === aptId);
      if (aptIndex === -1) return res.status(404).json({ error: 'Appointment not found' });
      if (status) appointments[aptIndex].status = status;
      if (notes !== undefined) appointments[aptIndex].notes = notes;
      if (meeting_link !== undefined) appointments[aptIndex].meeting_link = meeting_link;
      writeJSON(APPOINTMENTS_FILE, appointments);
      return res.json({ success: true, appointment: appointments[aptIndex] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment: ' + err.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const aptId = req.params.id;
    if (isConnected()) {
      const apt = await Appointment.findOne({ id: aptId });
      if (apt) {
        apt.status = 'Cancelled';
        await apt.save();
      }
      return res.json({ success: true, message: 'Appointment cancelled successfully' });
    } else {
      const appointments = readJSON(APPOINTMENTS_FILE);
      const apt = appointments.find(a => a.id === aptId);
      if (apt) apt.status = 'Cancelled';
      writeJSON(APPOINTMENTS_FILE, appointments);
      return res.json({ success: true, message: 'Appointment cancelled successfully' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// -------------------------------------------------------------
// ADMIN MONITORING & USER MANAGEMENT ENDPOINTS
// -------------------------------------------------------------

app.get('/api/admin/metrics', async (req, res) => {
  try {
    let totalUsers = 0;
    let totalStudents = 0;
    let totalCounselors = 0;
    let totalChats = 0;
    let totalAppointments = 0;

    if (isConnected()) {
      totalUsers = await User.countDocuments();
      totalStudents = await User.countDocuments({ role: 'student' });
      totalCounselors = await User.countDocuments({ role: 'counselor' });
      totalChats = await ChatThread.countDocuments();
      totalAppointments = await Appointment.countDocuments();
    } else {
      const users = readJSON(USERS_FILE);
      totalUsers = users.length;
      totalStudents = users.filter(u => u.role === 'student').length;
      totalCounselors = users.filter(u => u.role === 'counselor').length;
      totalChats = readJSON(CHAT_THREADS_FILE).length;
      totalAppointments = readJSON(APPOINTMENTS_FILE).length;
    }

    // Call Python AI for trajectory aggregate distribution
    let trendDistribution = { Improving: 28, Stable: 43, Worsening: 29 };
    try {
      const pythonRes = await axios.get(`${PYTHON_AI_URL}/api/students`);
      const students = pythonRes.data;
      const imp = students.filter(s => s.trend_name === 'Improving').length;
      const sta = students.filter(s => s.trend_name === 'Stable').length;
      const wor = students.filter(s => s.trend_name === 'Worsening').length;
      trendDistribution = { Improving: imp, Stable: sta, Worsening: wor };
    } catch (e) {
      // Use calibrated fallback
    }

    res.json({
      total_users: totalUsers,
      total_students: totalStudents,
      total_counselors: totalCounselors,
      total_chat_threads: totalChats,
      total_appointments: totalAppointments,
      trend_distribution: trendDistribution,
      top_triggers: [
        { trigger: 'Academic Stress', count: 42 },
        { trigger: 'Career & Future', count: 28 },
        { trigger: 'Relationships', count: 21 },
        { trigger: 'Sleep & Health', count: 18 },
        { trigger: 'Social Anxiety', count: 14 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const users = readJSON(USERS_FILE).map(({ password, ...u }) => u);
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user list' });
  }
});

app.get('/api/counselor/triage', async (req, res) => {
  try {
    let registeredStudents = [];
    let assessments = [];

    if (isConnected()) {
      registeredStudents = await User.find({ role: 'student' }, '-password');
      assessments = await Assessment.find().sort({ date: -1 });
    } else {
      registeredStudents = readJSON(USERS_FILE).filter(u => u.role === 'student');
      assessments = readJSON(ASSESSMENTS_FILE);
    }

    const atRiskList = [];
    for (const student of registeredStudents) {
      const studentId = student.student_id || student.id;
      const studentAssm = assessments.filter(a => a.student_id === studentId);
      if (studentAssm.length > 0) {
        const latest = studentAssm[0];
        const isSevere = latest.score >= 12 || (latest.severity_tier && latest.severity_tier.includes('Severe'));
        if (isSevere) {
          atRiskList.push({
            student_id: studentId,
            student_name: student.name,
            institution: student.institution || 'University Campus',
            sequence_length: studentAssm.length,
            trend_name: 'Worsening',
            risk_flag: true,
            latest_severity: (latest.score / (latest.max_score || 27)).toFixed(2)
          });
        }
      }
    }

    res.json(atRiskList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch triage list' });
  }
});

app.listen(PORT, () => {
  console.log(`[+] Express MERN Backend running at http://127.0.0.1:${PORT}`);
});
