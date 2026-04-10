"""
train_model.py
--------------
Trains the emotion detection model.

Usage:
    python train_model.py --mode lr       # Logistic Regression (fast)
    python train_model.py --mode bert     # DistilBERT fine-tuning (accurate)

Dataset: GoEmotions (Google)
  pip install datasets
  Auto-downloaded from HuggingFace Hub.

Outputs saved to: ./models/saved/
"""

import os
import argparse
import pickle
import numpy as np

# ─── Logistic Regression ────────────────────────────────────────────────────

def train_lr():
    from datasets import load_dataset
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import classification_report
    from sklearn.pipeline import Pipeline
    from utils.emotion_detector import clean_text, GO_EMOTIONS_MAP

    print("📥 Loading GoEmotions dataset…")
    ds = load_dataset("go_emotions", "simplified")

    label_names = ds["train"].features["labels"].feature.names

    def map_labels(example):
        mapped = set()
        for idx in example["labels"]:
            raw = label_names[idx]
            mapped.add(GO_EMOTIONS_MAP.get(raw, "neutral"))
        # Take the most severe if multiple
        priority = ["angry", "sad", "anxious", "happy", "neutral"]
        for p in priority:
            if p in mapped:
                example["emotion"] = p
                break
        else:
            example["emotion"] = "neutral"
        return example

    print("🔄 Mapping labels…")
    train_ds = ds["train"].map(map_labels)
    test_ds  = ds["test"].map(map_labels)

    X_train = [clean_text(t) for t in train_ds["text"]]
    y_train = train_ds["emotion"]
    X_test  = [clean_text(t) for t in test_ds["text"]]
    y_test  = test_ds["emotion"]

    print("🏋️  Training TF-IDF + Logistic Regression…")
    vectorizer = TfidfVectorizer(max_features=30_000, ngram_range=(1, 2), sublinear_tf=True)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec  = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=1000, C=5.0, solver="lbfgs", multi_class="multinomial", n_jobs=-1)
    model.fit(X_train_vec, y_train)

    y_pred = model.predict(X_test_vec)
    print(classification_report(y_test, y_pred))

    os.makedirs("./models/saved", exist_ok=True)
    with open("./models/saved/lr_model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open("./models/saved/tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(vectorizer, f)

    print("✅ LR model saved to ./models/saved/")


# ─── BERT Fine-tuning ────────────────────────────────────────────────────────

def train_bert():
    from datasets import load_dataset
    from transformers import (
        AutoTokenizer, AutoModelForSequenceClassification,
        TrainingArguments, Trainer, DataCollatorWithPadding,
    )
    import torch
    from utils.emotion_detector import clean_text, GO_EMOTIONS_MAP

    LABELS     = ["happy", "sad", "anxious", "angry", "neutral"]
    label2id   = {l: i for i, l in enumerate(LABELS)}
    id2label   = {i: l for l, i in label2id.items()}
    MODEL_NAME = "distilbert-base-uncased"

    print("📥 Loading GoEmotions dataset…")
    ds = load_dataset("go_emotions", "simplified")
    label_names = ds["train"].features["labels"].feature.names

    def map_and_encode(example):
        mapped = set()
        for idx in example["labels"]:
            raw = label_names[idx]
            mapped.add(GO_EMOTIONS_MAP.get(raw, "neutral"))
        priority = ["angry", "sad", "anxious", "happy", "neutral"]
        for p in priority:
            if p in mapped:
                example["label"] = label2id[p]
                break
        else:
            example["label"] = label2id["neutral"]
        example["text"] = clean_text(example["text"])
        return example

    print("🔄 Preprocessing…")
    ds = ds.map(map_and_encode).remove_columns(["labels"])

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    def tokenize(batch):
        return tokenizer(batch["text"], truncation=True, max_length=128)

    tokenized = ds.map(tokenize, batched=True)
    tokenized.set_format("torch", columns=["input_ids", "attention_mask", "label"])

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=5, id2label=id2label, label2id=label2id
    )

    args = TrainingArguments(
        output_dir="./models/saved/bert_emotion",
        num_train_epochs=3,
        per_device_train_batch_size=32,
        per_device_eval_batch_size=64,
        warmup_steps=200,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        logging_steps=100,
        fp16=torch.cuda.is_available(),
    )

    def compute_metrics(eval_pred):
        logits, labels = eval_pred
        preds = np.argmax(logits, axis=-1)
        return {"accuracy": (preds == labels).mean()}

    trainer = Trainer(
        model=model, args=args,
        train_dataset=tokenized["train"],
        eval_dataset=tokenized["validation"],
        tokenizer=tokenizer,
        data_collator=DataCollatorWithPadding(tokenizer),
        compute_metrics=compute_metrics,
    )

    print("🏋️  Fine-tuning DistilBERT…")
    trainer.train()
    trainer.save_model("./models/saved/bert_emotion")
    tokenizer.save_pretrained("./models/saved/bert_emotion")
    print("✅ BERT model saved to ./models/saved/bert_emotion/")


# ─── Entry point ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["lr", "bert"], default="lr",
                        help="Training mode: lr (Logistic Regression) or bert (DistilBERT)")
    args = parser.parse_args()

    if args.mode == "lr":
        train_lr()
    else:
        train_bert()
