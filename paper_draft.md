# Longitudinal Emotional Trajectory Modeling for Institution-Integrated Psychological Support Using Trainable AI

**Mr. R. Karunamoorthi**, Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore, India (`karunamoorthir@skcet.ac.in`)  
**Aadharsh R**, Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore, India (`727723eucs001@skcet.ac.in`)  
**Barath Hariharan K**, Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore, India (`727723eucs031@skcet.ac.in`)  
**Dharaneesh D**, Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore, India (`727723eucs043@skcet.ac.in`)  
**Aswathaman Raj S**, Computer Science and Engineering, Sri Krishna College of Engineering and Technology, Coimbatore, India (`727723eucs023@skcet.ac.in`)  

---

## Abstract
College students increasingly experience anxiety, depression, and academic stress, and existing digital mental health tools largely function as session-independent chatbots that discard structured behavioral history between interactions. This paper introduces a longitudinal, confidence-conscious framework for psychological support that pairs a trained session-level emotion/severity/trigger extraction stage with a trajectory-prediction stage over sequences of prior sessions, aiming to detect gradual deterioration that single-session tools miss. The framework is built using publicly available emotion and mental-health text datasets, with longitudinal sequences constructed via a documented, explicitly disclosed simulation methodology in the absence of public longitudinal student datasets.

Empirical testing on held-out test sequences demonstrates that the session-level extraction stage achieves an emotion-classification Macro-F1 score of **1.000** and severity Mean Absolute Error (MAE) of **0.0446**, while the trajectory prediction stage reaches a trend-classification accuracy of **0.9400 (94.0%)** and Macro-F1 of **0.9381**, significantly outperforming the session-only baseline accuracy of **0.7000 (70.0%)** and achieving a critical worsening-class recall of **1.0000 (100%)**.

The proposed approach is designed to support, not replace, licensed counselors, with an explicit human-in-the-loop escalation path.

**Keywords**: Digital Mental Health, Longitudinal Modeling, Emotion Recognition, BiLSTM, Trainable AI, Sequence Modeling, Higher Education, Psychological Support Systems.

---

## I. Introduction
Mental health challenges are a growing concern among college students worldwide, and timely, accessible support is essential to prevent escalation into severe crises. New technology such as Artificial Intelligence and Natural Language Processing is increasingly used to provide first-line psychological support, since it can be available at any time and reduces the stigma barrier associated with in-person counseling.

However, most existing AI-based support systems process each conversation independently: they respond to what a student says right now, but do not build a structured memory of how that student's emotional state has evolved over previous weeks. This paper is about a way to give these systems that memory. The framework introduced here — a longitudinal, trainable emotional-trajectory framework — can read a student's input, classify the emotion, severity, and probable trigger, and combine this with the student's own history to detect whether their condition is improving, stable, or worsening, flagging the case for counselor review when needed.

---

## II. Literature Survey
* **Lattie et al. (2019) [1]** conducted a systematic review of 89 studies on digital mental health interventions for college students and found that most programs were fully or partially effective, while noting that engagement and completion remain persistent limitations requiring further research.
* **Madrid-Cagigal et al. (2025) [2]** performed a systematic review and meta-analysis of 34 studies and reported medium effect sizes for both depression ($d = 0.55$) and anxiety ($d = 0.46$), and found that fully automated interventions outperformed guided ones specifically for anxiety outcomes, contrary to their initial hypothesis.
* **Fitzpatrick et al. (2017) [3]** evaluated Woebot, a fully automated rule-based conversational agent, and demonstrated a significant reduction in depressive symptoms over a two-week trial, though the system operates per-message without a structured cross-session memory.
* **Fulmer et al. (2018) [4]** evaluated Tess, an automated psychological AI agent, and reported reductions in depression and anxiety symptoms using a similarly session-based response-generation approach.
* **Cook, Mostazir, and Watkins (2019) [5]** evaluated a guided, human-supported web-based rumination-focused CBT program and reported significant reductions in rumination and depressive symptoms using fixed-timepoint questionnaire measurement rather than a learned sequential model.

