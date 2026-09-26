import os
import random
import re
from src.cognitive_distortions import detect_cognitive_distortion

# Try importing google.generativeai or google.genai for LLM generation
GENAI_AVAILABLE = False
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception:
    pass

GREETING_PATTERNS = [
    r'^(hi+|hello+|hey+|hii+|hiii+|good\s+morning|good\s+afternoon|good\s+evening|greetings|yo+|sup)$',
    r'^(hi\s+there|hello\s+there|hey\s+there|good\s+day)$'
]

HOW_ARE_YOU_PATTERNS = [
    r'(how\s+are\s+you|how\s+are\s+u|how\s+is\s+it\s+going|hows\s+it\s+going|what\s*s\s+up|wbu|how\s+have\s+you\s+been|how\s+is\s+your\s+day|hows\s+your\s+day)'
]

META_PATTERNS = [
    r'(who\s+are\s+you|what\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|how\s+do\s+you\s+work)',
    r'(are\s+you\s+an?\s+ai|are\s+you\s+a\s+bot|what\s+is\s+mindspace)'
]

GRATITUDE_PATTERNS = [
    r'^(thanks|thank\s+you|thank\s+u|thx|appreciate\s+it|that\s+helped|thank\s+you\s+so\s+much)$'
]

CASUAL_STATUS_PATTERNS = [
    r'^(i\s*m?\s*o\s*k|im?\s+okay|doing\s+ok|doing\s+fine|all\s+good|doing\s+good|i\s+am\s+fine|not\s+bad|just\s+chilling|watching\s+tv)$'
]

HOW_ARE_YOU_RESPONSES = [
    "I'm doing great, thank you for asking! 😊 I'm right here and ready to chat. How is your day going so far?",
    "I'm doing really well! Thanks for checking in. How are things on your end today?",
    "I'm feeling good and ready to support you! What's on your mind today?"
]

GREETING_RESPONSES = [
    "Hello! I'm your MindSpace AI companion. How are you feeling today? You can talk to me about anything — whether it's academic life, general chat, or whatever is on your mind.",
    "Hi there! Welcome. How are you doing today?",
    "Hey! I'm glad you reached out. How has your day been treating you?"
]

META_RESPONSES = [
    "I am your MindSpace AI Mental Wellness Companion. I'm here to chat, listen empathetically, help reframe stressful thoughts, and support your well-being in a safe space.",
    "I'm an AI assistant trained to support student mental well-being and offer friendly conversation. You can talk to me about daily life, stress, relationships, or anything you'd like!"
]

GRATITUDE_RESPONSES = [
    "You're very welcome! Remember to take it easy on yourself today.",
    "I'm really glad I could help! I'm always right here whenever you want to chat.",
    "Anytime! Take care of yourself."
]

CASUAL_RESPONSES = [
    "That's great to hear! Is there anything fun or interesting happening in your day, or would you just like to relax and chat?",
    "Glad to hear things are going okay. Remember to give yourself moments to recharge. How can I best help you right now?"
]

SOOTHING_REFLECTIONS = {
    'Sadness': [
        "Take a slow, gentle breath with me right now. I hear how heavy and draining things feel on your heart.",
        "It sounds like you are carrying a really painful moment right now, and I want to validate how exhausting that must be.",
        "Thank you for trusting me with what's on your heart. Experiencing this sadness can feel deeply draining, and you don't have to carry it all alone."
    ],
    'Anxiety': [
        "I hear the tension and racing thoughts in what you're sharing. Let's take a slow, gentle breath together.",
        "Feeling anxious and on edge can make even small moments feel overwhelming. You are safe here.",
        "It makes complete sense that your mind is spinning right now. Take your time—there is no rush."
    ],
    'Overwhelm': [
        "It sounds like everything is piling up all at once, and it's completely natural to feel exhausted.",
        "When life's pressures reach a peak, even small steps can feel overwhelming. Take a moment to just pause."
    ],
    'Anger': [
        "I hear how frustrating and unfair this situation feels. It is completely natural to feel intense irritation.",
        "Your anger and frustration are completely understandable given what you've had to deal with."
    ],
    'Guilt/Shame': [
        "Please be extra gentle with yourself right now. We are so often our own harshest critics.",
        "Holding onto feelings of guilt can be an incredible weight to carry. You deserve self-compassion."
    ],
    'Social Anxiety': [
        "Social pressure and worrying about how others perceive us can be so emotionally exhausting.",
        "I hear how uncomfortable and nerve-wracking that situation felt for you. That fear of judgment is very real."
    ],
    'Joy/Hope': [
        "That is so wonderful to hear! I'm truly glad you're experiencing this moment of relief and hope.",
        "Celebrating these brighter moments is such a meaningful way to honor your resilience."
    ],
    'Neutral': [
        "Thank you for sharing that with me. I am right here listening with warmth and care.",
        "I hear you. Let's explore this together at your pace."
    ]
}

