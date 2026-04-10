import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || history.length === 0) {
      return res.json({ insight: "No data available for analysis." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a professional mental health AI assistant.

Analyze this emotional history:

${JSON.stringify(history)}

Generate a report in this format:

🔹 Emotional Trend:
🔹 Dominant Emotion:
🔹 Risk Level (low/medium/high):
🔹 Key Observations:
🔹 Suggestions:

Keep it short, human, and helpful.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ insight: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI insight failed" });
  }
});

export default router;