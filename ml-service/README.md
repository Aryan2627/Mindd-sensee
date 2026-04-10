# Mind-Sense ML Service

FastAPI microservice for emotion detection and risk assessment.

## Endpoints

| Method | Path               | Description                        |
|--------|--------------------|------------------------------------|
| GET    | /health            | Service health check               |
| POST   | /predict-emotion   | Detect emotion from text           |
| POST   | /risk-detection    | Detect emotion + assess risk level |

## Training the model

### Option 1 — Logistic Regression (recommended to start)
```bash
pip install -r requirements.txt
python train_model.py --mode lr
```
Takes ~5 minutes on CPU. Achieves ~65% accuracy on 5-class emotion.

### Option 2 — DistilBERT fine-tuning (better accuracy)
```bash
python train_model.py --mode bert
```
Takes ~30 minutes on GPU (T4 or better). Achieves ~78% accuracy.

## Running

```bash
uvicorn main:app --reload --port 8000
```

## Example request

```bash
curl -X POST http://localhost:8000/predict-emotion \
  -H "Content-Type: application/json" \
  -d '{"text": "I feel really overwhelmed and anxious about everything"}'
```

Response:
```json
{
  "emotion": "anxious",
  "confidence": 0.84,
  "all_scores": {
    "happy": 0.03,
    "sad": 0.07,
    "anxious": 0.84,
    "angry": 0.02,
    "neutral": 0.04
  }
}
```
