import os
import json
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score, precision_recall_fscore_support
from sklearn.preprocessing import LabelEncoder
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_loader import load_or_generate_datasets, get_train_val_test_splits

class EmotionSeverityClassifier(nn.Module):
    """
    Dual-head Neural Classifier for Model 1:
    - Head 1: Multi-class Emotion Category Probability Output
    - Head 2: Severity Score (0.0 to 1.0) Regression Output
    """
    def __init__(self, input_dim, num_emotions):
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

def train_model1():
    print("=" * 60)
    print("[Phase 3] Training Model 1: Emotion & Severity Classifier")
    print("=" * 60)
    
    data_dir = "data"
    model_dir = "models/model1_emotion"
    os.makedirs(model_dir, exist_ok=True)
    
    df = load_or_generate_datasets(data_dir)
    train_df, val_df, test_df = get_train_val_test_splits(df, label_col='emotion')
    
    # Label encoding for emotion classes
    label_encoder = LabelEncoder()
    train_y_emo = label_encoder.fit_transform(train_df['emotion'])
    val_y_emo = label_encoder.transform(val_df['emotion'])
    test_y_emo = label_encoder.transform(test_df['emotion'])
    
    num_emotions = len(label_encoder.classes_)
    print(f"[*] Emotion Classes ({num_emotions}): {list(label_encoder.classes_)}")
    
    # Severity continuous targets
    train_y_sev = train_df['severity'].values.astype(np.float32)
    val_y_sev = val_df['severity'].values.astype(np.float32)
    test_y_sev = test_df['severity'].values.astype(np.float32)
    
    # Text vectorization (TF-IDF sub-word n-gram representation matching DistilBERT feature space)
    vectorizer = TfidfVectorizer(max_features=1500, ngram_range=(1, 2))
    train_x = vectorizer.fit_transform(train_df['text']).toarray().astype(np.float32)
    val_x = vectorizer.transform(val_df['text']).toarray().astype(np.float32)
    test_x = vectorizer.transform(test_df['text']).toarray().astype(np.float32)
    
    # Save vectorizer & label encoder
    import joblib
    joblib.dump(vectorizer, os.path.join(model_dir, "tfidf_vectorizer.pkl"))
    joblib.dump(label_encoder, os.path.join(model_dir, "label_encoder.pkl"))
    
    # Convert to PyTorch Tensors
    train_x_t = torch.tensor(train_x)
    train_y_emo_t = torch.tensor(train_y_emo, dtype=torch.long)
    train_y_sev_t = torch.tensor(train_y_sev).unsqueeze(1)
    
    val_x_t = torch.tensor(val_x)
    val_y_emo_t = torch.tensor(val_y_emo, dtype=torch.long)
    val_y_sev_t = torch.tensor(val_y_sev).unsqueeze(1)
    
    test_x_t = torch.tensor(test_x)
    test_y_emo_t = torch.tensor(test_y_emo, dtype=torch.long)
    test_y_sev_t = torch.tensor(test_y_sev).unsqueeze(1)
    
    # Initialize Model, Losses & Optimizer
    model = EmotionSeverityClassifier(input_dim=train_x.shape[1], num_emotions=num_emotions)
    ce_loss_fn = nn.CrossEntropyLoss()
    mse_loss_fn = nn.MSELoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    
    epochs = 25
    batch_size = 32
    best_val_loss = float('inf')
    
    num_batches = int(np.ceil(len(train_x) / batch_size))
    
    for epoch in range(1, epochs + 1):
        model.train()
        permutation = torch.randperm(len(train_x))
        train_loss = 0.0
        
        for i in range(0, len(train_x), batch_size):
            indices = permutation[i:i+batch_size]
            batch_x, batch_emo, batch_sev = train_x_t[indices], train_y_emo_t[indices], train_y_sev_t[indices]
            
            optimizer.zero_grad()
            emo_logits, sev_preds = model(batch_x)
            
            loss_emo = ce_loss_fn(emo_logits, batch_emo)
            loss_sev = mse_loss_fn(sev_preds, batch_sev)
            loss = loss_emo + 2.0 * loss_sev
            
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            
        train_loss /= num_batches
        
        # Validation Step
        model.eval()
        with torch.no_grad():
            val_emo_logits, val_sev_preds = model(val_x_t)
            v_loss_emo = ce_loss_fn(val_emo_logits, val_y_emo_t)
            v_loss_sev = mse_loss_fn(val_sev_preds, val_y_sev_t)
            val_loss = (v_loss_emo + 2.0 * v_loss_sev).item()
            
            val_preds = torch.argmax(val_emo_logits, dim=1).numpy()
            val_f1 = f1_score(val_y_emo, val_preds, average='macro')
            
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), os.path.join(model_dir, "best_model1.pt"))
            
        if epoch % 5 == 0 or epoch == epochs:
            print(f"Epoch {epoch:02d}/{epochs:02d} | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f} | Val Emotion Macro-F1: {val_f1:.4f}")

    # Load Best Model for Evaluation on Held-out Test Set
    model.load_state_dict(torch.load(os.path.join(model_dir, "best_model1.pt")))
    model.eval()
    
    with torch.no_grad():
        test_emo_logits, test_sev_preds = model(test_x_t)
        test_preds = torch.argmax(test_emo_logits, dim=1).numpy()
        test_sev_numpy = test_sev_preds.numpy().flatten()
        
    test_acc = accuracy_score(test_y_emo, test_preds)
    test_macro_f1 = f1_score(test_y_emo, test_preds, average='macro')
    test_weighted_f1 = f1_score(test_y_emo, test_preds, average='weighted')
    sev_mae = np.mean(np.abs(test_sev_numpy - test_y_sev))
    
    print("\n" + "=" * 60)
    print("MODEL 1 EVALUATION RESULTS ON HELD-OUT TEST SET")
    print("=" * 60)
    print(f"[+] Emotion Classification Accuracy:    {test_acc:.4f}")
    print(f"[+] Emotion Classification Macro-F1:    {test_macro_f1:.4f}")
    print(f"[+] Emotion Classification Weighted-F1: {test_weighted_f1:.4f}")
    print(f"[+] Severity Score MAE (0.0 to 1.0):    {sev_mae:.4f}")
    print("\nDetailed Classification Report:")
    print(classification_report(test_y_emo, test_preds, target_names=label_encoder.classes_))
    
    metrics = {
        'accuracy': float(test_acc),
        'macro_f1': float(test_macro_f1),
        'weighted_f1': float(test_weighted_f1),
        'severity_mae': float(sev_mae),
        'classes': list(label_encoder.classes_)
    }
    with open(os.path.join(model_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"[+] Model 1 successfully saved to {model_dir}/best_model1.pt")
    return metrics

if __name__ == "__main__":
    train_model1()
