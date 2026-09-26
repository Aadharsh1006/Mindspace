# MindSpace 🧠

MindSpace is a comprehensive, AI-empowered mental health and counseling web application tailored for higher-education campuses and general mental wellness support.

## 🚀 Key Features

1. **AI Chatbot Companion:** Dual clinical & casual intent handling backed by Google Gemini 2.5/4 (`gemma-4-26b-a4b-it`) and custom BiLSTM emotion classification models.
2. **Interactive Coping Hub:** 
   - 5-4-3-2-1 Grounding Wizard
   - State-Based 5 Comfort Steps Generator
   - 4-7-8 Deep Breathing Timer
   - Ambient Soundscapes Player
3. **Student Clinical Assessment:** Clinical screening tools with score history tracking.
4. **Counselor Portal & Booking Engine:**
   - Multi-college open enrollment (College Counselors & General Counselors).
   - Real-time double-booking prevention & conflict resolution.
   - Privacy-enforced counselor dashboard (counselors only see assigned appointments).
   - Student Clinical Case File drawer & progress notes.

## 🛠 Tech Stack

- **Frontend:** React, Vite, CSS Modules / Lucide Icons
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose
- **AI Microservice:** Python, Flask, Gunicorn, PyTorch, Google GenAI SDK

## 🌐 Hosting & Deployment

- **Frontend:** Vercel
- **Backends:** Render (`mindspace-express-backend` & `mindspace-python-ai`)
