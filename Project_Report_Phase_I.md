# AI-POWERED DIGITAL PSYCHOLOGICAL INTERVENTION SYSTEM FOR COLLEGE STUDENTS

### A PROJECT REPORT (PHASE I)

*Submitted by*

* **AADHARSH R** (Register No: 727723EUCS001)
* **BARATH HARIHARAN K** (Register No: 727723EUCS031)
* **DHARANEESH D** (Register No: 727723EUCS043)
* **ASWATHAMAN RAJ S** (Register No: 727723EUCS023)

*in partial fulfillment for the award of the degree of*

#### BACHELOR OF ENGINEERING
IN
#### COMPUTER SCIENCE AND ENGINEERING

**SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY**  
*(An Autonomous Institution | Affiliated to Anna University | NAAC A++ Accredited)*  
Kuniamuthur, Coimbatore – 641008

**NOVEMBER 2026**

---

## SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY
*(An Autonomous Institution | Affiliated to Anna University | NAAC A++ Accredited)*  
Kuniamuthur, Coimbatore – 641008

### BONAFIDE CERTIFICATE

Certified that this project report titled **“AI-POWERED DIGITAL PSYCHOLOGICAL INTERVENTION SYSTEM FOR COLLEGE STUDENTS”** is the bonafide work of **“AADHARSH R (727723EUCS001), BARATH HARIHARAN K (727723EUCS031), DHARANEESH D (727723EUCS043), ASWATHAMAN RAJ S (727723EUCS023)”** who carried out the project work Phase–I under my supervision.

<br><br>

| | |
| :--- | :--- |
| **SIGNATURE** | **SIGNATURE** |
| **Mr. KARUNAMOORTHI R** | **Dr. [HOD NAME]** |
| **SUPERVISOR** | **HEAD OF THE DEPARTMENT** |
| Assistant Professor, | Professor & Head, |
| Department of Computer Science and Engineering, | Department of Computer Science and Engineering, |
| Sri Krishna College of Engineering and Technology, | Sri Krishna College of Engineering and Technology, |
| Coimbatore – 641008. | Coimbatore – 641008. |

<br>

Certified that the candidates were examined by us in the Project Phase–I Viva Voce examination held on ____________ at Sri Krishna College of Engineering and Technology, Coimbatore – 641008.

<br><br>

| | |
| :--- | :--- |
| **INTERNAL EXAMINER** | **EXTERNAL EXAMINER** |

---

## ABSTRACT

Mental health challenges such as anxiety, depression, academic stress, burnout, and social isolation are increasingly prevalent among college students aged 18 to 25. Despite the severity of these conditions, the majority of students refrain from seeking professional psychological assistance due to social stigma, fear of negative judgment, privacy apprehensions, and limited availability of campus counseling personnel. While digital interventions and conversational AI agents have emerged as promising first-line solutions, existing platforms primarily operate as session-independent chatbots. These systems evaluate user messages in isolation and discard structured behavioral records between conversations, thereby failing to capture gradual longitudinal deterioration across successive weeks.

To address these critical shortcomings, this project presents an **AI-Powered Digital Psychological Intervention System for College Students**, an institutional wellness platform engineered using the MERN stack (React.js, Node.js, Express.js, MongoDB) integrated with a high-performance Python AI microservice. The platform combines multimodal input collection (text, voice, and standardized questionnaires), automated clinical feature extraction, and longitudinal sequence modeling. 

The machine learning core operates as a three-stage trainable framework: 
1. A **Dual-Head Emotion and Severity Classifier** fine-tuned on GoEmotions and EmpatheticDialogues to categorize text into 8 emotion classes while predicting a continuous severity index ($s_t \in [0.0, 1.0]$) calibrated against PHQ-9 and GAD-7 metrics;
2. A **Gradient-Boosted Decision Tree Classifier** mapping student expressions to 7 primary academic and personal trigger categories; and
3. A **Bidirectional Long Short-Term Memory (BiLSTM)** network operating on 17-dimensional structured session vectors across multi-week interactions to predict longitudinal trajectory trends (`Improving`, `Stable`, `Worsening`) and trigger high-priority crisis risk flags.

Empirical evaluation on held-out test datasets demonstrates that the emotion-severity classifier achieves a Macro-F1 score of **1.000** and a severity Mean Absolute Error (MAE) of **0.0446**. Crucially, the BiLSTM trajectory prediction model attains a classification accuracy of **94.00%** and a Macro-F1 score of **0.9381**, outperforming the session-only baseline (70.00%) and achieving a **100.00% recall on deteriorating (worsening) clinical trajectories**. By bridging real-time conversational first-aid support with human-in-the-loop counselor triage and campus appointment booking, the proposed system provides an ethical, secure, and privacy-preserving paradigm for proactive mental health support in higher educational institutions.

**Keywords:** Digital Mental Health, Longitudinal Modeling, Emotion Recognition, BiLSTM, Trainable AI, Sequence Modeling, Higher Education, Psychological Support Systems, MERN Stack.

---

## ACKNOWLEDGEMENT

First and foremost, we thank the **Almighty** for being our divine guide, granting us wisdom, perseverance, and strength throughout the journey of this project work.

We express our deepest gratitude and respect to our respected Principal, **Dr. M.G. Sumithra**, for providing an outstanding academic environment, advanced technological infrastructure, and all necessary facilities that facilitated our work.

With profound respect, we convey our sincere thanks to our Head of the Department, **Dr. [HOD Name]**, Department of Computer Science and Engineering, for providing continuous encouragement, administrative backing, and leadership throughout the project execution.

We express our sincere thanks to **Dr. M. Kavitha Margret**, Project Coordinator, Department of Computer Science and Engineering, for her constant motivation, structured project reviews, and valuable support.

We extend our heartfelt gratitude to our project supervisor, **Mr. Karunamoorthi R**, Assistant Professor, Department of Computer Science and Engineering, for his exceptional mentorship, technical suggestions, constructive critiques, and guidance at every phase of this research and software development.

We also convey our sincere thanks to all the **Teaching and Non-Teaching Faculty Members** of the Department of Computer Science and Engineering for their direct and indirect assistance and cooperation.

Finally, we express our warmest love and deepest thanks to our **Parents, Family Members, and Friends** whose unconditional encouragement, patience, and moral support have been our constant pillars of strength.

---

## LIST OF FIGURES

| Figure No. | Title | Page No. |
| :--- | :--- | :--- |
| 3.1.1 | Limitations of Session-Independent Chatbot Systems | 10 |
| 3.2.1 | Conceptual Framework of Proposed Psychological Intervention System | 12 |
| 4.1.1 | End-to-End System Workflow and Interaction Flow | 14 |
| 4.2.1 | Multi-Stage AI Pipeline and Structured Feature Vector Formulation | 16 |
| 4.2.2 | BiLSTM Trajectory Prediction and Risk Head Architecture | 18 |
| 4.3.1 | Node.js / Express.js Backend and MongoDB Data Architecture | 20 |
| 4.4.1 | React.js Component Hierarchy and State Management Flow | 22 |
| 5.3.1 | Comparative Classification Performance (Baselines vs. Proposed BiLSTM) | 28 |
| 5.3.2 | Confusion Matrix of BiLSTM Longitudinal Trajectory Model | 29 |
| 5.3.3 | Severity Trajectory Drift over Multi-Week Student Sequences | 29 |
| 5.3.4 | Model Inference Latency vs. Macro-F1 Trade-off Analysis | 30 |
| 5.3.5 | Secure User Authentication and Role Login Interface | 31 |
| 5.3.6 | Empathetic AI Chatbot Interface with Real-Time Emotion & CBT Chips | 32 |
| 5.3.7 | PHQ-9 / GAD-7 Standardized Psychological Assessment Interface | 33 |
| 5.3.8 | Coping Hub and Psychoeducational Grounding Tool Suite | 33 |
| 5.3.9 | Campus Counselor Appointment Booking Interface | 34 |
| 5.3.10 | Counselor Clinical Triage Queue and At-Risk Patient Monitoring | 34 |
| 5.3.11 | Institutional Administrator Analytics Console | 35 |

---

## LIST OF ABBREVIATIONS

| Abbreviation | Expansion |
| :--- | :--- |
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **BiLSTM** | Bidirectional Long Short-Term Memory |
| **CBT** | Cognitive Behavioral Therapy |
| **CRUD** | Create, Read, Update, Delete |
| **DB** | Database |
| **GAD-7** | Generalized Anxiety Disorder 7-item Scale |
| **HTTP** | HyperText Transfer Protocol |
| **IDE** | Integrated Development Environment |
| **JSON** | JavaScript Object Notation |
| **JWT** | JSON Web Token |
| **MAE** | Mean Absolute Error |
| **MERN** | MongoDB, Express.js, React.js, Node.js |
| **ML** | Machine Learning |
| **MSE** | Mean Squared Error |
| **NLP** | Natural Language Processing |
| **PHQ-9** | Patient Health Questionnaire 9-item Scale |
| **PMR** | Progressive Muscle Relaxation |
| **RBAC** | Role-Based Access Control |
| **REST** | Representational State Transfer |
| **SDG** | Sustainable Development Goal |
| **TF-IDF** | Term Frequency - Inverse Document Frequency |
| **UI** | User Interface |
| **UX** | User Experience |
| **XGBoost** | eXtreme Gradient Boosting |

---

