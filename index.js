import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 3000;

// ✅ Use environment variable for API Key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post("/solve-form", async (req, res) => {
  try {
    const questions = req.body.questions;
    const prompt = `Answer the following form questions as accurately as possible:\n\n${questions
      .map((q, i) => `${i + 1}. ${q.question}${q.options?.length ? ` (Options: ${q.options.join(", ")})` : ""}`)
      .join("\n")}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const answers = text
      .split("\n")
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, "").trim());

    res.json({ answers });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
