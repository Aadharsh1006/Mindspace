import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_workflow_diagram():
    os.makedirs("static/diagrams", exist_ok=True)
    fig, ax = plt.subplots(figsize=(12, 6), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)
    ax.axis('off')
    
    # Custom Palette
    bg_color = '#1e1e2e'
    card_color = '#313244'
    accent_blue = '#89b4fa'
    accent_green = '#a6e3a1'
    accent_red = '#f38ba8'
    accent_yellow = '#f9e2af'
    text_color = '#cdd6f4'
    
    fig.patch.set_facecolor(bg_color)
    
    boxes = [
        ("1. Student Interaction\n(Chat / Journal Entry)", (0.5, 2.2), 2.2, 1.6, accent_blue),
        ("2. Session Extraction\nModel 1 (Emotion/Sev)\nModel 2 (Trigger)", (3.2, 2.2), 2.4, 1.6, accent_yellow),
        ("3. Structured Store\n{Emotion, Sev, Trigger}\nSequence History", (6.0, 2.2), 2.4, 1.6, accent_green),
        ("4. Trajectory Model\nModel 3 (BiLSTM)\nPredicts Trend & Risk", (8.8, 2.2), 2.6, 1.6, accent_red),
    ]
    
    for text, (x, y), w, h, border in boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2", ec=border, fc=card_color, lw=2.5)
        ax.add_patch(rect)
        ax.text(x + w/2.0, y + h/2.0, text, color=text_color, fontsize=10, fontweight='bold', ha='center', va='center')
        
    # Flow Arrows
    arrows = [
        ((2.8, 3.0), (3.3, 3.0)),
        ((5.7, 3.0), (6.1, 3.0)),
        ((8.5, 3.0), (8.9, 3.0))
    ]
    for p1, p2 in arrows:
        ax.annotate("", xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", color='#cdd6f4', lw=2.5))
        
    # Decision Branching
    ax.annotate("Self-Care / Resource", xy=(10.1, 4.8), xytext=(10.1, 4.0),
                arrowprops=dict(arrowstyle="->", color=accent_green, lw=2.0),
                color=accent_green, fontsize=9, fontweight='bold', ha='center')
                
    ax.annotate("Counselor Escalation", xy=(10.1, 1.0), xytext=(10.1, 2.1),
                arrowprops=dict(arrowstyle="->", color=accent_red, lw=2.0),
                color=accent_red, fontsize=9, fontweight='bold', ha='center')
                
    plt.title("Figure 1: End-to-End System Workflow Diagram", color='#cdd6f4', fontsize=14, fontweight='bold', pad=15)
    plt.tight_layout()
    output_path = "static/diagrams/Fig1_workflow.png"
    plt.savefig(output_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"[+] Saved Workflow Diagram to {output_path}")

def create_architecture_diagram():
    os.makedirs("static/diagrams", exist_ok=True)
    fig, ax = plt.subplots(figsize=(12, 7), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7)
    ax.axis('off')
    
    bg_color = '#11111b'
    card_color = '#1e1e2e'
    fig.patch.set_facecolor(bg_color)
    
    # 3 Stage Modules
    stages = [
        ("STAGE 1: Session Emotion/Severity Classifier", "Model 1: DistilBERT Multi-Head Classifier\nOutputs: 8 Emotion Probs + Continuous Severity s_t", (0.5, 4.5), 11.0, 1.8, '#89b4fa'),
        ("STAGE 2: Session Trigger Category Classifier", "Model 2: Sentence-Transformer + XGBoost GBDT\nOutputs: 7-Class Trigger Probability Vector tr_t", (0.5, 2.4), 11.0, 1.8, '#a6e3a1'),
        ("STAGE 3: Longitudinal Sequence Trajectory Predictor", "Model 3: BiLSTM Trajectory Predictor & Risk Flag\nConsumes Sequence {e_t, s_t, tr_t, delta_t} -> Trend (Improving/Stable/Worsening) + Risk Alert", (0.5, 0.3), 11.0, 1.8, '#f38ba8')
    ]
    
    for title, desc, (x, y), w, h, border in stages:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2", ec=border, fc=card_color, lw=2.5)
        ax.add_patch(rect)
        ax.text(x + 0.3, y + h - 0.4, title, color=border, fontsize=12, fontweight='bold', ha='left')
        ax.text(x + 0.3, y + h/2.0 - 0.2, desc, color='#cdd6f4', fontsize=10, ha='left', va='center')
        
    plt.title("Figure 2: 3-Stage AI Model Architecture Diagram", color='#cdd6f4', fontsize=14, fontweight='bold', pad=15)
    plt.tight_layout()
    output_path = "static/diagrams/Fig2_architecture.png"
    plt.savefig(output_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"[+] Saved Architecture Diagram to {output_path}")

if __name__ == "__main__":
    create_workflow_diagram()
    create_architecture_diagram()