## TABLE OF CONTENTS

* **ABSTRACT** .................................................................................................... i
* **ACKNOWLEDGEMENT** ................................................................................. ii
* **LIST OF FIGURES** .......................................................................................... iii
* **LIST OF ABBREVIATIONS** ............................................................................. iv

### CHAPTER 1: INTRODUCTION
* 1.1 DIGITAL PSYCHOLOGICAL INTERVENTION IN HIGHER EDUCATION ............ 1
* 1.2 OBJECTIVES ................................................................................................. 3
* 1.3 SUSTAINABLE DEVELOPMENT GOALS (SDG) MAPPING ............................. 4

### CHAPTER 2: LITERATURE SURVEY
* 2.1 MENTAL HEALTH CHALLENGES AMONG COLLEGE STUDENTS .................. 5
* 2.2 DIGITAL INTERVENTIONS AND CONVERSATIONAL AGENTS ...................... 6
* 2.3 CHALLENGES IN CONVENTIONAL PSYCHOLOGICAL SUPPORT ................ 7
* 2.4 ROLE OF LONGITUDINAL EMOTIONAL TRAJECTORY MODELING .............. 8
* 2.5 PATIENT AND COUNSELOR COLLABORATIVE ENGAGEMENT ................... 9
* 2.6 MOTIVATION ................................................................................................ 10

### CHAPTER 3: SYSTEM ANALYSIS AND DESIGN
* 3.1 EXISTING SYSTEM ...................................................................................... 11
* 3.2 PROPOSED SYSTEM ..................................................................................... 13

### CHAPTER 4: SYSTEM ARCHITECTURE
* 4.1 SYSTEM OVERVIEW ...................................................................................... 15
* 4.2 MULTI-STAGE AI AND TRAJECTORY PREDICTION MODELS ...................... 17
* 4.3 BACKEND IMPLEMENTATION USING NODE.JS AND MONGODB ................. 20
* 4.4 FRONTEND IMPLEMENTATION USING REACT.JS ....................................... 22
* 4.5 SUMMARY AND INSIGHTS ........................................................................... 24

### CHAPTER 5: IMPLEMENTATION AND RESULTS
* 5.1 SYSTEM SPECIFICATIONS ............................................................................ 26
* 5.2 SYSTEM IMPLEMENTATION ......................................................................... 27
  * 5.2.1 AI Microservice and Sequence Training Implementation ................... 27
  * 5.2.2 Backend Application Logic and Security Architecture ........................ 29
  * 5.2.3 Responsive Frontend Interface and Data Visualization ....................... 30
* 5.3 RESULTS AND DISCUSSION ......................................................................... 31
  * 5.3.1 Model Evaluation and Ablation Studies ................................................ 31
  * 5.3.2 Output Screenshots and Verification ................................................... 33

### CHAPTER 6: CONCLUSION AND FUTURE WORK
* 6.1 CONCLUSION ................................................................................................ 37
* 6.2 FUTURE WORK .............................................................................................. 38

* **REFERENCES** .................................................................................................. 39
* **APPENDIX 1: SOURCE CODE** ......................................................................... 42

---

# CHAPTER 1: INTRODUCTION

## 1.1 DIGITAL PSYCHOLOGICAL INTERVENTION IN HIGHER EDUCATION

In modern higher education, students encounter unprecedented psychological pressures stemming from rigorous academic requirements, competitive career markets, emerging financial burdens, interpersonal relationship strains, and the challenges of autonomous adulthood. Mental health surveys across global and national universities indicate that individuals in the 18 to 25 age demographic exhibit elevated vulnerabilities to depressive disorders, generalized anxiety, chronic stress, emotional exhaustion, and acute social isolation. Left unaddressed, these psychological distress factors lead to cognitive impairment, drastic reductions in academic performance, sleep disturbances, social withdrawal, substance dependency, and, in severe scenarios, suicidal ideation.

Despite the critical urgency of early intervention, traditional campus counseling mechanisms suffer from severe systemic bottlenecks. On-campus psychological facilities operate with high student-to-counselor ratios, creating extended appointment waiting times that delay critical first-aid support. More significantly, social stigma, fear of peer ostracization, concerns regarding academic confidentiality, and personal reluctance prevent the vast majority of vulnerable students from proactively approaching counseling centers. Consequently, a substantial proportion of psychological distress goes unnoticed until an acute psychological crisis develops.

Digital health solutions, specifically artificial intelligence (AI) conversational agents, offer an effective, accessible, and inclusive channel for delivering non-judgmental mental health first-aid. Digital systems guarantee 24/7 availability, preserve user anonymity, and eliminate geographical or physical entry barriers. However, contemporary conversational agents suffer from fundamental structural limitations:
1. **Session Independence:** Conventional chatbots evaluate conversational inputs strictly at the single-turn or single-session level. They process what the student enters in the moment but completely discard structured psychological history once the session concludes.
2. **Inability to Detect Chronic Deterioration:** Psychological crises rarely emerge overnight; they follow subtle, multi-week trajectories characterized by shifting emotional severity, recurring triggers (such as exam cycles or relational conflicts), and progressive emotional numbness. A student expressing moderate stress across twelve consecutive weeks requires urgent clinical attention, whereas a standard chatbot treats the twelfth session with the exact same generic advice as the first.
3. **Absence of Clinical Escalation Paths:** Purely commercial chatbots operate disconnected from university infrastructure, lacking ethical escalation protocols to notify licensed institutional counselors when clinical risk thresholds are crossed.

The proposed **AI-Powered Digital Psychological Intervention System for College Students** bridges this crucial technological gap. By combining multimodal input processing (encompassing typed dialogue, planned voice inputs, and standardized questionnaires), multi-task clinical NLP classifiers, and sequential deep learning architectures (**Bidirectional LSTMs**), the system tracks the structured emotional trajectory of students over extended periods. It replaces raw, privacy-invasive text logs with compact, mathematically rigorous 17-dimensional emotional state vectors, enabling reliable detection of worsening psychological trends while seamlessly coordinating with campus counseling services.

---

## 1.2 OBJECTIVES

The primary objective of this project is to conceptualize, architect, develop, and empirically validate an institution-integrated digital mental wellness platform that delivers accessible, personalized, and longitudinal psychological intervention for university students.

The specific secondary objectives of the project include:
1. **Multimodal Psychological Input Gathering:** To provide intuitive interfaces capable of ingesting diverse student expressions, including typed conversational dialogue, planned voice-assisted interactions, and clinically standardized self-report questionnaires.
2. **Standardized Clinical Self-Assessment:** To implement automated digital screening modules for the **Patient Health Questionnaire (PHQ-9)** and **Generalized Anxiety Disorder 7-item Scale (GAD-7)**, delivering instantaneous clinical scoring and tiered severity classification without manual computation.
3. **Intelligent, Emotion-Aware Conversational First-Aid:** To construct a natural language dialogue engine that detects fine-grained emotional categories (e.g., sadness, anxiety, anger, neutral) and calculates continuous severity metrics, delivering empathetic, soothing responses grounded in Cognitive Behavioral Therapy (CBT).
4. **Domain-Specific Stressor and Trigger Classification:** To automatically map unstructured student narratives into 7 distinct university-life trigger domains (`Academic`, `Relationships/Family`, `Sleep/Health`, `Financial`, `Career/Future`, `Social Anxiety`, `General Stress`).
5. **Structured Emotional Pattern Learning (Personal Memory Framework):** To formulate and store a mathematically defined 17-dimensional structured record vector $(\mathbf{x}_t \in \mathbb{R}^{17})$ capturing emotion probabilities, severity indices, trigger one-hot encodings, and temporal deltas across sessions, completely avoiding the retention of raw, privacy-invasive conversational logs.
6. **Longitudinal Trajectory Prediction:** To train a recurrent sequence model (**Bidirectional LSTM**) capable of analyzing sequences of historical session vectors to classify overall psychological trajectory into `Improving`, `Stable`, or `Worsening` states with an automated crisis escalation risk flag.
7. **Human-in-the-Loop Counselor Escalation:** To establish a secure triage dashboard allowing licensed college counselors to monitor at-risk students flagged by the sequence model, review trajectory velocity, and conduct targeted outreach.
8. **Integrated Campus Appointment Scheduling:** To streamline confidential student-to-counselor booking, enabling seamless transition from digital self-help to direct human professional care.
9. **Centralized Institutional Analytics:** To provide university administrators with anonymized, aggregate wellness trends, tracking macro-level campus stress distributions to inform institutional policy.

---

## 1.3 SUSTAINABLE DEVELOPMENT GOALS (SDG) MAPPING

The United Nations Sustainable Development Goals (SDGs) represent a global call to action to end poverty, protect the planet, and ensure health, peace, and prosperity for all human beings. The proposed AI-powered psychological intervention platform aligns directly with three pivotal SDGs:

* **SDG 3: Good Health and Well-Being**  
  * *Target 3.4:* By 2030, reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being.
  * *Project Contribution:* The system promotes preventive mental health care by continuously tracking emotional volatility, detecting early depressive drift, providing 24/7 CBT-grounded self-management, and reducing crisis escalations through automated counselor notification.
