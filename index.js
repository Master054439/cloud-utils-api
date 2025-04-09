import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 3000;

// Setup middleware
app.use(cors());
app.use(bodyParser.json());

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// AI endpoint
app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === "") {
      console.error("❌ Gemini returned no usable text:\n", JSON.stringify(response, null, 2));
      return res.status(500).json({ error: "No text returned from AI." });
    }

    res.json({ answer: text });
  } catch (error) {
    console.error("❌ Error from Gemini:", error);
    res.status(500).json({ error: "Something went wrong with AI." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
