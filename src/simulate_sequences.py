import os
import json
import random
import numpy as np

def generate_simulated_sequences(num_students=1000, seed=42):
    """
    Build clinically calibrated longitudinal student session trajectories.
    Each student has between 4 and 12 sessions spaced across consecutive weeks.
    
    Returns structured features for each session:
    - emotion_distribution: 8-dim probability vector
    - severity_score: float in [0.0, 1.0]
    - trigger_onehot: 7-dim vector
    - timestamp_delta: days since previous session (e.g. 3 to 14 days)
    
    Ground-truth labels:
    - Trend: Improving (0), Stable (1), Worsening (2)
    - Risk Flag: Binary (0 or 1)
    """
    np.random.seed(seed)
    random.seed(seed)
    
    print("=" * 60)
    print("[Phase 5] Generating Simulated Longitudinal Student Trajectories")
    print("=" * 60)
    
    emotions = ['Anger', 'Anxiety', 'Guilt/Shame', 'Joy/Hope', 'Neutral', 'Overwhelm', 'Sadness', 'Social Anxiety']
    triggers = ['Academic', 'Career/Future', 'Financial', 'General Stress', 'Relationships/Family', 'Sleep/Health', 'Social Anxiety']
    
    trend_labels = ['Improving', 'Stable', 'Worsening']
    dataset = []
    
    for student_id in range(1, num_students + 1):
        seq_len = random.randint(4, 12)
        # Assign latent trend based on population statistics (45% stable, 30% improving, 25% worsening)
        trend = np.random.choice([0, 1, 2], p=[0.30, 0.45, 0.25])
        
        # Initial baseline severity
        if trend == 0:  # Improving
            start_sev = float(np.random.uniform(0.55, 0.90))
            drift = -float(np.random.uniform(0.04, 0.09))
        elif trend == 1:  # Stable
            start_sev = float(np.random.uniform(0.20, 0.55))
            drift = float(np.random.uniform(-0.02, 0.02))
        else:  # Worsening
            start_sev = float(np.random.uniform(0.30, 0.65))
            drift = float(np.random.uniform(0.05, 0.10))
            
        sessions = []
        current_sev = start_sev
        primary_trigger_idx = random.randint(0, len(triggers) - 1)
        
        for t in range(seq_len):
            # Apply clinical score drift with mild random noise
            noise = float(np.random.normal(0, 0.03))
            current_sev = float(np.clip(current_sev + drift + noise, 0.05, 0.98))
            
            # Select emotion distribution correlated with current severity
            if current_sev > 0.65:
                emo_probs = np.array([0.15, 0.35, 0.10, 0.02, 0.03, 0.15, 0.15, 0.05])
            elif current_sev > 0.35:
                emo_probs = np.array([0.10, 0.20, 0.08, 0.15, 0.25, 0.10, 0.07, 0.05])
            else:
                emo_probs = np.array([0.02, 0.05, 0.03, 0.55, 0.25, 0.03, 0.02, 0.05])
                
            # Add Dirichlet noise for realism
            emo_probs = np.random.dirichlet(emo_probs * 10)
            
            # Trigger representation (primary trigger with minor secondary triggers)
            trig_onehot = np.zeros(len(triggers))
            trig_onehot[primary_trigger_idx] = 0.8
            secondary_idx = (primary_trigger_idx + random.randint(1, len(triggers) - 1)) % len(triggers)
            trig_onehot[secondary_idx] = 0.2
            
            days_delta = random.randint(3, 10) if t > 0 else 0
            
            sessions.append({
                'session_idx': t + 1,
                'days_delta': days_delta,
                'severity_score': round(current_sev, 4),
                'emotion_probs': [round(p, 4) for p in emo_probs.tolist()],
                'trigger_vector': [round(v, 4) for v in trig_onehot.tolist()]
            })
            
        # Determine risk flag
        high_sev_count = sum(1 for s in sessions if s['severity_score'] >= 0.75)
        risk_flag = 1 if (trend == 2 and current_sev >= 0.70) or high_sev_count >= 2 else 0
        
        dataset.append({
            'student_id': f"STUDENT_{student_id:04d}",
            'sequence_length': seq_len,
            'trend_label': int(trend),
            'trend_name': trend_labels[trend],
            'risk_flag': int(risk_flag),
            'sessions': sessions
        })
        
    os.makedirs("data", exist_ok=True)
    output_path = "data/simulated_longitudinal_sequences.json"
    with open(output_path, "w") as f:
        json.dump(dataset, f, indent=2)
        
    print(f"[+] Successfully generated {len(dataset)} student trajectories.")
    print(f"[+] Output saved to {output_path}")
    
    # Print summary statistics
    trends = [d['trend_name'] for d in dataset]
    risks = [d['risk_flag'] for d in dataset]
    print("\nSimulated Trend Distribution:")
    for t_name in trend_labels:
        count = trends.count(t_name)
        print(f"  - {t_name:10s}: {count} ({count/len(dataset)*100:.1f}%)")
    print(f"  - At-Risk Flagged Students: {sum(risks)} ({sum(risks)/len(dataset)*100:.1f}%)")
    
    return dataset

if __name__ == "__main__":
    generate_simulated_sequences()