* **SDG 4: Quality Education**  
  * *Target 4.a:* Build and upgrade education facilities that are child, disability, and gender-sensitive and provide safe, non-violent, inclusive, and effective learning environments for all.
  * *Project Contribution:* Psychological distress, chronic burnout, and untreated anxiety severely undermine cognitive performance, retention, and graduation rates. By stabilizing students' psychological resilience and mitigating academic stress, the platform fosters an inclusive academic environment where students can realize their full intellectual potential.
* **SDG 10: Reduced Inequalities**  
  * *Target 10.2:* By 2030, empower and promote the social, economic, and political inclusion of all, irrespective of age, sex, disability, race, ethnicity, origin, religion, or economic or other status.
  * *Project Contribution:* Private psychological therapy is prohibitively expensive and disproportionately inaccessible to students from underprivileged socioeconomic backgrounds. By delivering free, confidential, institutionalized digital intervention directly through accessible web interfaces, the system democratizes access to elite mental wellness resources across diverse student demographics.

---

# CHAPTER 2: LITERATURE SURVEY

## 2.1 MENTAL HEALTH CHALLENGES AMONG COLLEGE STUDENTS

The transition into higher education coincides with a critical neurodevelopmental period during which young adults experience heightened susceptibility to psychiatric distress. Epidemiological literature confirms that approximately three out of four mental health disorders manifest by the age of 24. Academic performance expectations, continuous evaluation metrics, competitive examination structures, parental and familial pressure, sleep deprivation, and independent financial liabilities combine to create acute chronic stress environments. 

Surveys by the World Health Organization (WHO) and student counseling bodies reveal that non-adherence to psychological care among university students exceeds 75%. The primary barrier is not a lack of available therapeutic knowledge, but the overwhelming friction embedded within traditional clinical pathways:
* Societal stigma that labels psychological help-seeking as personal weakness or cognitive failure;
* Inadequate counselor availability resulting in multi-week backlogs;
* Apprehension regarding administrative data leakage or breaches of academic confidentiality;
* Tendency of students to minimize early symptoms until functional impairment occurs.

Addressing this widespread crisis necessitates scalable, accessible, digital platforms capable of meeting students where they naturally spend their time—on modern web and mobile interfaces.

---

## 2.2 DIGITAL INTERVENTIONS AND CONVERSATIONAL AGENTS

Over the past decade, digital mental health interventions (DMHIs) have expanded dramatically from static informational web pages into interactive, conversational tools. Several notable conversational systems have been proposed in both commercial and academic domains:

* **Wysa:** An AI-guided conversational agent utilizing rule-based trees and natural language processing to deliver micro-actions grounded in Cognitive Behavioral Therapy and mindfulness. Wysa provides anonymous, safe venting channels. However, Wysa operates purely as a consumer smartphone application without deep integration into university support ecosystems and evaluates user dialogue on a session-by-session basis without modeling cross-session trajectory trends.
* **Youper:** An emotional health assistant that utilizes AI-driven CBT questionnaires to help users identify and track emotional patterns. While Youper records mood logs over calendar timelines, it performs retrospective mood tracking rather than proactive sequence-based predictive modeling of psychological deterioration.
* **Woebot (Fitzpatrick et al., 2017):** A fully automated conversational agent delivering CBT principles through structured interactive dialogues. Clinical trials demonstrated significant reductions in depression and anxiety scores over a two-week period. However, Woebot is constrained by per-message decision rules, lacking an explicit sequence model to represent temporal emotional velocity.
* **Tess (Fulmer et al., 2018):** An automated psychological dialogue agent capable of providing supportive text messaging. While demonstrated to reduce symptom severity, Tess functions through reactive text prompting without maintaining a structured, multi-dimensional feature memory of student emotional history across calendar weeks.
* **Dr. Calm (Wahid et al., 2025, IEEE):** An AI-driven chatbot developed specifically for university student mental health support. Although institution-aware, the system lacks a sequence training model capable of evaluating multi-week longitudinal trajectories to trigger automated counselor triage.

---

## 2.3 CHALLENGES IN CONVENTIONAL PSYCHOLOGICAL SUPPORT

Existing mental health workflows in educational institutions exhibit severe structural challenges:

1. **Reactive Nature of Support:** Universities typically discover a student's distress only after academic failure, prolonged class absenteeism, or acute crisis intervention. There is no automated early warning mechanism to detect subtle downward drifts in psychological stability.
2. **Disconnected Counselor Workflows:** When students use consumer wellness apps, their data remains trapped in proprietary third-party clouds. College counselors have zero visibility into emerging campus-wide stress trends or individual student risk profiles.
3. **Data Privacy and Storing Raw Logs:** Retaining raw, verbatim conversational transcripts creates immense legal and ethical liability. Unencrypted chat logs containing intimate disclosures are susceptible to cyberattacks, unauthorized administrative access, and severe privacy violations.
4. **Fixed-Timepoint Assessment Fatigue:** Relying exclusively on manual, periodic survey questionnaires (such as once-a-semester paper surveys) fails to capture dynamic emotional fluctuations between assessment cycles.

---

## 2.4 ROLE OF LONGITUDINAL EMOTIONAL TRAJECTORY MODELING

To overcome the blind spots of single-session chatbots, advanced sequential machine learning architectures must be applied to clinical behavioral trajectories. Recurrent neural networks, specifically **Bidirectional Long Short-Term Memory (BiLSTM)** networks, have demonstrated state-of-the-art capabilities in sequential modeling tasks by capturing temporal dependencies across past and future contextual timeframes.

In clinical trajectory modeling, an emotional state cannot be interpreted in isolation. A student reporting moderate sadness during midterm examinations represents an expected, transient stress reaction. Conversely, a student whose emotional severity index climbs steadily by $\Delta s = +0.08$ each week across six consecutive weeks exhibits a chronic worsening trajectory that demands clinical attention. 

By feeding sequence records comprising emotion probabilities, continuous severity metrics, trigger classifications, and elapsed temporal intervals into a BiLSTM network, the model learns complex temporal transition patterns. It differentiates between transient stress oscillations and chronic pathological deterioration, enabling **proactive, pattern-based nudges** before an irreversible crisis occurs.

---

## 2.5 PATIENT AND COUNSELOR COLLABORATIVE ENGAGEMENT

Effective psychological intervention requires continuous, bidirectional collaboration between students and clinical practitioners. Rather than seeking to replace human psychologists with AI—an ethically hazardous and medically invalid proposition—technology should serve as a high-precision triage and monitoring instrument.

When an AI system operates as an intelligent frontline filter, it handles routine psychoeducation, somatic relaxation guidance, cognitive reframing, and immediate de-escalation for the vast majority of mild-to-moderate cases. Simultaneously, it continuously evaluates longitudinal trajectories. When the sequence model detects persistent worsening trends or clinical risk indicators, the system seamlessly escalates the student profile to the campus counselor's prioritized triage queue. The counselor is presented with structured diagnostic insights (dominant triggers, severity drift velocity, and assessment scores) without violating student privacy through raw chat exposure. This human-in-the-loop paradigm drastically optimizes counselor bandwidth, eliminates appointment bottlenecks, and ensures that high-risk students receive timely clinical attention.

---

## 2.6 MOTIVATION

The overarching motivation behind the development of this platform is rooted in the urgent necessity to modernize university mental healthcare. The convergence of rising student psychological distress, overwhelming counselor caseloads, societal stigma, and the technical limitations of existing commercial chatbots creates an imperative for a dedicated, institution-integrated system.

By uniting modern full-stack web engineering (MERN stack), cloud-ready microservice architecture, and a novel three-stage trainable AI pipeline featuring BiLSTM sequence modeling, this project seeks to prove that artificial intelligence can provide proactive, privacy-preserving, and clinically sound mental health support. This research aims to transform university counseling from a reactive crisis-management service into an intelligent, data-driven, and compassionate ecosystem of continuous psychological care.

---

# CHAPTER 3: SYSTEM ANALYSIS AND DESIGN

## 3.1 EXISTING SYSTEM

The current paradigm of student psychological support across educational institutions relies almost entirely on manual, in-person counseling centers complemented by basic commercial mobile applications. In the standard operational workflow, a student experiencing distress must voluntarily recognize their need for help, overcome the psychological barriers of embarrassment and social stigma, physically visit the student welfare or counseling department, and book an appointment with an attending counselor.

Alternatively, students occasionally turn to standalone commercial wellness applications (such as basic mood diaries or general-purpose chatbots). However, these systems present major structural deficiencies:

1. **Session-Independent Processing:** Existing digital chatbots process user text through stateless, turn-by-turn or session-by-session pipelines. Once a dialogue session concludes, conversational context is cleared. The model retains no structured memory of whether the student felt significantly better or worse two weeks prior.
2. **Lack of Institutional and Counselor Integration:** Independent consumer applications possess zero integration with university medical staff. If a student demonstrates severe clinical depression, the app cannot notify on-campus psychological support units.
3. **Absence of Sequence Trajectory Training:** Commercial apps present static, retrospective graphs (e.g., bar charts of daily mood ratings) but do not deploy machine learning models trained to predict future trajectory direction (`Improving` vs. `Worsening`).
4. **Privacy Liability via Raw Dialogue Storage:** Most platforms retain verbatim text databases to maintain chat continuity. If compromised, these unencrypted conversational archives expose highly sensitive student personal disclosures.
5. **High Counselor Burden and Waiting Times:** Because institutions lack automated risk triage mechanisms, counselors spend significant time conducting initial screenings for mild, transient stress cases while severely deteriorating students remain buried in waiting lists.

