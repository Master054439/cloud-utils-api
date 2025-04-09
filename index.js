// index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY; // Keep this safe in .env
const MODEL_NAME = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

app.post('/ask', async (req, res) => {
  const userPrompt = req.body.prompt;

  const payload = {
    contents: [
      {
        parts: [{ text: userPrompt }],
      },
    ],
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini Error:', data);
      return res.status(response.status).json({ error: data });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ response: text });
  } catch (err) {
    console.error('Backend Error:', err);
    res.status(500).json({ error: 'Failed to contact Gemini API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server listening on port ${PORT}`);
});
