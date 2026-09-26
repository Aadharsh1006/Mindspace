import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable

def build_pdf_guide():
    pdf_filename = "AI_Model_Pitch_and_Technical_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    primary_color = colors.HexColor("#1e1b4b")   # Deep Indigo
    secondary_color = colors.HexColor("#4338ca") # Vibrant Indigo
    accent_color = colors.HexColor("#0284c7")    # Sky Blue
    dark_text = colors.HexColor("#0f172a")       # Dark Slate
    light_bg = colors.HexColor("#f8fafc")        # Soft Slate
    border_color = colors.HexColor("#e2e8f0")    # Slate Border

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=15
    )

    heading1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    heading2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_text,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # -------------------------------------------------------------
    # Document Header & Title Block
    # -------------------------------------------------------------
    story.append(Paragraph("MindCare AI — Technical Pitch & Architecture Guide", title_style))
    story.append(Paragraph("Department of Computer Science & Engineering | Sri Krishna College of Engineering & Technology (SKCET)<br/><b>Project:</b> AI-Powered Digital Psychological Intervention System for College Students", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=secondary_color, spaceBefore=0, spaceAfter=15))

    # -------------------------------------------------------------
    # 1. Pitch Opening
    # -------------------------------------------------------------
    story.append(Paragraph("1. Pitch Opening: Core Problem & Innovation", heading1_style))
    
    pitch_box_content = [
        [Paragraph("<b>The Key Problem:</b> Most existing AI mental health tools (Woebot, Tess, Wysa) process chat messages <i>per-message in isolation</i>. They forget what the student felt last week and fail to detect gradual emotional deterioration before a crisis occurs.", callout_style)],
        [Paragraph("<b>Our Solution & Innovation:</b> We built a <b>Trainable 3-Stage AI System with Cross-Session Memory</b>. It extracts session emotion, severity, and trigger root causes, converts them into privacy-preserving structured feature vectors, and feeds them into a <b>2-Layer PyTorch Bidirectional LSTM (BiLSTM)</b> to predict long-term psychological trend direction—achieving <b>94.0% trend accuracy</b> and <b>100% worsening recall</b> with zero false negatives.", callout_style)]
    ]
    pitch_table = Table(pitch_box_content, colWidths=[532])
    pitch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_bg),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
    ]))
    story.append(pitch_table)
    story.append(Spacer(1, 12))

    # -------------------------------------------------------------
    # 2. Complete End-to-End Execution Pipeline
    # -------------------------------------------------------------
    story.append(Paragraph("2. Complete End-to-End Technical Execution Pipeline", heading1_style))

    # Step 1
    story.append(Paragraph("Step 1: Dataset Acquisition & Preprocessing (data_loader.py)", heading2_style))
    story.append(Paragraph("• <b>Open-Access Benchmarks:</b> Utilized <b>GoEmotions</b> (Google Research: 58,000 fine-grained Reddit comments) and <b>EmpatheticDialogues</b> (Facebook AI: 25,000 empathetic situation exchanges).", bullet_style))
    story.append(Paragraph("• <b>Text Cleaning:</b> Lowercasing, URL stripping, whitespace normalization, and non-linguistic noise removal.", bullet_style))
    story.append(Paragraph("• <b>Weak-Supervision Trigger Taxonomy:</b> Developed a 7-category campus distress taxonomy: <i>Academic</i>, <i>Relationships/Family</i>, <i>Sleep/Health</i>, <i>Financial</i>, <i>Career/Future</i>, <i>Social Anxiety</i>, and <i>General Stress</i>.", bullet_style))
    story.append(Paragraph("• <b>Clinical Severity Derivation (s_t):</b> Continuous severity score in [0.0, 1.0] calibrated against PHQ-9/GAD-7 symptom intensity and distress word frequency.", bullet_style))
    story.append(Paragraph("• <b>Dataset Partitioning:</b> Stratified 80/10/10 split into Training (1,120), Validation (140), and Held-Out Test (140) samples.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 2
    story.append(Paragraph("Step 2: Model 1 — Session Emotion & Severity Classifier (train_model1_emotion.py)", heading2_style))
    story.append(Paragraph("• <b>Goal:</b> Reads single-session text and simultaneously predicts emotion category and continuous severity score.", bullet_style))
    story.append(Paragraph("• <b>Architecture:</b> Fine-tuned dual-head <code>distilbert-base-uncased</code> Neural Network with shared dense representation (256-128) and dropout (0.3/0.2).", bullet_style))
    story.append(Paragraph("• <b>Dual Heads:</b> (1) Softmax Classification Head for 8 emotions, (2) Sigmoid Regression Head for severity score <i>s_t</i>.", bullet_style))
    story.append(Paragraph("• <b>Training & Performance:</b> AdamW optimizer (lr = 1e-3, 25 epochs). Achieved <b>Macro-F1 = 1.0000</b> and <b>Severity MAE = 0.0446</b>.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 3
    story.append(Paragraph("Step 3: Model 2 — Session Trigger Category Classifier (train_model2_trigger.py)", heading2_style))
    story.append(Paragraph("• <b>Goal:</b> Identifies the underlying domain trigger driving the student's emotional distress.", bullet_style))
    story.append(Paragraph("• <b>Architecture:</b> Dense sentence embeddings generated via <code>Sentence-Transformers</code> (<code>all-MiniLM-L6-v2</code>, 384-dim dense semantic vector) fed into a Gradient-Boosted Decision Tree (<code>XGBoost 3.4.0</code> / <code>HistGradientBoostingClassifier</code>, max depth 6, lr = 0.08).", bullet_style))
    story.append(Paragraph("• <b>Why XGBoost?:</b> Gradient-boosted decision trees generalize far better than deep networks on structured, domain-specific weak-supervision data.", bullet_style))
    story.append(Paragraph("• <b>Performance:</b> <b>100.0% Accuracy & F1-score</b> across all 7 campus trigger categories.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 4
    story.append(Paragraph("Step 4: Privacy-Preserving 17-Dim Feature Vectors & Sequence Simulation (simulate_sequences.py)", heading2_style))
    story.append(Paragraph("• <b>Privacy-Preserving Vectorization:</b> Rather than storing raw chat transcripts, each session is converted into a 17-dimensional vector:<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>x_t = [ e_t (8), s_t (1), tr_t (7), delta_t (1) ] in R^17</b><br/>where <b>e_t</b> is 8-dim emotion probability, <b>s_t</b> is severity, <b>tr_t</b> is 7-dim trigger vector, and <b>delta_t</b> is days since previous session.", bullet_style))
    story.append(Paragraph("• <b>RCT-Calibrated Sequence Simulation:</b> Generated 1,000 student trajectories (4–12 sessions each) with score drift calibrated against clinical RCT literature (PHQ-9/GAD-7 weekly shift bounds).", bullet_style))
    story.append(Paragraph("• <b>Ground Truth Distribution:</b> <i>Improving</i> (27.9%), <i>Stable</i> (43.5%), <i>Worsening</i> (28.6%), with 30.0% receiving a crisis <i>Risk Flag</i>.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 5
    story.append(Paragraph("Step 5: Model 3 — Longitudinal Trajectory Predictor (train_model3_trajectory.py)", heading2_style))
    story.append(Paragraph("• <b>Goal:</b> Consumes the sequence of prior session vectors {x_1, ..., x_t} and predicts longitudinal trend direction + emergency risk flag.", bullet_style))
    story.append(Paragraph("• <b>Architecture:</b> PyTorch 2-Layer Bidirectional LSTM (BiLSTM, hidden dim 64, dropout 0.2) with dual linear heads for 3-class trend prediction and binary risk escalation.", bullet_style))
    story.append(Paragraph("• <b>Class Weighting:</b> Trained using weighted cross-entropy loss with weights [1.20, 0.77, 1.16] to prioritize minority worsening cases.", bullet_style))
    story.append(Paragraph("• <b>Empirical Results:</b> <b>94.0% Trend Accuracy</b> (vs 70.0% Session-Only baseline), <b>100% Worsening Recall</b>, <b>0.12 ms Latency</b>, <b>11.82 MB Peak Memory</b>.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 6
    story.append(Paragraph("Step 6: Dynamic Empathetic Dialogue & CBT Intervention Engine (chatbot_engine.py)", heading2_style))
    story.append(Paragraph("• <b>Dynamic Generation:</b> Replaced static repeating text with a dynamic dialogue engine blending active listening reflections, trigger-specific contextual validation, CBT coping strategies, and open-ended follow-up questions.", bullet_style))
    story.append(Spacer(1, 8))

    # Step 7
    story.append(Paragraph("Step 7: Full-Stack MERN Application Delivery (server/ & client/)", heading2_style))
    story.append(Paragraph("• <b>Persistent Authentication (ChatGPT Style):</b> JWT token & user profile saved in browser <code>localStorage</code>. Students stay logged in automatically across sessions without repetitive login screens.", bullet_style))
    story.append(Paragraph("• <b>Student Portal:</b> Interactive AI Chatbot window, PHQ-9 & GAD-7 assessment quiz suite, 4-7-8 animated breathing & Pomodoro coping hub, and counselor booking form.", bullet_style))
    story.append(Paragraph("• <b>Counselor Portal:</b> Administrative triage queue prioritizing students flagged as <i>Worsening</i> by Model 3 for human-in-the-loop counselor outreach.", bullet_style))

    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # 3. System Benchmarks & Summary Table
    # -------------------------------------------------------------
    story.append(Paragraph("3. System Performance & Comparative Benchmark Matrix", heading1_style))

    table_data = [
        [Paragraph("<b>System / Model</b>", body_style), Paragraph("<b>Architecture</b>", body_style), Paragraph("<b>History Memory</b>", body_style), Paragraph("<b>Macro-F1</b>", body_style), Paragraph("<b>Accuracy</b>", body_style), Paragraph("<b>Worsening Recall</b>", body_style), Paragraph("<b>Latency</b>", body_style)],
        [Paragraph("Rule-Based Baseline", body_style), Paragraph("Score Cutoffs", body_style), Paragraph("2-Point Delta", body_style), Paragraph("0.8727", body_style), Paragraph("0.8700", body_style), Paragraph("1.0000", body_style), Paragraph("< 1.0 ms", body_style)],
        [Paragraph("Session-Only Baseline", body_style), Paragraph("DistilBERT + XGBoost", body_style), Paragraph("No Trajectory Layer", body_style), Paragraph("0.7088", body_style), Paragraph("0.7000", body_style), Paragraph("1.0000", body_style), Paragraph("< 2.0 ms", body_style)],
        [Paragraph("Guided-CBT (Cook [5])", body_style), Paragraph("Fixed Assessment", body_style), Paragraph("Fixed Timepoint", body_style), Paragraph("0.9026", body_style), Paragraph("0.9000", body_style), Paragraph("1.0000", body_style), Paragraph("< 1.0 ms", body_style)],
        [Paragraph("Transformer Variant", body_style), Paragraph("Transformer Encoder", body_style), Paragraph("Multi-Head Sequence", body_style), Paragraph("0.9199", body_style), Paragraph("0.9200", body_style), Paragraph("1.0000", body_style), Paragraph("3.20 ms", body_style)],
        [Paragraph("<b>Proposed Framework</b>", body_style), Paragraph("<b>DistilBERT+XGBoost+BiLSTM</b>", body_style), Paragraph("<b>Cross-Session Record</b>", body_style), Paragraph("<b>0.9381</b>", body_style), Paragraph("<b>0.9400 (94%)</b>", body_style), Paragraph("<b>1.0000 (100%)</b>", body_style), Paragraph("<b>0.12 ms</b>", body_style)]
    ]

    benchmark_table = Table(table_data, colWidths=[100, 100, 85, 55, 65, 75, 52])
    benchmark_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#e0e7ff")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    
    # Force table header colors to white text
    for col in range(len(table_data[0])):
        table_data[0][col] = Paragraph(f"<font color='white'><b>{table_data[0][col].text}</b></font>", body_style)

    story.append(benchmark_table)
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # 4. Evaluator Q&A Cheat Sheet
    # -------------------------------------------------------------
    story.append(Paragraph("4. Evaluator Q&A Cheat Sheet", heading1_style))

    qa_items = [
        ("Q1: Why use a BiLSTM for Model 3 instead of a Transformer?",
         "We evaluated both BiLSTM and Transformer Encoder variants. The BiLSTM achieved higher trend accuracy (94.0% vs 92.0%) with lower computational latency (0.12 ms vs 3.20 ms) and superior stability on structured 17-dimensional record sequences."),
        ("Q2: How does the system protect student privacy?",
         "Instead of storing raw text transcripts over weeks, our framework converts each session into an anonymous 17-dimensional vector representing emotion probabilities, severity, trigger category, and timeframe—ensuring zero raw conversation logging."),
        ("Q3: Does the AI model replace professional human counselors?",
         "No. The system acts strictly as decision support. Final judgment on crisis escalation rests with licensed human counselors through our human-in-the-loop triage portal.")
    ]

    for q, a in qa_items:
        story.append(Paragraph(f"<b>{q}</b>", heading2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    doc.build(story)
    print(f"[+] Successfully generated PDF: {pdf_filename}")

if __name__ == "__main__":
    build_pdf_guide()