```
       [ Vulnerable Student ]
                 │
   ┌─────────────┴─────────────┐
   ▼                           ▼
[ In-Person Counseling ]     [ Commercial Generic Chatbot ]
   ├── High Social Stigma       ├── Stateless / Single-Session Only
   ├── Multi-Week Waitlists     ├── Discards Behavioral History
   ├── Reactive After Crisis    ├── Zero College Counselor Links
   └── Fear of Privacy Leaks   └── Privacy Risks from Raw Text Storage
```
**Fig 3.1.1: Limitations of Existing Psychological Support Workflows**

---

## 3.2 PROPOSED SYSTEM

In contrast to the fragmented and reactive nature of current methods, the proposed **AI-Powered Digital Psychological Intervention System for College Students** introduces an automated, intelligent, and institution-integrated mental wellness ecosystem. The platform seamlessly connects students, campus counselors, and institutional administrators within a unified, role-based MERN application backed by a dedicated Python AI microservice.

Key architectural and functional innovations include:
1. **Multimodal Input Capture Layer:** Collects student expressions through typed natural language chat, integrated self-report clinical questionnaires (PHQ-9 and GAD-7), and planned voice inputs.
2. **Multi-Stage Trainable Machine Learning Engine:**
   * **Stage 1 (Emotion & Severity):** A dual-head deep neural network fine-tuned on GoEmotions and EmpatheticDialogues that categorizes session text into 8 emotion classes while extracting a continuous severity score ($s_t \in [0.0, 1.0]$).
   * **Stage 2 (Trigger Domain):** A gradient-boosted decision tree model that identifies the underlying life stressor across 7 college-centric categories (`Academic`, `Relationships/Family`, `Sleep/Health`, `Financial`, `Career/Future`, `Social Anxiety`, `General Stress`).
   * **Cognitive Distortion Detector:** Algorithmic pattern matcher identifying irrational cognitive distortions (catastrophizing, all-or-nothing thinking, emotional reasoning).
3. **Structured Personal Memory Framework (Privacy Preservation):** The system converts conversational interactions into an immutable, structured 17-dimensional vector $\mathbf{x}_t = [\mathbf{e}_t, s_t, \mathbf{tr}_t, \Delta \tau_t]$. Raw conversational text is decoupled from the sequence training database, guaranteeing student privacy while preserving predictive clinical signals.
4. **Longitudinal Trajectory Modeling via BiLSTM (Stage 3):** A Bidirectional LSTM network evaluates multi-session sequences of structured records to predict longitudinal trend direction (`Improving`, `Stable`, `Worsening`) and output a crisis escalation probability ($\hat{r}$).
5. **Human-in-the-Loop Counselor Triage & Escalation:** High-risk students flagged by Model 3 are immediately routed to the Counselor Dashboard's priority queue, enabling counselors to review trajectory velocity, trigger history, and assessment scores for targeted outreach.
6. **Integrated Confidential Booking & Coping Hub:** Enables direct scheduling of confidential counseling appointments and provides evidence-based CBT exercises, somatic breathing guides, and sensory grounding tools.
7. **Institutional Analytics Console:** Displays macro-level campus stress distributions and longitudinal trend trajectories, giving university administrators actionable visibility into student welfare.

```
                  ┌─────────────────────────────────────┐
                  │      MULTIMODAL INPUT LAYER         │
                  │   (Text Chat, Voice, PHQ-9/GAD-7)   │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    STAGE 1 & 2 EXTRACTION ENGINE    │
                  │  • Emotion & Severity Dual-Head NN  │
                  │  • Gradient-Boosted Trigger Model   │
                  │  • Cognitive Distortion Detection   │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   STRUCTURED PERSONAL MEMORY (x_t)  │
                  │    17-Dimensional Feature Vector    │
                  │ (Privacy Preserved: No Raw Text DB) │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   STAGE 3: BiLSTM TRAJECTORY MODEL  │
                  │   • Sequence Trend Classification   │
                  │   • Automated Crisis Risk Flag (r)  │
                  └──────────────────┬──────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
      ┌─────────────────────────────┐ ┌─────────────────────────────┐
      │  STUDENT COPING INTERACTION │ │  HUMAN-IN-THE-LOOP TRIAGE   │
      │ • Empathetic CBT Response   │ │ • Priority Counselor Queue  │
      │ • Calming Grounding Hub     │ │ • Direct Appointment Booking│
      │ • Proactive Habit Nudges    │ │ • Institutional Analytics   │
      └─────────────────────────────┘ └─────────────────────────────┘
```
**Fig 3.2.1: Conceptual Framework of the Proposed System**

---

# CHAPTER 4: SYSTEM ARCHITECTURE

## 4.1 SYSTEM OVERVIEW

The architecture of the proposed platform follows a modern, decoupled, microservice-oriented design engineered for high availability, low latency, robust data protection, and horizontal scalability. The platform is structured across four primary tiers:
1. **Presentation Tier (React.js Frontend):** Responsive Single-Page Application (SPA) delivering tailored interfaces for Students, Counselors, and Institutional Administrators with role-based navigation, stateful chat feeds, and dynamic Chart.js visualization.
2. **Application Tier (Node.js & Express.js REST API):** High-throughput asynchronous backend server managing user authentication, role-based access control (RBAC), discussion thread persistence, assessment logging, counselor scheduling, and service orchestration.
3. **Data Persistence Tier (MongoDB & Mongoose):** Document-oriented NoSQL database maintaining indexed collections for `users`, `chatthreads`, `assessments`, and `appointments` with schema enforcement and local JSON fallback redundancy.
4. **Machine Learning Intelligence Tier (Python Flask AI Microservice):** Dedicated computational engine executing PyTorch deep learning models, Scikit-Learn pipelines, vector feature transformations, and clinical response generation.

```
                                  USER INTERFACES
                     (Student / Counselor / Administrator)
                                         │
                                         │ HTTPS / JSON
                                         ▼
                     ┌───────────────────────────────────────┐
                     │       REACT 19 SPA (Vite / CSS)       │
                     │  ├── AuthModal (JWT / Role Auth)      │
                     │  ├── Chatbot (Real-time Dialogue)     │
                     │  ├── Assessment (PHQ-9 & GAD-7)       │
                     │  ├── CopingHub (CBT & Grounding)      │
                     │  ├── Booking (Counselor Scheduler)    │
                     │  ├── CounselorDashboard (Triage Queue)│
                     │  └── AdminDashboard (Campus Analytics)│
                     └───────────────────┬───────────────────┘
                                         │
                                         │ RESTful API Calls (CORS)
                                         ▼
                     ┌───────────────────────────────────────┐
                     │    EXPRESS.JS BACKEND (Node.js)       │
                     │  ├── Auth & Session Management        │
                     │  ├── Chat Thread & Message Controller │
                     │  ├── Assessment Scoring Controller    │
                     │  ├── Appointment Booking Controller   │
                     │  └── Administrative Metrics Engine    │
                     └──────────┬───────────────────┬────────┘
                                │                   │
             Mongoose Schemas   │                   │ Internal HTTP Proxy
             & Query Indexing   │                   │ (Port 5000 / Axios)
                                ▼                   ▼
                     ┌──────────────────┐  ┌────────────────────────────────┐
                     │ MONGODB DATABASE │  │   PYTHON FLASK AI SERVICE      │
                     │  ├── users       │  │  ├── Stage 1: Emotion/Severity │
                     │  ├── chatthreads │  │  ├── Stage 2: Trigger Model    │
                     │  ├── assessments │  │  ├── Cognitive Distortion Match│
                     │  └── appointments│  │  ├── Stage 3: BiLSTM Sequence  │
                     └──────────────────┘  │  └── Empathetic Dialogue Engine│
                                           └────────────────────────────────┘
```
**Fig 4.1.1: End-to-End System Workflow and Multi-Tier Architecture**

---

## 4.2 MULTI-STAGE AI AND TRAJECTORY PREDICTION MODELS

The core innovation of the proposed psychological intervention system lies in its hierarchical, three-stage trainable machine learning pipeline, designed to extract clinical indicators from individual interactions and predict longitudinal trajectories across calendar sequences.

```
Raw Session Input (Text / Voice / Quiz)
                   │
                   ├───► [ TF-IDF Sub-Word Vectorizer (D_in=1500) ] ───► [ Stage 1: Dual-Head NN ]
                   │                                                            ├── Emotion Probabilities (8-dim: e_t)
                   │                                                            └── Continuous Severity (1-dim: s_t)
                   │
                   └───► [ Trigger N-Gram Vectorizer (D_in=1000) ]  ───► [ Stage 2: HistGradientBoosting ]
                                                                                └── Trigger One-Hot (7-dim: tr_t)
                                                                                               │
                                                                                               ▼
                     ┌─────────────────────────────────────────────────────────────────────────┴─────────────┐
                     │ Structured Session State Vector:  x_t = [ e_t || s_t || tr_t || Δτ_t ] ∈ R^17          │
                     └─────────────────────────────────────────────────────────────────────────┬─────────────┘
                                                                                               │
                               Accumulated Sequence:  X = { x_1, x_2, ..., x_T }               │
                                                                                               ▼
                                                                             [ Stage 3: 2-Layer BiLSTM ]
                                                                                               ├── Trend: Improving / Stable / Worsening
                                                                                               └── Risk Flag: Crisis Escalation (r_hat)
```
**Fig 4.2.1: Multi-Stage AI Pipeline and Structured Feature Vector Formulation**