SOOTHING_TRIGGER_CONTEXT = {
    'Academic': [
        "Academic pressure and non-stop deadlines can make it feel like you can't catch your breath.",
        "Coursework expectations bring heavy pressure, but remember your grades never define your intrinsic human worth."
    ],
    'Relationships/Family': [
        "Relationship struggles and family conflicts touch our deepest, most vulnerable emotions.",
        "When things feel strained with people close to us, it can cast a shadow over our entire day."
    ],
    'Sleep/Health': [
        "When your body is exhausted and sleep is disrupted, every emotional challenge feels ten times harder.",
        "Physical fatigue can really amplify worry and sadness. Rest is essential for healing."
    ],
    'Financial': [
        "Financial uncertainty and living expenses bring intense, persistent daily stress."
    ],
    'Career/Future': [
        "Uncertainty about jobs, internships, or what comes next can feel daunting and overwhelming."
    ],
    'Social Anxiety': [
        "Navigating crowds, public speaking, or peer settings can trigger intense emotional discomfort."
    ],
    'General Stress': [
        "Life asks us to balance so many competing demands all at once.",
        "When general stress accumulates, taking a quiet pause to breathe is essential."
    ]
}

FOLLOWUP_SOOTHING_OFFERS = [
    "Would you like us to try a gentle grounding exercise together, or explore one more soothing perspective?",
    "How does it feel to share this? Would you like to keep talking at your own pace?",
    "If you'd like, we can try a comforting exercise to help settle your mind. What feels best for you right now?"
]

SCORE_PATTERNS = [
    r'(score|phq|gad|test\s+result|assessment\s+result|depression\s+score|anxiety\s+score|how\s+did\s+i\s+do|my\s+results)'
]

def detect_conversational_intent(user_text):
    text_clean = user_text.strip().lower()
    text_clean_nopunct = re.sub(r'[^\w\s]', '', text_clean)

    for p in SCORE_PATTERNS:
        if re.search(p, text_clean) or re.search(p, text_clean_nopunct):
            return 'score_inquiry'

    for p in HOW_ARE_YOU_PATTERNS:
        if re.search(p, text_clean) or re.search(p, text_clean_nopunct):
            return 'how_are_you'

    for p in GREETING_PATTERNS:
        if re.search(p, text_clean) or re.search(p, text_clean_nopunct):
            return 'greeting'

    for p in META_PATTERNS:
        if re.search(p, text_clean):
            return 'meta'

    for p in GRATITUDE_PATTERNS:
        if re.search(p, text_clean) or re.search(p, text_clean_nopunct):
            return 'gratitude'

    for p in CASUAL_STATUS_PATTERNS:
        if re.search(p, text_clean) or re.search(p, text_clean_nopunct):
            return 'casual'

    return None

