from transformers import pipeline

# 🔥 Load strong emotion model
emotion_model = pipeline(
    "text-classification",
    model="SamLowe/roberta-base-go_emotions",
    top_k=None
)

# 🎯 Map detailed emotions → simplified categories
EMOTION_MAP = {
    # Happy
    "joy": "happy",
    "amusement": "happy",
    "approval": "happy",
    "gratitude": "happy",
    "love": "happy",
    "optimism": "happy",

    # Sad
    "sadness": "sad",
    "disappointment": "sad",
    "grief": "sad",
    "remorse": "sad",

    # Angry
    "anger": "angry",
    "annoyance": "angry",

    # Anxiety / Fear
    "fear": "anxious",
    "nervousness": "anxious",

    # Neutral
    "neutral": "neutral"
}

# 🧠 Keyword intelligence (rule-based layer)
KEYWORD_RULES = {
    "anxious": [
        "can't relax", "cannot relax", "stressed", "overwhelmed",
        "panic", "pressure", "burnout", "restless", "tense"
    ],
    "sad": [
        "lonely", "empty", "hopeless", "worthless",
        "cry", "depressed", "down"
    ],
    "angry": [
        "angry", "frustrated", "irritated", "annoyed"
    ]
}

# 🔥 Intensity words
INTENSITY_WORDS = [
    "very", "extremely", "so much", "too much",
    "really", "so", "completely"
]

# 🧠 Detect rule-based emotion
def keyword_emotion(text):
    text = text.lower()

    for emotion, words in KEYWORD_RULES.items():
        for word in words:
            if word in text:
                return emotion

    return None


# 🧠 Detect intensity boost
def get_intensity_multiplier(text):
    text = text.lower()

    for word in INTENSITY_WORDS:
        if word in text:
            return 1.2

    return 1.0


# 🚀 MAIN FUNCTION
def detect_emotion(text):
    try:
        # 🔥 Get predictions
        results = emotion_model(text)[0]

        # 🔥 Sort by confidence
        sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)

        # Top emotions
        top = sorted_results[0]
        second = sorted_results[1] if len(sorted_results) > 1 else sorted_results[0]

        raw_emotion = top["label"]
        confidence = top["score"]

        # 🎯 Map to simplified
        emotion = EMOTION_MAP.get(raw_emotion, "neutral")

        # 🔥 Apply keyword override
        rule_emotion = keyword_emotion(text)
        if rule_emotion:
            emotion = rule_emotion
            confidence += 0.15

        # 🔥 Apply intensity boost
        confidence *= get_intensity_multiplier(text)

        # 🔥 Cap confidence
        confidence = min(confidence, 0.99)

        return {
            "emotion": emotion,
            "confidence": round(confidence * 100, 2),
            "secondary_emotion": EMOTION_MAP.get(second["label"], "neutral"),
            "secondary_confidence": round(second["score"] * 100, 2)
        }

    except Exception as e:
        print("Emotion Error:", e)

        return {
            "emotion": "neutral",
            "confidence": 50.0,
            "secondary_emotion": "neutral",
            "secondary_confidence": 30.0
        }