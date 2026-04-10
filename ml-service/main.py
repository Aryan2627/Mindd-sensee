from fastapi import FastAPI
from pydantic import BaseModel
from utils.emotion_detector import detect_emotion
from utils.risk_detector import detect_risk
from utils.preprocess import clean_text
from fastapi.middleware.cors import CORSMiddleware

from collections import defaultdict

# 🧠 Memory storage
chat_memory = defaultdict(list)

# 🚀 FastAPI app
app = FastAPI()

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📥 Input schema
class TextInput(BaseModel):
    text: str

# 🏠 Home route
@app.get("/")
def home():
    return {"message": "Mind-Sense ML Service Running 🚀"}


# 🤖 SMART RESPONSE ENGINE
def generate_reply(user_id, text, emotion, risk):
    history = chat_memory[user_id]

    # 🧠 Get previous context
    previous_user = None
    for msg in reversed(history):
        if msg.startswith("User:"):
            previous_user = msg.replace("User:", "").strip()
            break

    # 🎯 Emotion-specific responses
    if emotion == "anxious":
        base = "It sounds like you're feeling anxious. That can be really overwhelming."
        suggestion = "Try slowing your breathing or taking a short break."
    elif emotion == "sad":
        base = "I'm really sorry you're feeling this way. It sounds like you're going through a tough time."
        suggestion = "Talking to someone you trust might help."
    elif emotion == "angry":
        base = "I can sense some frustration or anger."
        suggestion = "Taking a step back or going for a walk might help clear your mind."
    elif emotion == "happy":
        base = "That's great to hear! You seem to be feeling positive."
        suggestion = "Keep doing what’s making you feel good!"
    else:
        base = "I understand how you're feeling."
        suggestion = "I'm here to listen."

    # 🧠 Build reply with context
    if previous_user:
        reply = (
            f"{base} Earlier you mentioned '{previous_user}', "
            f"and now you said '{text}'. {suggestion}"
        )
    else:
        reply = f"{base} {suggestion}"

    # ⚠️ Risk handling
    if risk.lower() == "high":
        reply += (
            " If things feel too intense, please consider reaching out to a trusted person "
            "or a professional."
        )

    # 🧠 Save memory
    chat_memory[user_id].append(f"User: {text}")
    chat_memory[user_id].append(f"AI: {reply}")

    # 🧪 Debug (optional)
    print("🧠 MEMORY:", chat_memory[user_id])

    return reply


# 🧠 MAIN ROUTE
@app.post("/analyze")
def analyze(input: TextInput):
    cleaned = clean_text(input.text)

    # Emotion detection
    emotion_data = detect_emotion(cleaned)

    # Risk detection
    risk = detect_risk(cleaned, emotion_data["emotion"])

    user_id = "default_user"

    reply = generate_reply(
        user_id,
        input.text,
        emotion_data["emotion"],
        risk
    )

    return {
        "text": input.text,
        "emotion": emotion_data["emotion"],
        "confidence": emotion_data["confidence"],
        "secondary_emotion": emotion_data.get("secondary_emotion"),
        "secondary_confidence": emotion_data.get("secondary_confidence"),
        "risk": risk,
        "reply": reply
    }