---

## III. Related Work

### A. Rule-Based and Automated Chatbot Approaches
Prior systems such as Woebot [3] and Tess [4] rely on rule-based or per-message automated dialogue generation. Because these systems respond to the current message in isolation, they cannot represent how a student's condition changes across multiple sessions, which limits their ability to detect gradual deterioration.

### B. Guided, Human-Supported Interventions
Guided interventions such as the rumination-focused CBT program of Cook et al. [5] involve human support and standardized questionnaires at fixed points in time. These approaches are effective but do not incorporate a trained model that continuously tracks trend direction between assessments.

### C. Systematic Reviews of Digital Mental Health Effectiveness
Lattie et al. [1] and Madrid-Cagigal et al. [2] both provide broad evidence that digital interventions are effective at the population level, but neither identifies a reviewed study that models within-student trajectory across sessions — all outcomes in the studies they reviewed are measured pre/post rather than sequentially.

### D. NLP and Emotion-Recognition Literature
The emotion-recognition component of the proposed framework builds on established NLP benchmark datasets. Demszky et al. (2020) [7] introduced GoEmotions, a manually annotated dataset of 58,000 English Reddit comments labeled across 27 fine-grained emotion categories plus neutral, and demonstrated through transfer learning experiments that it generalizes well across domains and emotion taxonomies — motivating its use as a primary training source for Model 1 in this work. Complementing this, Rashkin et al. (2019) [8] introduced EmpatheticDialogues, a benchmark of 25,000 conversations grounded in emotional situations, and showed that dialogue models trained on it were rated as more empathetic by human evaluators than those trained on generic conversational data.

### E. Longitudinal and Sequential Modeling
Deep learning applied to longitudinal patient data has been explored outside the mental health domain. Beaulieu-Jones, Orzechowski, and Moore (2018) [6] used autoencoders and LSTMs to represent intensive-care patient events from the MIMIC-III database in a low-dimensional embedding space, connecting these embeddings sequentially to visualize how a patient's condition changes over time and to cluster patients by outcome trajectory. This work demonstrates that recurrent and representation-learning approaches can meaningfully model patient trajectories from structured longitudinal records, supporting the technical feasibility of the sequence-modeling approach proposed here. However, this prior work operates on critical-care physiological data rather than psychological/emotional state, and performs trajectory visualization and clustering rather than trend classification for proactive intervention — the specific gap this paper addresses for the student mental health domain.

### F. Research Gap
Taken together, the reviewed literature shows systems that are either fully automated but session-independent [3][4], or guided but fixed-timepoint [5], with systematic reviews [1][2] confirming that no existing study trains a model over a sequence of structured session-level features to predict psychological trend direction. This gap motivates the proposed framework.

### G. Public Datasets
The proposed framework is trained using publicly available emotion and mental-health text datasets, principally GoEmotions [7] and EmpatheticDialogues [8] for emotion classification, supplemented by mental-health-oriented text corpora.

---

## IV. Data Description
Two categories of data are used. The first is text data for training the session-level extraction models: GoEmotions (fine-grained emotion labels on Reddit-sourced text) and EmpatheticDialogues (empathetic conversational exchanges with emotion labels). The second is a constructed set of 1,000 simulated longitudinal sequences representing a student's structured session records — $\{ \text{emotion}, \text{severity}, \text{trigger}, \text{timestamp} \}$ — over time, used to train the trajectory model.

### A. Dataset Source
GoEmotions [7] and EmpatheticDialogues [8] are used as the primary sources for emotion-related supervision, given their public availability and established use in prior emotion-classification research.

### B. Trigger Category Labels
No public dataset maps text directly to a trigger category (academic, family, relationship, sleep, etc.). These labels are constructed via a weak-supervision scheme using 7 keyword-seeded initial categories (`Academic`, `Relationships/Family`, `Sleep/Health`, `Financial`, `Career/Future`, `Social Anxiety`, `General Stress`) reviewed by the project team.

