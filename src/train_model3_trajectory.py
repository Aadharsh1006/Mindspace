import os
import json
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, recall_score, precision_score
from sklearn.model_selection import train_test_split

class BiLSTMTrajectoryModel(nn.Module):
    """
    Primary Model 3: Bidirectional LSTM Trajectory Predictor
    Input per session: 17-dim feature vector
    Outputs:
    - Trend Logits (3 classes: Improving, Stable, Worsening)
    - Risk Logits (Binary flag)
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
        # x shape: (batch_size, max_seq_len, input_dim)
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

class TransformerTrajectoryModel(nn.Module):
    """
    Ablation Variant Model 3: Transformer Encoder Sequence Predictor
    """
    def __init__(self, input_dim=17, d_model=64, nhead=4, num_layers=2, num_classes=3):
        super(TransformerTrajectoryModel, self).__init__()
        self.embedding = nn.Linear(input_dim, d_model)
        encoder_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=nhead, dim_feedforward=128, batch_first=True)
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.fc_shared = nn.Sequential(
            nn.Linear(d_model, 64),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        self.trend_head = nn.Linear(64, num_classes)
        self.risk_head = nn.Linear(64, 1)
        
    def forward(self, x, lengths):
        emb = self.embedding(x)
        enc_out = self.transformer_encoder(emb)
        batch_size = x.size(0)
        last_outputs = []
        for i in range(batch_size):
            valid_len = lengths[i] - 1
            last_outputs.append(enc_out[i, valid_len, :])
        feat = torch.stack(last_outputs)
        
        shared_feat = self.fc_shared(feat)
        trend_logits = self.trend_head(shared_feat)
        risk_logits = self.risk_head(shared_feat)
        return trend_logits, risk_logits

def prepare_sequence_tensors(dataset):
    """Extract input tensors, sequence lengths, and target labels."""
    max_seq_len = max(d['sequence_length'] for d in dataset)
    input_dim = 17
    
    N = len(dataset)
    X = np.zeros((N, max_seq_len, input_dim), dtype=np.float32)
    lengths = np.zeros(N, dtype=np.int64)
    y_trend = np.zeros(N, dtype=np.int64)
    y_risk = np.zeros(N, dtype=np.float32)
    
    for i, item in enumerate(dataset):
        seq = item['sessions']
        L = len(seq)
        lengths[i] = L
        y_trend[i] = item['trend_label']
        y_risk[i] = item['risk_flag']
        
        for t in range(L):
            s = seq[t]
            # Construct 17-dim vector: 8 emo + 1 sev + 7 trig + 1 delta
            v = s['emotion_probs'] + [s['severity_score']] + s['trigger_vector'] + [s['days_delta'] / 14.0]
            X[i, t, :] = np.array(v, dtype=np.float32)
            
    return X, lengths, y_trend, y_risk, max_seq_len

def train_and_evaluate():
    print("=" * 60)
    print("[Phase 6] Training Model 3: Trajectory Predictor (BiLSTM & Transformer)")
    print("=" * 60)
    
    json_path = "data/simulated_longitudinal_sequences.json"
    if not os.path.exists(json_path):
        from simulate_sequences import generate_simulated_sequences
        dataset = generate_simulated_sequences()
    else:
        with open(json_path, "r") as f:
            dataset = json.load(f)
            
    X, lengths, y_trend, y_risk, max_seq_len = prepare_sequence_tensors(dataset)
    
    # 80/10/10 Split
    indices = np.arange(len(dataset))
    idx_train, idx_temp, y_tr_train, y_tr_temp = train_test_split(indices, y_trend, test_size=0.20, random_state=42, stratify=y_trend)
    idx_val, idx_test, y_tr_val, y_tr_test = train_test_split(idx_temp, y_tr_temp, test_size=0.50, random_state=42, stratify=y_tr_temp)
    
    print(f"[*] Trajectory Data Splits: Train={len(idx_train)}, Val={len(idx_val)}, Test={len(idx_test)}")
    
    # Class weights for Cross-Entropy Loss to prioritize minority worsening class
    class_counts = np.bincount(y_tr_train)
    weights = torch.tensor(len(y_tr_train) / (len(class_counts) * class_counts), dtype=torch.float32)
    print(f"[*] Calculated Loss Class Weights: {weights.tolist()}")
    
    def train_model(model, name, save_dir):
        os.makedirs(save_dir, exist_ok=True)
        ce_fn = nn.CrossEntropyLoss(weight=weights)
        bce_fn = nn.BCEWithLogitsLoss()
        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
        
        X_tr = torch.tensor(X[idx_train])
        L_tr = torch.tensor(lengths[idx_train])
        yt_tr = torch.tensor(y_trend[idx_train], dtype=torch.long)
        yr_tr = torch.tensor(y_risk[idx_train]).unsqueeze(1)
        
        X_va = torch.tensor(X[idx_val])
        L_va = torch.tensor(lengths[idx_val])
        yt_va = torch.tensor(y_trend[idx_val], dtype=torch.long)
        yr_va = torch.tensor(y_risk[idx_val]).unsqueeze(1)
        
        epochs = 30
        batch_size = 32
        best_val_f1 = 0.0
        
        for epoch in range(1, epochs + 1):
            model.train()
            perm = torch.randperm(len(idx_train))
            
            for i in range(0, len(idx_train), batch_size):
                b_idx = perm[i:i+batch_size]
                bx, bl, byt, byr = X_tr[b_idx], L_tr[b_idx], yt_tr[b_idx], yr_tr[b_idx]
                
                optimizer.zero_grad()
                trend_logits, risk_logits = model(bx, bl)
                
                l_trend = ce_fn(trend_logits, byt)
                l_risk = bce_fn(risk_logits, byr)
                loss = l_trend + 1.5 * l_risk
                
                loss.backward()
                optimizer.step()
                
            model.eval()
            with torch.no_grad():
                val_t_logits, _ = model(X_va, L_va)
                val_preds = torch.argmax(val_t_logits, dim=1).numpy()
                val_f1 = f1_score(y_trend[idx_val], val_preds, average='macro')
                
            if val_f1 > best_val_f1:
                best_val_f1 = val_f1
                torch.save(model.state_dict(), os.path.join(save_dir, "best_model.pt"))
                
        # Evaluate on Test Set
        model.load_state_dict(torch.load(os.path.join(save_dir, "best_model.pt")))
        model.eval()
        
        X_te = torch.tensor(X[idx_test])
        L_te = torch.tensor(lengths[idx_test])
        
        with torch.no_grad():
            test_t_logits, test_r_logits = model(X_te, L_te)
            test_preds = torch.argmax(test_t_logits, dim=1).numpy()
            test_risk_preds = (torch.sigmoid(test_r_logits).numpy().flatten() >= 0.5).astype(int)
            
        acc = accuracy_score(y_trend[idx_test], test_preds)
        macro_f1 = f1_score(y_trend[idx_test], test_preds, average='macro')
        weighted_f1 = f1_score(y_trend[idx_test], test_preds, average='weighted')
        
        # Worsening Class Recall (Class 2)
        worsening_recall = recall_score(y_trend[idx_test], test_preds, labels=[2], average='macro')
        risk_acc = accuracy_score(y_risk[idx_test], test_risk_preds)
        cm = confusion_matrix(y_trend[idx_test], test_preds)
        
        print("\n" + "=" * 60)
        print(f"EVALUATION: {name}")
        print("=" * 60)
        print(f"[+] Trend Classification Accuracy:     {acc:.4f}")
        print(f"[+] Trend Classification Macro-F1:     {macro_f1:.4f}")
        print(f"[+] Trend Classification Weighted-F1:  {weighted_f1:.4f}")
        print(f"[+] CRITICAL: Worsening Class Recall:  {worsening_recall:.4f}")
        print(f"[+] Risk Flag Prediction Accuracy:     {risk_acc:.4f}")
        print("\nConfusion Matrix (Rows=True, Cols=Pred: Improving, Stable, Worsening):")
        print(cm)
        
        metrics = {
            'model_name': name,
            'accuracy': float(acc),
            'macro_f1': float(macro_f1),
            'weighted_f1': float(weighted_f1),
            'worsening_recall': float(worsening_recall),
            'risk_accuracy': float(risk_acc),
            'confusion_matrix': cm.tolist()
        }
        with open(os.path.join(save_dir, "metrics.json"), "w") as f:
            json.dump(metrics, f, indent=2)
            
        return metrics

    # 1. Train Primary Model: BiLSTM
    bilstm_model = BiLSTMTrajectoryModel()
    bilstm_metrics = train_model(bilstm_model, "Primary BiLSTM Trajectory Model", "models/model3_bilstm")
    
    # 2. Train Ablation Model: Transformer Encoder
    transformer_model = TransformerTrajectoryModel()
    transformer_metrics = train_model(transformer_model, "Ablation Transformer Model", "models/model3_transformer")
    
    return bilstm_metrics, transformer_metrics

if __name__ == "__main__":
    train_and_evaluate()
