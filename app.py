import os
from dotenv import load_dotenv
load_dotenv()
import json
import joblib
import torch
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from src.train_model1_emotion import EmotionSeverityClassifier
from src.train_model3_trajectory import BiLSTMTrajectoryModel
from src.chatbot_engine import generate_empathetic_response, detect_conversational_intent

app = Flask(__name__)
CORS(app)

# Load Trained Models & Artifacts
MODEL1_DIR = "models/model1_emotion"
MODEL2_DIR = "models/model2_trigger"
MODEL3_DIR = "models/model3_bilstm"

print("[*] Loading Model 1 (Emotion & Severity Classifier)...")
vec1 = joblib.load(os.path.join(MODEL1_DIR, "tfidf_vectorizer.pkl"))
encoder1 = joblib.load(os.path.join(MODEL1_DIR, "label_encoder.pkl"))
model1 = EmotionSeverityClassifier(input_dim=len(vec1.get_feature_names_out()), num_emotions=len(encoder1.classes_))
model1.load_state_dict(torch.load(os.path.join(MODEL1_DIR, "best_model1.pt")))
model1.eval()

print("[*] Loading Model 2 (Trigger Classifier)...")
vec2 = joblib.load(os.path.join(MODEL2_DIR, "trigger_vectorizer.pkl"))
encoder2 = joblib.load(os.path.join(MODEL2_DIR, "trigger_encoder.pkl"))
try:
    model2 = joblib.load(os.path.join(MODEL2_DIR, "xgboost_trigger_model.pkl"))
    model2_loaded = True
except Exception as e:
    print(f"[!] Warning: Could not unpickle xgboost_trigger_model.pkl: {e}")
    print("[!] Falling back to TF-IDF max feature matching for Trigger Classification.")
    model2 = None
    model2_loaded = False

print("[*] Loading Model 3 (BiLSTM Trajectory Model)...")
model3 = BiLSTMTrajectoryModel(input_dim=17, hidden_dim=64, num_layers=2, num_classes=3)
model3.load_state_dict(torch.load(os.path.join(MODEL3_DIR, "best_model.pt")))
model3.eval()

# Load Simulated Students Database
with open("data/simulated_longitudinal_sequences.json", "r") as f:
    SIMULATED_STUDENTS = json.load(f)

EMOTION_CLASSES = list(encoder1.classes_)
TRIGGER_CLASSES = list(encoder2.classes_)
TREND_NAMES = ['Improving', 'Stable', 'Worsening']

