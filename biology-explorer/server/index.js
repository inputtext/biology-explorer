/* eslint-env node */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3001; // Kept your custom port!

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing from .env');
  process.exit(1);
}

// Initialized with the new SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BioExplorer AI backend is running',
  });
});

// --- DOOR 1: AI Tutor Route (Your custom logic kept intact) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { message, module, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const moduleTitle = module?.title || 'Biology Overview';
    const moduleContent = module?.content || 'General biological concepts';

    const systemInstruction = `
You are BioExplorer AI Tutor, an educational biology assistant.
The student is currently studying:
MODULE: ${moduleTitle}
MODULE CONTENT: ${moduleContent}
Your job:
- Explain biology accurately.
- Stay focused on the current module.
- Adapt explanations to a student.
- Use simple language first.
- Define difficult terminology.
- Give examples when useful.
- Do not unnecessarily go outside the current topic.
- If the student asks something unrelated, politely explain that you are currently focused on ${moduleTitle}.
- Keep responses concise but useful.
- Use Markdown formatting when useful.
You are currently acting as the tutor for:
${moduleTitle}
`;

    const conversationHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .map((msg) => {
            const role = msg.role === 'user' ? 'Student' : 'AI Tutor';
            return `${role}: ${msg.text}`;
          })
          .join('\n')
      : '';

    const prompt = `
${systemInstruction}
PREVIOUS CONVERSATION:
${conversationHistory || 'No previous conversation.'}
STUDENT'S NEW QUESTION:
${message}
Answer the student's question now.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash', // Matching what worked yesterday!
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error('Gemini returned an empty response');

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to communicate with Gemini',
    });
  }
});

// --- DOOR 2: Command Palette Route (Updated for new SDK) ---
app.post('/api/command', async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `You are a strict, expert biology tutor guiding a student. Answer the following question concisely in 2 to 3 sentences. If the question is not about biology or science, politely refuse to answer and redirect them to biology. Question: ${message}`;

    // Now correctly using your 'ai' instance and the new SDK structure
   const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Command Palette AI Error:", error);
    res.status(500).json({ reply: "My neural pathways are currently offline. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🧬 BioExplorer AI server running at http://localhost:${PORT}`);
});