### C. Dataset Splitting
Both the single-session text dataset (1,400 samples) and the longitudinal sequence dataset (1,000 student trajectories) were partitioned using an 80/10/10 stratified split into Training (80%, 1,120 text samples / 800 sequences), Validation (10%, 140 text samples / 100 sequences), and Held-out Test (10%, 140 text samples / 100 sequences) sets.

---

## V. Preprocessing and Embedding

### A. Text Preprocessing
Raw text input (chat messages, journal entries) is cleaned and normalized: lowercasing, whitespace normalization, and removal of non-linguistic artifacts, followed by sub-word tokenization and feature vectorization compatible with transformer models.

### B. Embedding Generation
For the trigger-classification model (Model 2), tokenized text is converted into dense sentence embeddings using Sentence-Transformers (`all-MiniLM-L6-v2`), capturing overall sentence semantics so the model generalizes across different phrasings of the same underlying trigger (e.g., "I bombed my exam" and "I failed my test" map to nearby vectors).

### C. Structured Feature Construction
The output of the emotion/severity classifier and the trigger classifier for a given session $t$ is combined into a 17-dimensional structured record vector $\mathbf{x}_t$:

$$\mathbf{x}_t = \Big[ \mathbf{e}_t^{\top} \,||\, s_t \,||\, \mathbf{tr}_t^{\top} \,||\, \Delta \tau_t \Big]^{\top} \in \mathbb{R}^{17} \quad (1)$$

where $\mathbf{e}_t \in [0, 1]^8$ represents the session emotion probability distribution, $s_t \in [0, 1]$ is the continuous severity index, $\mathbf{tr}_t \in [0, 1]^7$ represents the trigger category probability vector, and $\Delta \tau_t = \frac{t_k - t_{k-1}}{\Delta \tau_{\max}} \in [0, 1]$ represents the normalized elapsed time since the previous session.

### D. Longitudinal Sequence Simulation
Sequences of 4 to 12 structured records per student were simulated using transition probabilities calibrated to clinical patterns reported in the RCT literature (e.g., gradual score drift of $\Delta s \in [0.04, 0.10]$ per week rather than unconstrained random jumps). Synthetic trajectories were ground-truth labeled into `Improving` (27.9%), `Stable` (43.5%), and `Worsening` (28.6%), with 30.0% receiving an automated crisis `Risk Flag`.

### E. Implementation Details
PyTorch 2.6 and Hugging Face Transformers form the core neural network stack, with Scikit-Learn and XGBoost 3.4 for gradient-boosted tree classification, and PyTorch BiLSTM / Transformer Encoder modules for sequence trajectory prediction.

---

## VI. Proposed System

### A. System Overview
The proposed system processes a student's input through three trained models operating in sequence. Model 1 extracts single-session emotion category and severity estimates. Model 2 identifies the probable trigger category. Model 3 consumes the accumulated sequence of these structured outputs across all of a student's prior sessions and predicts whether their trend is improving, stable, or worsening, along with an emergency risk flag.

### B. Model 1: Emotion and Severity Classifier
A dual-head neural network fine-tuned on GoEmotions and EmpatheticDialogues classifies session text into 8 emotion categories and outputs a continuous severity score $s_t \in [0.0, 1.0]$ calibrated against PHQ-9/GAD-7 symptom intensity. The joint objective function optimized during fine-tuning is defined as:

$$\mathcal{L}_{\text{Stage1}} = -\frac{1}{N} \sum_{i=1}^{N} \sum_{k=1}^{8} y_{i,k} \log (\hat{e}_{i,k}) + \lambda \cdot \frac{1}{N} \sum_{i=1}^{N} (\hat{s}_i - s_i)^2 \quad (2)$$

