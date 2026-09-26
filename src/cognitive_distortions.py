import re

DISTORTION_PATTERNS = [
    {
        'id': 'catastrophizing',
        'name': 'Catastrophizing (Expecting the Worst)',
        'keywords': [r'\bruined\b', r'\bdisaster\b', r'\bdestroyed\b', r'\bnever get\b', r'\beverything is over\b', r'\bworst possible\b', r'\bhopeless\b', r'\bfailed everything\b'],
        'gentle_explanation': "Notice how your mind might be jumping straight to the worst-case outcome.",
        'reframe_question': "If we take one gentle step back: what is one realistic outcome that is calmer and more balanced?",
        'soothing_followup': "Take a soft breath with me. Would you like us to explore one more soothing perspective or try a calming breathing exercise together?"
    },
    {
        'id': 'all_or_nothing',
        'name': 'All-or-Nothing Thinking',
        'keywords': [r'\balways\b', r'\bnever\b', r'\bcompletely failed\b', r'\btotal mess\b', r'\bnobody likes\b', r'\beveryone hates\b', r'\btotal failure\b'],
        'gentle_explanation': "It sounds like things feel black-and-white right now, where anything less than perfect feels like a complete setback.",
        'reframe_question': "Could there be a middle ground here where you give yourself grace for being human?",
        'soothing_followup': "You don't have to carry this perfection pressure. Would you like to try one more gentle grounding exercise, or share what's on your mind?"
    },
    {
        'id': 'emotional_reasoning',
        'name': 'Emotional Reasoning (Feeling = Fact)',
        'keywords': [r'\bfeel like a failure\b', r'\bfeel stupid\b', r'\bfeel hopeless\b', r'\bfeel useless\b', r'\bfeel incompetent\b'],
        'gentle_explanation': "Remember that intense feelings are very real, but feeling overwhelmed doesn't mean you are a failure.",
        'reframe_question': "What is one strength or act of kindness you've shown recently that proves your worth?",
        'soothing_followup': "Your feelings are valid, but they do not define who you are. Would you like another comforting exercise to soothe your mind?"
    },
    {
        'id': 'personalization',
        'name': 'Self-Blame & Personalization',
        'keywords': [r'\ball my fault\b', r'\bi ruined\b', r'\bi am to blame\b', r'\bi failed everyone\b', r'\bi should have known\b'],
        'gentle_explanation': "You seem to be taking all the weight onto your own shoulders.",
        'reframe_question': "What external factors or pressures also contributed to this situation that weren't entirely in your control?",
        'soothing_followup': "Be gentle with yourself right now. Would you like us to try another soothing practice together to release this heavy pressure?"
    }
]

def detect_cognitive_distortion(text):
    """
    Detect cognitive distortions in text and return soothing CBT reframing guidance.
    """
    text_lower = text.lower()
    for item in DISTORTION_PATTERNS:
        for pattern in item['keywords']:
            if re.search(pattern, text_lower):
                return {
                    'detected': True,
                    'type': item['id'],
                    'name': item['name'],
                    'explanation': item['gentle_explanation'],
                    'reframe_question': item['reframe_question'],
                    'soothing_followup': item['soothing_followup']
                }
                
    # Default soothing fallback if no explicit pattern matched
    return {
        'detected': False,
        'type': 'general',
        'name': 'Gentle Reflective Listening',
        'explanation': "Take a slow, gentle breath. You don't have to face this all at once.",
        'reframe_question': "What is one tiny, comforting thing you can do for yourself in this moment?",
        'soothing_followup': "I am right here with you. Would you like to try another calming grounding exercise, or explore one more helpful perspective?"
    }

if __name__ == "__main__":
    print(detect_cognitive_distortion("I failed my midterm exam and everything is ruined!"))