# Trigger CBT Coping Recommendations
CBT_RESOURCES = {
    'Academic': {
        'title': 'Academic Stress Management & Study Pacing',
        'strategy': 'Break large assignments into 25-minute Pomodoro focus blocks. Use active recall and review past exam feedback.',
        'exercise': '5-Minute Mind Dump: Write down all upcoming deadlines, rank by urgency, and clear non-essential tasks.'
    },
    'Relationships/Family': {
        'title': 'Interpersonal Effectiveness & Boundary Setting',
        'strategy': 'Practice DEAR MAN communication technique (Describe, Express, Assert, Reinforce) for tough conversations.',
        'exercise': 'Write a draft message without sending it to clarify your emotional needs before speaking.'
    },
    'Sleep/Health': {
        'title': 'Sleep Hygiene & Somatic Relaxation',
        'strategy': 'Maintain consistent wake time, avoid screen light 60 min before bed, and practice Progressive Muscle Relaxation (PMR).',
        'exercise': '4-7-8 Breathing Technique: Inhale for 4s, hold for 7s, exhale slowly for 8s (repeat 4 times).'
    },
    'Financial': {
        'title': 'Financial Anxiety Relief & Resource Navigation',
        'strategy': 'Schedule a consultation with university financial aid office. Separate essential living expenses from optional spending.',
        'exercise': 'List 3 controllable financial steps for this week to restore a sense of agency.'
    },
    'Career/Future': {
        'title': 'Cognitive Reframing for Career & Future Uncertainty',
        'strategy': 'Challenge catastrophizing thoughts about career progression. Focus on skill acquisition rather than immediate outcome perfection.',
        'exercise': 'Identify 2 alumni or mentors to reach out for informational interviews this month.'
    },
    'Social Anxiety': {
        'title': 'Gradual Social Exposure & Self-Compassion',
        'strategy': 'Notice spotlight effect (others pay far less attention to mistakes than we fear). Practice soft eye contact.',
        'exercise': 'Grounding 5-4-3-2-1: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.'
    },
    'General Stress': {
        'title': 'Behavioral Activation & Grounding Support',
        'strategy': 'Engage in a 15-minute physical walk outside. Focus on controllable present-moment activities.',
        'exercise': 'Mindful Body Scan: Release tension in shoulders, jaw, and forehead for 3 minutes.'
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/students', methods=['GET'])
def get_students():
    """Return list of student profiles for dashboard dropdown."""
    summary = []
    for s in SIMULATED_STUDENTS:
        summary.append({
            'student_id': s['student_id'],
            'sequence_length': s['sequence_length'],
            'trend_name': s['trend_name'],
            'risk_flag': s['risk_flag'],
            'latest_severity': s['sessions'][-1]['severity_score']
        })
    return jsonify(summary)

@app.route('/api/student/<student_id>', methods=['GET'])
def get_student_detail(student_id):
    """Return complete trajectory history for a specific student."""
    for s in SIMULATED_STUDENTS:
        if s['student_id'] == student_id:
            return jsonify(s)
    return jsonify({'error': 'Student not found'}), 404

from src.cognitive_distortions import detect_cognitive_distortion

@app.route('/api/predict_session', methods=['POST'])
def predict_session():
    """Predict emotion, severity, and trigger category for single session text."""
    data = request.json
    text = data.get('text', '').strip()
    if not text:
        return jsonify({'error': 'Empty input text'}), 400
        
    # Model 1 Inference
    feat1 = vec1.transform([text]).toarray().astype(np.float32)
    x1_t = torch.tensor(feat1)
    with torch.no_grad():
        logits1, sev1 = model1(x1_t)
        probs1 = torch.softmax(logits1, dim=1).numpy()[0]
        sev_val = float(sev1.numpy()[0][0])

    # Check for conversational intent or zero-feature inputs (greetings, meta questions, etc.)
    conv_intent = detect_conversational_intent(text)
    is_zero_feat = (feat1.sum() == 0)

    if conv_intent or is_zero_feat:
        pred_emotion = 'Neutral'
        sev_val = 0.05
        pred_trigger = 'General Stress'
        pred_trig_idx = TRIGGER_CLASSES.index('General Stress') if 'General Stress' in TRIGGER_CLASSES else 0
    else:
        pred_emo_idx = int(np.argmax(probs1))
        pred_emotion = EMOTION_CLASSES[pred_emo_idx]
        
        # Model 2 Inference
        feat2 = vec2.transform([text]).toarray()
        if model2_loaded and model2 is not None:
            pred_trig_idx = int(model2.predict(feat2)[0])
        else:
            pred_trig_idx = int(np.argmax(feat2)) % len(TRIGGER_CLASSES) if feat2.sum() > 0 else 0
        pred_trigger = TRIGGER_CLASSES[pred_trig_idx]
    
    # Trigger-specific CBT resource
    cbt_rec = CBT_RESOURCES.get(pred_trigger, CBT_RESOURCES['General Stress'])
    
    latest_assessment = data.get('latest_assessment', None)

    # Cognitive Distortion Detection
    distortion_info = detect_cognitive_distortion(text)
    
    # Generate soothing clinical empathetic response
    bot_dialogue = generate_empathetic_response(text, pred_emotion, sev_val, pred_trigger, latest_assessment=latest_assessment)
    
    # Construct 17-dim vector for potential session addition
    trig_onehot = [0.0] * len(TRIGGER_CLASSES)
    trig_onehot[pred_trig_idx] = 1.0
    
    emo_dict = {EMOTION_CLASSES[i]: round(float(probs1[i]), 4) for i in range(len(EMOTION_CLASSES))}
    
    return jsonify({
        'text': text,
        'predicted_emotion': pred_emotion,
        'severity_score': round(sev_val, 4),
        'predicted_trigger': pred_trigger,
        'cognitive_distortion': distortion_info,
        'emotion_probabilities': emo_dict,
        'cbt_recommendation': cbt_rec,
        'empathetic_response': bot_dialogue,
        'raw_feature_vector': [round(p, 4) for p in probs1.tolist()] + [round(sev_val, 4)] + trig_onehot + [0.5]
    })

@app.route('/api/predict_trajectory', methods=['POST'])
def predict_trajectory():
    """Predict longitudinal trend and risk flag for a sequence of sessions."""
    data = request.json
    sessions = data.get('sessions', [])
    if not sessions or len(sessions) < 2:
        return jsonify({'error': 'Sequence must contain at least 2 sessions'}), 400
        
    seq_len = len(sessions)
    input_dim = 17
    X = np.zeros((1, seq_len, input_dim), dtype=np.float32)
    
    for t, s in enumerate(sessions):
        v = s['emotion_probs'] + [s['severity_score']] + s['trigger_vector'] + [s.get('days_delta', 7) / 14.0]
        if len(v) < input_dim:
            v = v + [0.0] * (input_dim - len(v))
        X[0, t, :] = np.array(v[:input_dim], dtype=np.float32)
        
    X_t = torch.tensor(X)
    L_t = torch.tensor([seq_len])
    
    with torch.no_grad():
        trend_logits, risk_logits = model3(X_t, L_t)
        trend_probs = torch.softmax(trend_logits, dim=1).numpy()[0]
        risk_prob = float(torch.sigmoid(risk_logits).numpy()[0][0])
        
    pred_trend_idx = int(np.argmax(trend_probs))
    pred_trend = TREND_NAMES[pred_trend_idx]
    is_risk = bool(risk_prob >= 0.5 or pred_trend == 'Worsening')
    
    return jsonify({
        'sequence_length': seq_len,
        'predicted_trend': pred_trend,
        'trend_confidence': round(float(trend_probs[pred_trend_idx]), 4),
        'risk_probability': round(risk_prob, 4),
        'escalation_required': is_risk,
        'action_recommended': 'URGENT COUNSELOR ESALATION' if is_risk else 'ROUTINE CHECK-IN / SELF-CARE'
    })

if __name__ == '__main__':
    print("[+] Starting Web UI Dashboard Server at http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