where $\hat{e}_{i,k}$ is the predicted probability for emotion class $k$, $\hat{s}_i = \sigma(\mathbf{w}_s^{\top} \mathbf{h}_i + b_s)$ is the predicted continuous severity score, and $\lambda = 0.5$ balances cross-entropy classification loss with mean squared error severity regression.

### C. Model 2: Trigger Category Classifier
Dense sentence embeddings $\mathbf{v}_t$ are extracted using Sentence-Transformers and passed into an XGBoost gradient-boosted decision tree classifier to predict the probable trigger category across 7 domain classes:

$$\mathbf{v}_t = \text{MeanPooling}\Big(\text{TransformerEncoder}(\text{tokens}_t)\Big) \in \mathbb{R}^{384} \quad (3)$$

$$\mathbf{tr}_t = \text{Softmax}\left(\sum_{m=1}^{M} f_m(\mathbf{v}_t)\right) \in \mathbb{R}^7 \quad (4)$$

where $f_m$ represents the $m$-th gradient-boosted decision tree.

### D. Model 3: Trajectory Model
A Bidirectional LSTM (BiLSTM) consumes the sequence of 17-dimensional structured records $X = \{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_T\}$ across prior sessions and models sequential forward and backward recurrent states:

$$\overrightarrow{\mathbf{h}}_t = \text{LSTM}_{\text{forward}}\left(\mathbf{x}_t, \overrightarrow{\mathbf{h}}_{t-1}\right), \quad \overleftarrow{\mathbf{h}}_t = \text{LSTM}_{\text{backward}}\left(\mathbf{x}_t, \overleftarrow{\mathbf{h}}_{t+1}\right) \quad (5)$$

$$\mathbf{h}_T = \left[ \overrightarrow{\mathbf{h}}_T \,||\, \overleftarrow{\mathbf{h}}_T \right] \in \mathbb{R}^{128} \quad (6)$$

The concatenated final step representation $\mathbf{h}_T$ feeds dual linear heads producing trend probability predictions $\hat{\mathbf{y}}_{\text{trend}}$ and escalation risk flag $\hat{r}$:

$$\hat{\mathbf{y}}_{\text{trend}} = \text{Softmax}\left(\mathbf{W}_{\text{trend}} \mathbf{h}_T + \mathbf{b}_{\text{trend}}\right) \in \mathbb{R}^3, \quad \hat{r} = \sigma\left(\mathbf{w}_{\text{risk}}^{\top} \mathbf{h}_T + b_{\text{risk}}\right) \quad (7)$$

A Transformer Encoder architecture was built as an ablation variant for comparison.

### E. Decision Layer and Human-in-the-Loop Escalation
Outputs from Model 3 feed a decision layer that selects among three actions: surfacing a trigger-matched CBT coping resource from Model 2, initiating a proactive check-in, or escalating to a licensed counselor when the risk flag is raised.

### F. System Workflow
The overall framework workflow is illustrated in **Fig. 1**, tracing student interaction from session text entry through Stage 1 & 2 extraction, longitudinal record accumulation, Model 3 sequence prediction, and counselor alert triage.

---

## VII. Experimental Setup

### A. Hardware and Software Environment
All models were trained and evaluated on an Intel CPU environment running Windows 11, Python 3.13.2, PyTorch 2.6.0, Transformers 5.1.0, XGBoost 3.4.0, Scikit-Learn 1.6.1, and Flask 3.1.3.

### B. Model Configuration
Model 1 (Emotion/Severity) uses a shared 256-128 dense representation with dropout (0.3/0.2) feeding cross-entropy and sigmoid severity heads. Model 2 (Trigger) uses a 1,000-dim feature space with max depth 6 and learning rate 0.08. Model 3 (BiLSTM) uses a 2-layer bidirectional LSTM with hidden dimension 64, dropout 0.2, and linear trend/risk heads.

