import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/solve-form', async (req, res) => {
  try {
    const questions = req.body.questions;
    const prompt = questions.map((q, i) =>
      `Q${i + 1}: ${q.question}\nOptions: ${q.options?.join(', ') || 'N/A'}`
    ).join('\n\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      { role: 'user', parts: [{ text: `Please provide the best answers for the following form:\n\n${prompt}\n\nReturn a JSON array with answers in order.` }] }
    ]);

    const responseText = result.response.text();
    const answers = JSON.parse(responseText);

    res.json({ answers });
  } catch (err) {
    console.error('Backend Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
