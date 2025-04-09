import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pkg from "@google/genai";
const { GoogleGenAI } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/ask", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const model = genAI.getModel("models/gemini-1.5-flash"); // ✅ correct method
    const result = await model.generateContent(prompt);      // ✅ simplified usage

    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "AI generation failed." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ AI Form Autofill Backend is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