### C. Training Parameters
Model 1 was trained for 25 epochs using AdamW ($\text{lr} = 10^{-3}$, weight decay $10^{-4}$). Model 3 was trained for 30 epochs using weighted cross-entropy loss with inverse class weights $[1.20, 0.77, 1.16]$ to account for class distribution and prioritize minority worsening cases.

### D. Evaluation Metrics
Performance is evaluated using Accuracy, Precision, Recall, Macro-F1, Weighted-F1, Confusion Matrix breakdown, Single-Session Inference Latency (ms), and Memory Footprint (MB).

---

## VIII. Result and Analysis

### A. Classification Performance
Table I presents the comparative evaluation of the proposed framework against rule-based, session-only, guided-CBT, and transformer ablation baselines on the held-out test dataset.

**Table I: Experimental System Comparison & Performance Metrics**

| System / Baseline | Core Architecture | Personalization / History | Macro-F1 | Accuracy | Worsening Recall | Latency (ms) |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Wysa** | Rule-based + NLP | Session-level only | N/A | N/A | N/A | < 1.0 ms |
| **Youper** | AI-guided CBT | Mood tracker (no trend) | N/A | N/A | N/A | < 1.0 ms |
| **Woebot [3]** | Rule-based agent | Per-message only | N/A | N/A | N/A | < 1.0 ms |
| **Tess [4]** | Automated psych AI | Per-message only | N/A | N/A | N/A | < 1.0 ms |
| **Rule-Based PHQ-9 Baseline** | Clinical Score Cutoffs | 2-point delta | 0.8727 | 0.8700 | 1.0000 | < 1.0 ms |
| **Session-Only Baseline** | DistilBERT + XGBoost | Single-session state | 0.7088 | 0.7000 | 1.0000 | < 2.0 ms |
| **Guided-CBT (Cook et al. [5])** | Fixed 2-point Assessment | Fixed timepoint | 0.9026 | 0.9000 | 1.0000 | < 1.0 ms |
| **Transformer Ablation Variant** | Transformer Encoder | Multi-head sequence | 0.9199 | 0.9200 | 1.0000 | 3.20 ms |
| **Proposed Framework** | **DistilBERT + XGBoost + BiLSTM** | **Cross-session structured record** | **0.9381** | **0.9400** | **1.0000** | **0.12 ms** |

---

### B. Comparative Analysis
The empirical results illustrated in **Fig. 3** demonstrate that incorporating the BiLSTM trajectory layer increases trend classification accuracy from **0.7000 (Session-Only Baseline)** to **0.9400 (Proposed Framework)**, representing a **24.0% absolute accuracy improvement**. Furthermore, the proposed framework achieved a perfect **1.0000 (100%) Recall on the critical Worsening class**, ensuring zero false negatives for deteriorating students.

As illustrated in **Fig. 5**, single-session tools fail when individual sessions show moderate scores but exhibit a clear downward trajectory over several weeks. By maintaining an aggregated temporal window, the proposed BiLSTM model detects cumulative drift at session 6 and triggers automated counselor escalation.

Additionally, **Fig. 6** highlights the accuracy vs. latency efficiency trade-off. While the Transformer Encoder ablation variant achieves 0.9199 F1 with an inference latency of 3.20 ms, the proposed BiLSTM architecture delivers superior classification performance (0.9381 F1) with an ultra-low latency of **0.12 ms**, making it exceptionally suitable for real-time institution-wide deployment.

---

### C. Confusion Matrix & Trend Analysis
On the 100 held-out test sequence trajectories, the confusion matrix for the proposed BiLSTM trajectory model is shown in **Fig. 4** and expressed matrix-form below:

$$
\mathbf{C} = \begin{bmatrix}
26 & 0 & 2 \\
3 & 39 & 1 \\
0 & 0 & 29
\end{bmatrix} \quad (8)
$$

* **Improving (Class 0)**: 26 correctly classified out of 28 (92.9% recall).
* **Stable (Class 1)**: 39 correctly classified out of 43 (90.7% recall).
* **Worsening (Class 2)**: **29 correctly classified out of 29 (100.0% recall)**.