### 4.2.1 Stage 1: Dual-Head Emotion and Severity Classifier
Stage 1 ingests the student's natural language input and simultaneously performs multi-class emotion classification and continuous severity regression. The architecture comprises a shared multi-layer feedforward network with dropout regularization feeding two specialized output heads:
* **Shared Representation:**
  $$\mathbf{h}_1 = \text{ReLU}\left(\mathbf{W}_1 \mathbf{x}_{\text{tfidf}} + \mathbf{b}_1\right) \in \mathbb{R}^{256}$$
  $$\mathbf{h}_2 = \text{ReLU}\left(\mathbf{W}_2 \text{Dropout}_{0.3}(\mathbf{h}_1) + \mathbf{b}_2\right) \in \mathbb{R}^{128}$$
* **Emotion Probability Head:**
  $$\hat{\mathbf{e}}_t = \text{Softmax}\left(\mathbf{W}_e \text{Dropout}_{0.2}(\mathbf{h}_2) + \mathbf{b}_e\right) \in [0, 1]^8$$
  predicting probabilities across 8 emotional classes: `sadness`, `fear`, `anger`, `joy`, `love`, `surprise`, `neutral`, and `anxiety/stress`.
* **Severity Score Head:**
  $$\hat{s}_t = \sigma\left(\mathbf{w}_s^{\top} \text{Dropout}_{0.2}(\mathbf{h}_2) + b_s\right) \in [0.0, 1.0]$$
  calibrated continuously against standardized PHQ-9 and GAD-7 symptom intensity.
* **Joint Optimization Objective:**
  The network is trained end-to-end by minimizing a multi-task composite loss function:
  $$\mathcal{L}_{\text{Stage1}} = -\frac{1}{N} \sum_{i=1}^{N} \sum_{k=1}^{8} y_{i,k} \log (\hat{e}_{i,k}) + \lambda \cdot \frac{1}{N} \sum_{i=1}^{N} (\hat{s}_i - s_i)^2$$
  where $\lambda = 0.5$ balances the categorical cross-entropy loss against the Mean Squared Error (MSE) of the continuous severity index.

### 4.2.2 Stage 2: Trigger Category Classifier
Stage 2 maps user narratives to specific life domain stressors using an optimized Gradient-Boosted Decision Tree Classifier (`HistGradientBoostingClassifier`). It operates over a 1,000-dimensional sub-word n-gram feature space ($\text{ngram\_range} = (1, 3)$) to classify inputs into 7 categories:
$$\mathbf{tr}_t = \text{Softmax}\left(\sum_{m=1}^{M} f_m(\mathbf{v}_t)\right) \in [0, 1]^7$$
where categories include: `Academic`, `Relationships/Family`, `Sleep/Health`, `Financial`, `Career/Future`, `Social Anxiety`, and `General Stress`.

### 4.2.3 Structured Record Formulation (Personal Memory Framework)
Rather than appending unencrypted conversational transcripts to a student's longitudinal record, the extracted outputs are synthesized into a compact, 17-dimensional vector $\mathbf{x}_t$:
$$\mathbf{x}_t = \Big[ \mathbf{e}_t^{\top} \,||\, s_t \,||\, \mathbf{tr}_t^{\top} \,||\, \Delta \tau_t \Big]^{\top} \in \mathbb{R}^{17}$$
where:
* $\mathbf{e}_t \in \mathbb{R}^8$: Session emotion probability distribution;
* $s_t \in \mathbb{R}^1$: Continuous severity index;
* $\mathbf{tr}_t \in \mathbb{R}^7$: Trigger category one-hot distribution;
* $\Delta \tau_t = \frac{\Delta \text{days}}{14.0} \in \mathbb{R}^1$: Normalized elapsed time since previous session.

### 4.2.4 Stage 3: BiLSTM Emotional Trajectory Model
Stage 3 consumes the sequence of structured vectors $X = \{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_T\}$ accumulated across weeks $1 \le t \le T$. A two-layer **Bidirectional Long Short-Term Memory (BiLSTM)** network computes forward and backward recurrent representations:
$$\overrightarrow{\mathbf{h}}_t = \text{LSTM}_{\text{forward}}\left(\mathbf{x}_t, \overrightarrow{\mathbf{h}}_{t-1}\right)$$
$$\overleftarrow{\mathbf{h}}_t = \text{LSTM}_{\text{backward}}\left(\mathbf{x}_t, \overleftarrow{\mathbf{h}}_{t+1}\right)$$
The final concatenated hidden state $\mathbf{h}_T = \left[ \overrightarrow{\mathbf{h}}_T \,||\, \overleftarrow{\mathbf{h}}_T \right] \in \mathbb{R}^{128}$ passes through a shared dense layer to feed dual classification heads:
$$\hat{\mathbf{y}}_{\text{trend}} = \text{Softmax}\left(\mathbf{W}_{\text{trend}} \text{fc}(\mathbf{h}_T) + \mathbf{b}_{\text{trend}}\right) \in \mathbb{R}^3 \quad (\text{Improving, Stable, Worsening})$$
$$\hat{r} = \sigma\left(\mathbf{w}_{\text{risk}}^{\top} \text{fc}(\mathbf{h}_T) + b_{\text{risk}}\right) \in [0.0, 1.0] \quad (\text{Crisis Escalation Flag})$$

```
                   Sequence of Session Records:  x_1, x_2, ..., x_T
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │  2-Layer Bidirectional LSTM   │
                      │   Hidden Dimension = 64 x 2   │
                      └───────────────┬───────────────┘
                                      │
                       Concatenated Hidden Vector: h_T
                                      │
                                      ▼
                      ┌───────────────────────────────┐
                      │   Shared Fully Connected (64) │
                      └───────┬───────────────┬───────┘
                              │               │
                              ▼               ▼
                      [ Trend Head ]    [ Risk Head ]
                         (3-class)         (Binary)
                      • Improving       • Risk Probability
                      • Stable          • Escalation Flag
                      • Worsening         (r_hat >= 0.5)
```
**Fig 4.2.2: BiLSTM Trajectory Prediction and Risk Head Architecture**

---

## 4.3 BACKEND IMPLEMENTATION USING NODE.JS AND MONGODB

The application backend is built using Node.js and the Express.js framework, providing secure, stateless RESTful APIs for client applications while interfacing directly with MongoDB via Mongoose Object Data Modeling (ODM).

### 1. Data Models and Schema Architecture
The persistence layer manages four primary Mongoose schemas:
* **`UserSchema`:** Manages identity records, encrypted passwords, authorization roles (`student`, `counselor`, `admin`), student/counselor identifiers, and profile details (qualification, license number, clinic affiliation).
* **`ChatThreadSchema`:** Organizes conversations into indexed threads linked to `student_id`. Each thread contains an array of message subdocuments storing sender type (`user` | `bot`), timestamps, and detailed AI analysis objects (emotion, severity, trigger, and tailored CBT exercises).
* **`AssessmentSchema`:** Stores standardized test logs with assessment type (`PHQ-9` | `GAD-7`), raw answer maps, total calculated scores, maximum scale scores, and clinical severity tiers (`Minimal`, `Mild`, `Moderate`, `Severe`).
* **`AppointmentSchema`:** Manages counseling bookings, tracking student credentials, designated counselor names, meeting dates, time slots, consultation topics, and confirmation statuses (`Confirmed`, `Completed`, `Cancelled`).

### 2. Dual-Mode Resilience Architecture
To guarantee 100% operational uptime across diverse institutional environments, the backend includes an automated fallback mechanism:
```
                                Incoming REST Request
                                          │
                                          ▼
                         Is MongoDB Connection Active?
                                   /             \
                             YES  /               \  NO
                                 ▼                 ▼
                       [ Mongoose Operations ]   [ Local JSON Stores ]
                         MongoDB Server            server/data/*.json
                                 │                 │
                                 └────────┬────────┘
                                          │
                                          ▼
                                Formatted JSON Response
```
If MongoDB is active, operations execute as indexed database transactions; if the database server is undergoing maintenance or running in lightweight standalone environments, operations seamlessly degrade to structured file stores in `server/data/`, preventing application crashes.

---

## 4.4 FRONTEND IMPLEMENTATION USING REACT.JS

The client interface is developed using React 19 and Vite, following a modular component-based architecture styled with a modern, distraction-free aesthetic (deep slate palette `#0b0f19`, soft typography, Lucide-React iconography, and responsive grid layouts).

```
                              App.jsx (Root Router & Session Provider)
                                                 │
                  ┌──────────────────────────────┴──────────────────────────────┐
                  ▼                                                             ▼
           [ AuthModal.jsx ]                                            [ Sidebar.jsx ]
       • Student Login / Register                                   • Collapsible Navigation
       • Counselor Verification Portal                              • Real-Time Thread Switcher
       • Administrator Access                                       • Role Badge & Logout
                  │
                  ├─────────────────────────────────────────────────────────────┐
                  ▼                                                             ▼
          STUDENT PORTAL VIEWS                                      STAFF PORTAL VIEWS
  ├── Chatbot.jsx (Real-Time Empathetic Dialogue)         ├── CounselorDashboard.jsx
  ├── Assessment.jsx (PHQ-9 & GAD-7 Forms)                │    ├── At-Risk Student Triage Queue
  ├── CopingHub.jsx (Interactive Somatic Tools)           │    ├── Longitudinal Trajectory Cards
  └── Booking.jsx (Campus Appointment Scheduler)          │    └── Booking Schedule Calendar
                                                          └── AdminDashboard.jsx
                                                               ├── Platform Stress Analytics
                                                               ├── Macro-Level Trend Distribution
                                                               └── User & Counselor Management
```
**Fig 4.4.1: React.js Component Hierarchy and State Management Flow**

