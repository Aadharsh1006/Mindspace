import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, precision_recall_fscore_support
from sklearn.preprocessing import LabelEncoder
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_loader import load_or_generate_datasets, get_train_val_test_splits

def train_model2():
    print("=" * 60)
    print("[Phase 4] Training Model 2: Trigger Category Classifier")
    print("=" * 60)
    
    data_dir = "data"
    model_dir = "models/model2_trigger"
    os.makedirs(model_dir, exist_ok=True)
    
    df = load_or_generate_datasets(data_dir)
    train_df, val_df, test_df = get_train_val_test_splits(df, label_col='trigger')
    
    label_encoder = LabelEncoder()
    train_y = label_encoder.fit_transform(train_df['trigger'])
    val_y = label_encoder.transform(val_df['trigger'])
    test_y = label_encoder.transform(test_df['trigger'])
    
    trigger_classes = list(label_encoder.classes_)
    print(f"[*] Trigger Categories ({len(trigger_classes)}): {trigger_classes}")
    
    # Dense Text Embedding Feature Matrix (Dense Sentence Representation)
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 3))
    train_x = vectorizer.fit_transform(train_df['text']).toarray()
    val_x = vectorizer.transform(val_df['text']).toarray()
    test_x = vectorizer.transform(test_df['text']).toarray()
    
    # Save Feature Extractor & Label Encoder
    joblib.dump(vectorizer, os.path.join(model_dir, "trigger_vectorizer.pkl"))
    joblib.dump(label_encoder, os.path.join(model_dir, "trigger_encoder.pkl"))
    
    # Train Gradient Boosted Decision Tree Classifier (XGBoost Architecture)
    print("[*] Training Gradient-Boosted Decision Tree Classifier...")
    clf = HistGradientBoostingClassifier(
        max_iter=100,
        learning_rate=0.08,
        max_depth=6,
        random_state=42
    )
    clf.fit(train_x, train_y)
    
    # Save Model
    joblib.dump(clf, os.path.join(model_dir, "xgboost_trigger_model.pkl"))
    
    # Test Evaluation
    test_preds = clf.predict(test_x)
    test_acc = accuracy_score(test_y, test_preds)
    test_macro_f1 = f1_score(test_y, test_preds, average='macro')
    test_weighted_f1 = f1_score(test_y, test_preds, average='weighted')
    
    print("\n" + "=" * 60)
    print("MODEL 2 EVALUATION RESULTS ON HELD-OUT TEST SET")
    print("=" * 60)
    print(f"[+] Trigger Classification Accuracy:    {test_acc:.4f}")
    print(f"[+] Trigger Classification Macro-F1:    {test_macro_f1:.4f}")
    print(f"[+] Trigger Classification Weighted-F1: {test_weighted_f1:.4f}")
    print("\nDetailed Classification Report:")
    print(classification_report(test_y, test_preds, target_names=trigger_classes))
    
    metrics = {
        'accuracy': float(test_acc),
        'macro_f1': float(test_macro_f1),
        'weighted_f1': float(test_weighted_f1),
        'classes': trigger_classes
    }
    with open(os.path.join(model_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"[+] Model 2 successfully saved to {model_dir}/xgboost_trigger_model.pkl")
    return metrics

if __name__ == "__main__":
    train_model2()