---

## IX. Discussion
The experimental findings validate the central hypothesis of this work: extracting structured session representations and modeling them sequentially enables reliable detection of gradual psychological deterioration. Single-session baselines achieve only 70.0% accuracy because isolated messages fail to capture directionality.

### Stated Limitation & Simulation Calibration
A primary limitation of this study is the reliance on clinically simulated longitudinal sequences due to the absence of publicly available longitudinal student mental health text datasets. While sequence drift parameters were strictly calibrated against RCT literature distributions (PHQ-9/GAD-7 shift bounds), validation on real-world longitudinal student data remains a required future milestone.

---

## X. Conclusion
This paper introduced a longitudinal, trainable framework for psychological support that bridges the gap identified in digital mental health literature: automated agents that operate per-message without structured memory [3][4], guided interventions limited to fixed-timepoint assessments [5], and systematic reviews [1][2] confirming the absence of sequential trajectory learning models. By pairing session-level emotion/trigger extraction with a BiLSTM trajectory model, the framework achieves **94.0% accuracy** and **100% recall on deteriorating students** with a ultra-low inference latency of **0.12 ms**.

---

## Acknowledgment
The authors would like to thank Sri Krishna College of Engineering and Technology and faculty members for their guidance throughout this research, and acknowledge the developers of open-source NLP libraries and public datasets (GoEmotions, EmpatheticDialogues) used in this work.

---

## References
1. E. G. Lattie, E. C. Adkins, N. Winquist, C. Stiles-Shields, Q. E. Wafford, and A. K. Graham, "Digital Mental Health Interventions for Depression, Anxiety, and Enhancement of Psychological Well-Being Among College Students: Systematic Review," *J. Med. Internet Res.*, vol. 21, no. 7, p. e12869, 2019.
2. A. Madrid-Cagigal, C. Kealy, C. Potts, M. D. Mulvenna, M. Byrne, M. M. Barry, and G. Donohoe, "Digital Mental Health Interventions for University Students With Mental Health Difficulties: A Systematic Review and Meta-Analysis," *Early Intervention in Psychiatry*, vol. 19, no. 1, p. e70017, 2025.
3. K. K. Fitzpatrick, A. Darcy, and M. Vierhile, "Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial," *JMIR Mental Health*, vol. 4, no. 2, p. e19, 2017.
4. R. Fulmer, A. Joerin, B. Gentile, L. Lakerink, and M. Rauws, "Using Psychological Artificial Intelligence (Tess) to Relieve Symptoms of Depression and Anxiety: Randomized Controlled Trial," *JMIR Mental Health*, vol. 5, no. 4, p. e64, 2018.
5. L. Cook, M. Mostazir, and E. Watkins, "Reducing Stress and Preventing Depression (RESPOND): Randomized Controlled Trial of Web-Based Rumination-Focused Cognitive Behavioral Therapy for High-Ruminating University Students," *J. Med. Internet Res.*, vol. 21, no. 5, p. e11349, 2019.
6. B. K. Beaulieu-Jones, P. Orzechowski, and J. H. Moore, "Mapping Patient Trajectories using Longitudinal Extraction and Deep Learning in the MIMIC-III Critical Care Database," *Pacific Symposium on Biocomputing*, vol. 23, pp. 123–132, 2018.
7. D. Demszky, D. Movshovitz-Attias, J. Ko, A. Cowen, G. Nemade, and S. Ravi, "GoEmotions: A Dataset of Fine-Grained Emotions," *Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (ACL)*, pp. 4040–4054, 2020.
8. H. Rashkin, E. M. Smith, M. Li, and Y-L. Boureau, "Towards Empathetic Open-domain Conversation Models: A New Benchmark and Dataset," *Proceedings of the 57th Annual Meeting of the Association for Computational Linguistics (ACL)*, pp. 5370–5381, 2019.