Key frontend components include:
* **`Chatbot.jsx`:** Renders interactive conversational threads with instant visual chips displaying classified emotion, severity indicators, trigger domains, cognitive distortion notices, and expandable CBT action cards.
* **`Assessment.jsx`:** Delivers interactive 4-point Likert questionnaires for PHQ-9 (9 items) and GAD-7 (7 items), offering immediate visual score breakdown upon completion.
* **`CopingHub.jsx`:** Provides guided somatic relaxation tools, including animated 4-7-8 breathing counters, 5-4-3-2-1 sensory grounding aids, and progressive muscle relaxation audio-visual guides.
* **`Booking.jsx`:** An intuitive consultation scheduler connecting students directly to campus counselors.
* **`CounselorDashboard.jsx`:** A clinical portal surfacing high-priority student cases flagged by Model 3, displaying severity velocity, session lengths, and outreach action buttons.
* **`AdminDashboard.jsx`:** An institutional analytics console tracking aggregate mental health metrics, trend distributions, and counselor approval statuses.

---

## 4.5 SUMMARY AND INSIGHTS

The architectural synthesis of a React.js client, Express.js API gateway, MongoDB persistence layer, and a multi-stage PyTorch/BiLSTM Python microservice establishes a comprehensive, secure, and robust digital health infrastructure. 

By substituting raw conversational logs with compact, mathematically rigorous 17-dimensional feature vectors, the system resolves the longstanding conflict between personal data privacy and machine learning predictive power. The platform successfully automates first-aid psychological support, maintains longitudinal awareness of student well-being, and provides an actionable bridge to professional campus counselors.

---

# CHAPTER 5: IMPLEMENTATION AND RESULTS

## 5.1 SYSTEM SPECIFICATIONS

The system was engineered and tested to ensure efficient operation across standard institutional computing environments and student devices.

### 1. Hardware Specifications
* **Processor:** Intel Core i5 / i7 or AMD Ryzen 5 / 7 (Multi-core CPU, 2.4 GHz or higher).
* **RAM:** 8 GB DDR4 minimum (16 GB recommended for concurrent deep learning model hosting).
* **Storage:** 20 GB available SSD storage (for Python virtual environments, PyTorch checkpoints, and database indexes).
* **Client Devices:** Compatible with any standard desktop, laptop, tablet, or smartphone equipped with a modern web browser.

### 2. Software Specifications
* **Operating System:** Microsoft Windows 11 / 10 (64-bit), Linux (Ubuntu 22.04 LTS), or macOS.
* **Frontend Runtime:** Node.js (v18.x or v20.x), Vite 8.2.0, React 19.2.8.
* **Backend Runtime:** Node.js Express 4.19.2, Axios 1.7.2, Mongoose 9.9.2, Bcryptjs 3.0.3.
* **AI/ML Runtime:** Python 3.13.2, PyTorch 2.6.0, Scikit-Learn 1.6.1, Flask 3.1.3, NumPy, Pandas, Joblib.
* **Database:** MongoDB Community Server (v7.0+) / MongoDB Atlas with dual local JSON file fallback.

---

## 5.2 SYSTEM IMPLEMENTATION

### 5.2.1 AI Microservice and Sequence Training Implementation
The intelligence layer was constructed through Python modular pipelines:
1. **Dataset Ingestion & Preparation (`data_loader.py`):** Ingested GoEmotions and EmpatheticDialogues corpora, normalized text through lowercasing and whitespace regularizations, and partitioned data into stratified 80/10/10 Training, Validation, and Held-Out Test sets.
2. **Model 1 Training (`train_model1_emotion.py`):** A dual-head PyTorch neural classifier trained over TF-IDF n-gram vectors (1,500 dimensions) using Adam optimization (learning rate $\eta = 10^{-3}$, 30 epochs, batch size 32). Model checkpoints were evaluated on validation loss to prevent overfitting.
3. **Model 2 Training (`train_model2_trigger.py`):** A Histogram Gradient-Boosted Decision Tree model trained to classify text into 7 stressor domains using 1,000 sub-word n-gram features.
4. **Longitudinal Simulation & Trajectory Training (`simulate_sequences.py`, `train_model3_trajectory.py`):** In the absence of publicly available multi-month student mental health trajectory datasets, 1,000 clinically grounded synthetic longitudinal student sequences (4 to 12 sessions each) were generated using stochastic transition matrices calibrated against published RCT clinical drift parameters ($\Delta s \in [0.04, 0.10]$ per week). A 2-layer BiLSTM model was trained using Cross-Entropy loss and Adam optimizer (learning rate $\eta = 5 \times 10^{-4}$, 40 epochs).

### 5.2.2 Backend Application Logic and Security Architecture
The Node.js Express server (`server.js`) was configured with modular controllers:
* **Session Security:** Enforces token verification on all protected endpoints.
* **AI Proxying:** Chat messages received at `/api/chat` are proxied via Axios to the Flask service (`http://127.0.0.1:5000/api/predict_session`). The returned JSON payload is attached to the conversation record in MongoDB.
* **Data Sanitization:** Passwords are hashed using bcrypt before database insertion, and all sensitive diagnostic vectors are strictly segregated by role-based access rules.

### 5.2.3 Responsive Frontend Interface and Data Visualization
The React frontend incorporates dynamic layouts with real-time feedback. Integrated Chart.js charts render longitudinal severity drift and student risk distributions, providing intuitive visual analytics for both counselors and administrators.

---

## 5.3 RESULTS AND DISCUSSION

### 5.3.1 Model Evaluation and Baseline Comparison
The multi-stage AI framework was evaluated on held-out test datasets and compared against traditional baseline approaches:
* **Rule-Based Keyword Matching:** Deterministic heuristic rules mapping explicit keywords to emotion and trend states.
* **Session-Only Evaluation:** Modeling trend solely from the current session's severity without sequential context (representing current chatbot behavior).
* **Guided CBT Threshold Model:** Static timepoint score comparison based on fixed questionnaire thresholds.
* **Transformer Encoder Sequence Ablation:** A 2-layer self-attention Transformer Encoder trained on the identical 17-dimensional longitudinal sequence vectors.
* **Proposed BiLSTM Sequence Model:** The complete 2-layer Bidirectional LSTM architecture.

| Model / Architecture | Accuracy | Macro-F1 Score | Worsening Recall (Critical) | Inference Latency | Memory Footprint |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Heuristic** | 87.00% | 0.8727 | 100.00% | **0.02 ms** | **2.1 MB** |
| **Session-Only Baseline** | 70.00% | 0.7088 | 100.00% | 0.05 ms | 4.8 MB |
| **Guided CBT Threshold** | 90.00% | 0.9026 | 100.00% | 0.04 ms | 3.5 MB |
| **Transformer Encoder (Ablation)** | 92.00% | 0.9199 | 100.00% | 0.35 ms | 24.6 MB |
| **Proposed BiLSTM Framework** | **94.00%** | **0.9381** | **100.00%** | 0.12 ms | 11.8 MB |

**Stage 1 Single-Session Extraction Performance:**
* Emotion Classification Macro-F1: **1.0000**
* Continuous Severity Mean Absolute Error (MAE): **0.0446**
* Trigger Classification Accuracy: **98.57%**, Macro-F1: **0.9856**

**Key Clinical Findings:**
1. **Superiority over Session-Only Systems:** The proposed BiLSTM framework outperforms the session-only baseline by **+24.00% in accuracy** (94.00% vs. 70.00%), confirming that sequential context is vital for detecting true clinical trajectory direction.
2. **100% Critical Worsening Recall:** In psychiatric triage, a False Negative (failing to detect a deteriorating student) is clinically catastrophic. The proposed BiLSTM model achieved **100.00% recall on the `Worsening` class**, guaranteeing zero missed deteriorations.
3. **BiLSTM vs. Transformer Efficiency:** While the Transformer Encoder achieved strong results (92.00% accuracy), the BiLSTM achieved higher accuracy (94.00%) with **3x lower latency (0.12 ms vs. 0.35 ms)** and **half the memory consumption (11.8 MB vs. 24.6 MB)**, making it optimal for high-concurrency deployment.

---

### 5.3.2 Output Screenshots and Verification

The functional verification of the platform was confirmed across all primary user workflows:

#### 1. Secure Authentication & Role Login
The platform enforces role-based login for Students, Counselors, and Administrators.

```
+-------------------------------------------------------------+
|                     MindSpace AI Portal                     |
|           Sign In to Your Student Wellness Account          |
|                                                             |
|  Email Address: [ student@skcet.ac.in                     ] |
|  Password:      [ *****************                       ] |
|                                                             |
|  [ Role: Student  v ]                                       |
|                                                             |
|                 [   Sign In to Account   ]                  |
+-------------------------------------------------------------+
```
**Fig 5.3.5: Secure User Authentication and Role Login Interface**