def generate_llm_response(user_text, emotion, severity, trigger, latest_assessment=None):
    """Generate response using Google GenAI SDK if API key is present."""
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        return None

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        assm_str = "No formal assessment taken yet."
        if latest_assessment:
            a_type = latest_assessment.get('type', 'PHQ-9')
            a_score = latest_assessment.get('score', 0)
            a_max = latest_assessment.get('max_score', 27)
            a_tier = latest_assessment.get('severity_tier', 'Minimal')
            assm_str = f"Type: {a_type}, Score: {a_score}/{a_max}, Severity Tier: {a_tier}"

        prompt = f"""You are Dr. MindSpace, a licensed Senior Clinical Psychologist, Doctor of Psychological Support, and therapeutic guide for university students.

User Message: "{user_text}"

Internal Student Clinical Context:
- Predicted Emotion: {emotion}
- Distress Severity Index: {severity} (0.0 = calm/casual, 1.0 = acute distress)
- Primary Life Trigger: {trigger}
- Student's Latest Assessment Record: {assm_str}

Clinical Persona & Guidelines:
1. Speak with the professional warmth, deep empathy, and therapeutic authority of a compassionate mental health doctor.
2. CRITICAL RULE FOR ASSESSMENT SCORES:
   - Hold the student's assessment record ({assm_str}) in your internal context.
   - ONLY mention, state, or analyze their depression/anxiety score or assessment results if the student explicitly asks about their score, test results, PHQ-9/GAD-7, or assessment in their message.
   - If they DO ask about their score/results, provide a professional, reassuring clinical explanation of what their score ({assm_str}) means and offer supportive guidance.
3. For Casual Chatter & Greetings ("hi", "how are you", "what's up", "good morning"):
   - Respond naturally, warmly, and concisely (1-2 sentences) like a friendly, caring doctor/companion.
   - Do NOT preach, force breathing exercises, or use heavy crisis templates.
4. For Genuine Emotional Distress, Anxiety, Heartbreak, or Stress:
   - Offer deep therapeutic validation, gentle cognitive reframing (CBT), and an open, comforting question to help them process their thoughts safely.
"""
        response = client.models.generate_content(
            model='gemma-4-26b-a4b-it',
            contents=prompt
        )
        if response and response.text:
            return response.text.strip()
    except Exception as e:
        print(f"[!] GenAI LLM generation error: {e}")

    return None

def generate_empathetic_response(user_text, emotion, severity, trigger, latest_assessment=None, turn_count=1):
    # Try LLM generation first if API key configured
    llm_reply = generate_llm_response(user_text, emotion, severity, trigger, latest_assessment=latest_assessment)
    if llm_reply:
        return llm_reply

    # Local Hybrid Intent Routing Fallback
    intent = detect_conversational_intent(user_text)

    if intent == 'score_inquiry':
        if latest_assessment:
            a_type = latest_assessment.get('type', 'PHQ-9')
            a_score = latest_assessment.get('score', 0)
            a_max = latest_assessment.get('max_score', 27)
            a_tier = latest_assessment.get('severity_tier', 'Minimal')
            return f"According to your latest {a_type} mental health assessment, your score was {a_score}/{a_max}, which falls in the '{a_tier}' range. How have you been feeling since taking that assessment?"
        else:
            return "You haven't completed a PHQ-9 or GAD-7 assessment yet in this session. You can take a quick 2-minute assessment anytime from the left menu under 'Assessment'!"

    if intent == 'how_are_you':
        return random.choice(HOW_ARE_YOU_RESPONSES)
    elif intent == 'greeting':
        return random.choice(GREETING_RESPONSES)
    elif intent == 'meta':
        return random.choice(META_RESPONSES)
    elif intent == 'gratitude':
        return random.choice(GRATITUDE_RESPONSES)
    elif intent == 'casual':
        return random.choice(CASUAL_RESPONSES)

    # For low severity inputs (< 0.35) without explicit distress keywords, respond conversationally
    if severity <= 0.35 and emotion in ['Neutral', 'Joy/Hope']:
        return f"Thank you for sharing that with me! I'm right here listening. How is the rest of your day shaping up?"

    reflections = SOOTHING_REFLECTIONS.get(emotion, SOOTHING_REFLECTIONS['Neutral'])
    contexts = SOOTHING_TRIGGER_CONTEXT.get(trigger, SOOTHING_TRIGGER_CONTEXT['General Stress'])
    
    reflection = random.choice(reflections)
    context = random.choice(contexts)
    
    distortion = detect_cognitive_distortion(user_text)
    followup_offer = random.choice(FOLLOWUP_SOOTHING_OFFERS)

    if severity > 0.70:
        return f"{reflection} {context} {distortion['explanation']} {distortion['reframe_question']} {followup_offer}"
    elif severity > 0.40:
        return f"{reflection} {context} {distortion['explanation']} {distortion['reframe_question']} {followup_offer}"
    else:
        if emotion == 'Joy/Hope':
            return f"{reflection} It's wonderful to feel your positive energy around {trigger.lower()}. What helped bring this sense of hope for you today?"
        return f"{reflection} {context} {distortion['reframe_question']}"


if __name__ == "__main__":
    print(generate_empathetic_response("I failed my midterm exam and everything is ruined!", "Anxiety", 0.75, "Academic"))

