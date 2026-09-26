import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style for publication-ready figures
plt.style.use('seaborn-v0_8-paper' if 'seaborn-v0_8-paper' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 11
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 10
plt.rcParams['figure.titlesize'] = 14

output_dir = r"c:\Users\aadha\OneDrive\Desktop\Final Year Project\results"
os.makedirs(output_dir, exist_ok=True)

# ---------------------------------------------------------
# Figure 1: Model Comparison Bar Chart (Accuracy & Macro-F1)
# ---------------------------------------------------------
fig, ax = plt.subplots(figsize=(8.5, 4.8), dpi=300)

models = [
    'Rule-Based\nPHQ-9',
    'Session-Only\nBaseline',
    'Guided-CBT\n(Cook et al.)',
    'Transformer\nAblation',
    'Proposed\nFramework'
]

accuracy = [0.8700, 0.7000, 0.9000, 0.9200, 0.9400]
macro_f1 = [0.8727, 0.7088, 0.9026, 0.9199, 0.9381]

x = np.arange(len(models))
width = 0.35

rects1 = ax.bar(x - width/2, [a*100 for a in accuracy], width, label='Accuracy (%)', color='#1f77b4', edgecolor='black', linewidth=0.8)
rects2 = ax.bar(x + width/2, [f*100 for f in macro_f1], width, label='Macro F1 (%)', color='#2ca02c', edgecolor='black', linewidth=0.8)

ax.set_ylabel('Performance Score (%)', fontweight='bold')
ax.set_title('Figure 3: Performance Comparison Across Baselines and Proposed Framework', pad=12, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(models, fontweight='bold')
ax.set_ylim(60, 100)
ax.grid(axis='y', linestyle='--', alpha=0.5)
ax.legend(loc='lower right', framealpha=0.95)

# Value labels on top of bars
def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax.annotate(f'{height:.1f}%',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=9, fontweight='bold')

autolabel(rects1)
autolabel(rects2)

plt.tight_layout()
fig1_path = os.path.join(output_dir, "figure3_model_comparison.png")
plt.savefig(fig1_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved {fig1_path}")

# ---------------------------------------------------------
# Figure 2: Confusion Matrix Heatmap for Proposed BiLSTM
# ---------------------------------------------------------
fig, ax = plt.subplots(figsize=(6, 5), dpi=300)

cm = np.array([
    [26, 0, 2],
    [3, 39, 1],
    [0, 0, 29]
])

classes = ['Improving', 'Stable', 'Worsening']

sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False,
            xticklabels=classes, yticklabels=classes,
            annot_kws={'size': 14, 'weight': 'bold'}, ax=ax,
            linewidths=1, linecolor='gray')

ax.set_title('Figure 4: Confusion Matrix for Proposed BiLSTM Trajectory Model', pad=12, fontweight='bold')
ax.set_xlabel('Predicted Trend Class', fontweight='bold', labelpad=8)
ax.set_ylabel('Ground Truth Class', fontweight='bold', labelpad=8)

plt.tight_layout()
fig2_path = os.path.join(output_dir, "figure4_confusion_matrix.png")
plt.savefig(fig2_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved {fig2_path}")

# ---------------------------------------------------------
# Figure 3: Student Longitudinal Emotional Trajectory Simulation
# ---------------------------------------------------------
fig, ax = plt.subplots(figsize=(8.5, 4.5), dpi=300)

sessions = np.arange(1, 9)
severity_scores = [0.28, 0.35, 0.42, 0.48, 0.58, 0.68, 0.76, 0.85]
single_session_threshold = 0.70

ax.plot(sessions, severity_scores, marker='o', color='#d62728', linewidth=2.5, markersize=8, label='Student Severity Score ($s_t$)')
ax.axhline(y=single_session_threshold, color='orange', linestyle='--', linewidth=1.8, label='Single-Session Static Threshold (0.70)')

# Highlight counselor escalation point
ax.axvline(x=6, color='red', linestyle=':', linewidth=2, label='BiLSTM Trajectory Worsening Flag (Session 6)')
ax.scatter([6], [0.68], color='red', s=150, zorder=5, edgecolor='black', linewidth=1.5)
ax.annotate('Escalation Alert Triggered!\n(Cumulative Drift Detected)',
            xy=(6, 0.68), xytext=(3.5, 0.75),
            arrowprops=dict(facecolor='black', shrink=0.08, width=1.5, headwidth=8),
            fontsize=9, fontweight='bold', bbox=dict(boxstyle='round,pad=0.4', facecolor='yellow', alpha=0.5))

ax.set_xlabel('Session Number (Time $t$)', fontweight='bold')
ax.set_ylabel('Extracted Severity Score ($s_t \in [0, 1]$)', fontweight='bold')
ax.set_title('Figure 5: Detection of Gradual Deterioration via Longitudinal Trajectory', pad=12, fontweight='bold')
ax.set_ylim(0.1, 1.0)
ax.set_xticks(sessions)
ax.grid(True, linestyle='--', alpha=0.5)
ax.legend(loc='upper left', framealpha=0.95)

plt.tight_layout()
fig3_path = os.path.join(output_dir, "figure5_trajectory_drift.png")
plt.savefig(fig3_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved {fig3_path}")

# ---------------------------------------------------------
# Figure 4: Latency vs Macro-F1 Efficiency Scatter Plot
# ---------------------------------------------------------
fig, ax = plt.subplots(figsize=(7, 4.5), dpi=300)

models_scatter = ['Rule-Based PHQ-9', 'Session-Only', 'Guided-CBT', 'Transformer Ablation', 'Proposed BiLSTM']
f1_scores = [0.8727, 0.7088, 0.9026, 0.9199, 0.9381]
latencies = [0.8, 1.5, 0.9, 3.20, 0.12]
colors = ['#7f7f7f', '#1f77b4', '#bcbd22', '#ff7f0e', '#d62728']

for i in range(len(models_scatter)):
    ax.scatter(latencies[i], f1_scores[i] * 100, color=colors[i], s=160, edgecolor='black', linewidth=1.2, zorder=4)
    offset_x = 0.1 if latencies[i] > 0.5 else 0.15
    offset_y = -0.8 if i == 4 else 0.5
    ax.annotate(models_scatter[i], (latencies[i] + offset_x, f1_scores[i] * 100 + offset_y), fontsize=9.5, fontweight='bold')

ax.set_xlabel('Inference Latency per Session (ms)', fontweight='bold')
ax.set_ylabel('Macro F1 Score (%)', fontweight='bold')
ax.set_title('Figure 6: Accuracy vs. Inference Latency Efficiency', pad=12, fontweight='bold')
ax.set_xlim(-0.2, 4.0)
ax.set_ylim(68, 96)
ax.grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
fig4_path = os.path.join(output_dir, "figure6_latency_vs_f1.png")
plt.savefig(fig4_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved {fig4_path}")