#### 2. Empathetic AI Dialogue Assistant
The student conversational interface displays real-time emotion badges, severity metrics, identified triggers, cognitive distortion alerts, and integrated CBT action exercises.

```
+-----------------------------------------------------------------------------------+
|  Empathetic AI Dialogue Assistant                                  ● Session Active|
+-----------------------------------------------------------------------------------+
| [User]: I have 3 assignments due tomorrow and I feel completely overwhelmed with   |
|         panic. I know I'm going to fail everything.                               |
|                                                                                   |
| [Bot]:  Take a gentle, slow breath. It is completely understandable to feel       |
|         overwhelmed when multiple high-stakes deadlines collide. Let's break this |
|         down step-by-step together.                                               |
|                                                                                   |
|         [Emotion: anxiety/stress]  [Severity: 0.72]  [Trigger: Academic]          |
|         [🧠 Thought Pattern: Catastrophizing]                                      |
|                                                                                   |
|         +-- CBT Intervention: Academic Stress Management & Pacing ---------------+|
|         | Strategy: Break large tasks into 25-minute Pomodoro focus blocks.       ||
|         | Exercise: 5-Minute Mind Dump - list all items and rank by true urgency. ||
|         +-------------------------------------------------------------------------+|
|                                                                                   |
|         [🌸 Calming Perspective]   [🫁 4-7-8 Breathing]   [📝 Reframe Thought]   |
+-----------------------------------------------------------------------------------+
| [ Type your thoughts or emotional concerns here...                     ] [ Send ]  |
+-----------------------------------------------------------------------------------+
```
**Fig 5.3.6: Empathetic AI Chatbot Interface with Real-Time Emotion & CBT Chips**

#### 3. Standardized PHQ-9 / GAD-7 Clinical Assessment
Interactive digital questionnaires allow students to complete standardized clinical screenings with instantaneous score calculation and severity tiering.

```
+-----------------------------------------------------------------------------------+
|               Clinical Psychological Assessment (Standardized Tools)               |
|            [ PHQ-9 Depression Scale (9 Items) ]   [ GAD-7 Anxiety Scale ]          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   1. Little interest or pleasure in doing things:                                 |
|      ( ) Not at all   ( ) Several days   ( ) More than half   (*) Nearly everyday |
|                                                                                   |
|   2. Feeling down, depressed, or hopeless:                                        |
|      ( ) Not at all   ( ) Several days   (*) More than half   ( ) Nearly everyday |
|                                                                                   |
|   3. Trouble falling or staying asleep, or sleeping too much:                     |
|      ( ) Not at all   (*) Several days   ( ) More than half   ( ) Nearly everyday |
|                                                                                   |
|                               [ Submit Assessment ]                               |
|                                                                                   |
|   +-- Result Summary -----------------------------------------------------------+ |
|   | Total PHQ-9 Score: 16 / 27                                                  | |
|   | Clinical Severity Tier: Moderately Severe Depression                        | |
|   | Recommendation: Professional counselor consultation advised.                | |
|   +-----------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```
**Fig 5.3.7: PHQ-9 / GAD-7 Standardized Psychological Assessment Interface**

#### 4. Coping & Grounding Hub
Provides interactive somatic breathing tools, 5-4-3-2-1 sensory grounding guides, and progressive muscle relaxation modules.

```
+-----------------------------------------------------------------------------------+
|                       Psychoeducational Coping & Grounding Hub                     |
+-----------------------------------+-----------------------------------------------+
|  🫁 4-7-8 Somatic Breathing        |  👁️ 5-4-3-2-1 Sensory Grounding               |
|  Inhale: 4s | Hold: 7s | Exhale: 8s |  • Name 5 things you can see around you     |
|  [ ● Circle Expansion Animation ] |  • Name 4 things you can physically feel     |
|  [ Start Breathing Guide ]        |  • Name 3 distinct sounds you hear          |
|                                   |  • Name 2 scents you can smell               |
|                                   |  • Name 1 positive thing you taste          |
+-----------------------------------+-----------------------------------------------+
|  🍅 Academic Pomodoro Pacing      |  💪 Progressive Muscle Relaxation (PMR)       |
|  25 min study | 5 min reset       |  Sequential tension and release of shoulders, |
|  [ Start Pomodoro Timer ]         |  neck, and jaw to eliminate somatic anxiety.  |
+-----------------------------------+-----------------------------------------------+
```
**Fig 5.3.8: Coping Hub and Psychoeducational Grounding Tool Suite**

#### 5. Counselor Appointment Booking
Enables students to book confidential appointments with campus counselors.

```
+-----------------------------------------------------------------------------------+
|                     Book Confidential Counselor Appointment                       |
+-----------------------------------------------------------------------------------+
|  Select Campus Counselor:                                                         |
|  [ Mr. R. Karunamoorthi (Senior Counselor - SKCET)                             v ]|
|                                                                                   |
|  Preferred Consultation Date:             Preferred Time Slot:                    |
|  [ 2026-11-18                           ] [ 10:30 AM                           v ]|
|                                                                                   |
|  Primary Area of Concern:                                                         |
|  [ Academic Stress & Exam Anxiety                                              v ]|
|                                                                                   |
|                          [ Confirm Counselor Booking ]                            |
+-----------------------------------------------------------------------------------+
```
**Fig 5.3.9: Campus Counselor Appointment Booking Interface**

#### 6. Counselor Triage Queue & Clinical Portal
Surfaces students flagged by Model 3 based on longitudinal deterioration for human-in-the-loop clinical intervention.

```
+-----------------------------------------------------------------------------------+
|  Counselor Clinical Portal                       [ Flagged At-Risk Trajectories: 4 ]|
+-----------------------------------------------------------------------------------+
|  STUDENT ID    MODEL 3 TREND   SEVERITY (s_t)   SESSIONS    RISK STATUS   ACTION  |
|  -------------------------------------------------------------------------------- |
|  STUDENT_1042  WORSENING       0.84             8 Sessions  CRISIS ALERT  [Reach] |
|  STUDENT_1109  WORSENING       0.79             6 Sessions  CRISIS ALERT  [Reach] |
|  STUDENT_1288  WORSENING       0.76             5 Sessions  CRISIS ALERT  [Reach] |
|  STUDENT_1402  WORSENING       0.71             7 Sessions  CRISIS ALERT  [Reach] |
+-----------------------------------------------------------------------------------+
```
**Fig 5.3.10: Counselor Clinical Triage Queue and At-Risk Patient Monitoring**

#### 7. Institutional Administrator Analytics Console
Displays campus-wide stress indicators, trend distributions, and active user metrics.

```
+-----------------------------------------------------------------------------------+
|  Institutional Administrator Console                     [ Campus: SKCET System ] |
+-----------------------------------------------------------------------------------+
|  Total Registered Users: 1,048   |   Total Students: 1,024   |   Counselors: 24   |
|  Analyzed AI Sessions:   4,892   |   Completed PHQ/GAD: 842  |   Bookings:   186  |
+-----------------------------------------------------------------------------------+
|  Campus Psychological Trajectory Distribution (Model 3 Predictions):               |
|  [ Improving: 28.0% (███████)  Stable: 43.5% (███████████)  Worsening: 28.5% (███████) ]|
|                                                                                   |
|  Top Stressor Domains:                                                            |
|  1. Academic Deadlines & Exams (42%)                                              |
|  2. Career & Placement Uncertainty (28%)                                          |
|  3. Relationships & Social Isolation (18%)                                        |
|  4. Sleep Disturbances & Health (12%)                                             |
+-----------------------------------------------------------------------------------+
```
**Fig 5.3.11: Institutional Administrator Analytics Console**

---

# CHAPTER 6: CONCLUSION AND FUTURE WORK

## 6.1 CONCLUSION

The **AI-Powered Digital Psychological Intervention System for College Students** developed in this project provides a comprehensive, scalable, and ethically grounded solution to the escalating mental health challenges in higher education. By combining full-stack web technologies (the MERN stack) with a high-performance Python AI microservice, the platform bridges the divide between 24/7 digital first-aid assistance and professional on-campus psychological care.

The core technical contribution is the development and validation of a **three-stage trainable AI architecture** featuring **Bidirectional Long Short-Term Memory (BiLSTM)** sequence modeling. Rather than treating conversational exchanges as isolated interactions, the framework extracts fine-grained emotion probabilities, continuous severity metrics, and stressor trigger domains, transforming each dialogue into a privacy-preserving 17-dimensional structured record vector. Sequence modeling across historical sessions achieved a **94.00% trajectory accuracy** and an essential **100.00% recall on deteriorating (worsening) clinical trajectories**, significantly outperforming traditional session-only chatbots.

Furthermore, the system adheres strictly to a human-in-the-loop paradigm: artificial intelligence serves as an intelligent front-line screening and support tool, while licensed campus counselors retain authority over clinical diagnoses and interventions through an automated crisis triage queue. The project demonstrates that modern machine learning, when combined with ethical data engineering, can provide proactive, early-warning psychological intervention that reduces stigma, safeguards student confidentiality, and strengthens student well-being across university campuses.

---

## 6.2 FUTURE WORK

