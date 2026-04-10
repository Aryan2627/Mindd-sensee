def detect_risk(text: str, emotion: str):
    text = text.lower()

    # 🔴 High-risk keywords
    high_risk_keywords = [
        "suicide", "kill myself", "end my life",
        "want to die", "no reason to live"
    ]

    for word in high_risk_keywords:
        if word in text:
            return "High"

    # 🟡 Medium risk based on emotion
    if emotion.lower() in ["sadness", "fear", "anger"]:
        return "Medium"

    # 🟢 Low risk
    return "Low"