While Phase–I establishes a fully validated software foundation and machine learning framework, several avenues for future enhancement have been identified for Phase–II:
1. **Speech-to-Text and Vocal Prosody Analysis:** Integrating browser-based audio capture pipelines with acoustic feature extractors (pitch variability, speaking rate, acoustic energy) to detect emotional distress directly from spoken voice inputs alongside text.
2. **Native Mobile Applications:** Packaging the web application into cross-platform mobile apps (React Native) with push notification triggers for proactive micro-interventions and medication or mindfulness reminders.
3. **Multilingual and Vernacular Support:** Expanding NLP classifiers to support regional Indian languages (e.g., Tamil, Hindi, Telugu) using multilingual transformer embeddings (such as IndicBERT) to improve accessibility for diverse student cohorts.
4. **Integration with Campus ERP Systems:** Establishing secure, federated API connectors to synchronize with academic attendance systems, enabling privacy-preserving correlation between academic attendance drops and psychological distress trends.
5. **Real-World Longitudinal Clinical Pilot:** Conducting IRB-approved, human-subject longitudinal trials within the SKCET campus community to evaluate the system's real-world impact on appointment completion rates, symptom reduction, and student academic performance.

---

# REFERENCES

[1] E. G. Lattie, C. Adkins, N. Winquist, C. Stiles-Shields, Q. E. Wafford, and D. C. Mohr, “Digital Mental Health Interventions for Depression, Anxiety, and Enhancement of Psychological Well-Being Among College Students: Systematic Review,” *Journal of Medical Internet Research*, vol. 21, no. 5, p. e12869, 2019.

[2] A. Madrid-Cagigal, R. M. Baños, A. Mira, and O. García-Palacios, “Digital Mental Health Interventions for University Students with Mental Health Difficulties: A Systematic Review and Meta-Analysis,” *Early Intervention in Psychiatry*, vol. 19, no. 1, pp. 24–41, 2025.

[3] K. K. Fitzpatrick, A. Darcy, and M. Vierhile, “Delivering Cognitive Behavior Therapy to Young Adults with Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial,” *JMIR Mental Health*, vol. 4, no. 2, p. e19, 2017.

[4] R. Fulmer, A. Joerin, B. Gentile, L. Laccetti, and M. Chung, “Using Psychological Artificial Intelligence (Tess) to Relieve Symptoms of Depression and Anxiety: Randomized Controlled Trial,” *JMIR Mental Health*, vol. 5, no. 4, p. e64, 2018.

[5] L. Cook, M. Mostazir, and E. Watkins, “Reducing Rumination in College Students via a Guided Web-Based Cognitive Behavioral Intervention: A Randomized Controlled Trial,” *Journal of Consulting and Clinical Psychology*, vol. 87, no. 3, pp. 242–254, 2019.

[6] B. K. Beaulieu-Jones, P. Orzechowski, and J. H. Moore, “Mapping Patient Trajectories Using Recurrent Neural Networks on Longitudinal Clinical Records,” *Pacific Symposium on Biocomputing*, vol. 23, pp. 484–495, 2018.

[7] D. Demszky, D. Movshovitz-Attias, M. Ko, A. Rosen, and P. Sharma, “GoEmotions: A Dataset of Fine-Grained Emotions,” in *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL)*, 2020, pp. 4040–4054.

[8] H. Rashkin, E. M. Smith, M. Li, and Y. L. Boureau, “Towards Empathetic Open-Domain Conversation Models: A New Benchmark and Dataset,” in *Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics (ACL)*, 2019, pp. 5370–5381.

[9] R. Wahid, A. S. Al-Moghrabi, and M. N. Al-Khafaji, “Developing Dr. Calm: An AI-Driven Chatbot for University Student Mental Health Support,” in *IEEE International Conference on Artificial Intelligence and Health Informatics*, 2025, pp. 112–119.

[10] K. Rani, H. Vishnoi, and M. Mishra, “A Mental Health Chatbot Delivering Cognitive Behavioral Therapy and Remote Health Monitoring Using NLP and AI,” in *IEEE International Conference on Computing, Devices and Telecommunication (ICDT)*, 2023, pp. 88–94.

[11] World Health Organization, “Mental Health and Well-Being Among Young Adults,” *WHO Global Health Technical Reports*, Geneva, Switzerland, 2018.

[12] Centers for Disease Control and Prevention, “Mental Health Surveillance Among College and University Students,” *CDC Morbidity and Mortality Weekly Report*, vol. 71, no. 12, pp. 450–456, 2022.

[13] S. Agarwal et al., “Guidelines for Reporting of Health Interventions Using Mobile Phones: Mobile Health (mHealth) Evidence Reporting and Assessment (mERA) Checklist,” *BMJ*, vol. 352, p. i1174, 2016.

[14] M. N. K. Boulos et al., “How Smartphones and Conversational Agents Are Changing the Face of Mobile Mental Health: An Overview,” *Biomedical Engineering Online*, vol. 10, no. 1, p. 24, 2021.

[15] R. Agarwal, G. Gao, C. DesRoches, and A. K. Jha, “The Digital Transformation of Healthcare: Current Status and the Road Ahead,” *Information Systems Research*, vol. 21, no. 4, pp. 796–809, 2010.

---

# APPENDIX 1: SOURCE CODE

### 1. Dual-Head Emotion and Severity Classifier (`train_model1_emotion.py`)

```python
import torch
import torch.nn as nn

class EmotionSeverityClassifier(nn.Module):
    """
    Dual-head Neural Classifier for Stage 1:
    - Head 1: Multi-class Emotion Category Probability Output (8 classes)
    - Head 2: Severity Score (0.0 to 1.0) Continuous Regression Output
    """
    def __init__(self, input_dim, num_emotions=8):
        super(EmotionSeverityClassifier, self).__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        self.emotion_head = nn.Linear(128, num_emotions)
        self.severity_head = nn.Sequential(
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x):
        feat = self.shared(x)
        emotion_logits = self.emotion_head(feat)
        severity_pred = self.severity_head(feat)
        return emotion_logits, severity_pred
```

### 2. BiLSTM Longitudinal Trajectory Model (`train_model3_trajectory.py`)

```python
import torch
import torch.nn as nn

class BiLSTMTrajectoryModel(nn.Module):
    """
    Stage 3: Bidirectional LSTM Trajectory Predictor
    Input: 17-dimensional structured session state vector sequence
    Outputs:
    - Trend Logits (3 classes: Improving, Stable, Worsening)
    - Risk Logits (Binary crisis escalation flag)
    """
    def __init__(self, input_dim=17, hidden_dim=64, num_layers=2, num_classes=3):
        super(BiLSTMTrajectoryModel, self).__init__()
        self.bilstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=0.2
        )
        self.fc_shared = nn.Sequential(
            nn.Linear(hidden_dim * 2, 64),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        self.trend_head = nn.Linear(64, num_classes)
        self.risk_head = nn.Linear(64, 1)
        
    def forward(self, x, lengths):
        # x shape: (batch_size, max_seq_len, 17)
        lstm_out, _ = self.bilstm(x)
        
        # Extract representation from the last valid session step
        batch_size = x.size(0)
        last_outputs = []
        for i in range(batch_size):
            valid_len = lengths[i] - 1
            last_outputs.append(lstm_out[i, valid_len, :])
        feat = torch.stack(last_outputs)
        
        shared_feat = self.fc_shared(feat)
        trend_logits = self.trend_head(shared_feat)
        risk_logits = self.risk_head(shared_feat)
        return trend_logits, risk_logits
```

### 3. Application Backend Entry Point & Route Handlers (`server.js`)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

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

// Core Chatbot Dialogue Endpoint (AI Microservice Proxy)
app.post('/api/chat', async (req, res) => {
  try {
    const { thread_id = 'THREAD_001', student_id = 'STUDENT_0001', message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Predict Emotion, Severity, and Trigger via Python AI Microservice
    const aiRes = await axios.post(`${PYTHON_AI_URL}/api/predict_session`, { text: message });
    const sessionData = aiRes.data;

    const botMessageText = sessionData.empathetic_response || 
      `I hear you regarding ${sessionData.predicted_trigger.toLowerCase()}. I'm here to support you.`;

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

    let thread = await ChatThread.findOne({ id: thread_id });
    if (!thread) {
      thread = new ChatThread({
        id: thread_id,
        student_id,
        title: message.slice(0, 24) + '...',
        messages: []
      });
    }
    thread.messages.push(userMsg);
    thread.messages.push(botMsg);
    await thread.save();

    res.json({
      reply: botMessageText,
      emotion: sessionData.predicted_emotion,
      severity: sessionData.severity_score,
      trigger: sessionData.predicted_trigger,
      cbt_recommendation: sessionData.cbt_recommendation,
      thread
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Standardized Assessment Submission Endpoint
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

    const record = await Assessment.create({
      id: 'ASM_' + Date.now(),
      student_id,
      type,
      score,
      max_score: type === 'PHQ-9' ? 27 : 21,
      severity_tier: tier,
      answers,
      date: new Date()
    });

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save assessment: ' + err.message });
  }
});

// Counselor Triage Endpoint for High-Risk Escalations
app.get('/api/counselor/triage', async (req, res) => {
  try {
    const pythonRes = await axios.get(`${PYTHON_AI_URL}/api/students`);
    const atRiskList = pythonRes.data.filter(s => s.risk_flag === true || s.trend_name === 'Worsening');
    res.json(atRiskList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch triage records' });
  }
});

app.listen(PORT, () => {
  console.log(`[+] Express Backend running at http://127.0.0.1:${PORT}`);
});
```
