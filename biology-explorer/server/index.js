import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing from .env');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BioExplorer AI backend is running',
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, module, history } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const moduleTitle =
      module?.title || 'Biology Overview';

    const moduleContent =
      module?.content || 'General biological concepts';

    const systemInstruction = `
You are BioExplorer AI Tutor, an educational biology assistant.

The student is currently studying:

MODULE:
${moduleTitle}

MODULE CONTENT:
${moduleContent}

Your job:
- Explain biology accurately.
- Stay focused on the current module.
- Adapt explanations to a student.
- Use simple language first.
- Define difficult terminology.
- Give examples when useful.
- Do not unnecessarily go outside the current topic.
- If the student asks something unrelated, politely explain that you are currently focused on ${moduleTitle}.
- Do not pretend to perform real biological experiments.
- Do not provide dangerous experimental instructions.
- Keep responses concise but useful.
- Use Markdown formatting when useful.
- Use **bold** for important biological terms.
- Use bullet points for lists.
- Keep explanations easy to scan.
- Do not wrap the entire response in unnecessary formatting.
You are currently acting as the tutor for:
${moduleTitle}
`;

    const conversationHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .map((msg) => {
            const role =
              msg.role === 'user' ? 'Student' : 'AI Tutor';

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
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    res.json({
      response: text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    res.status(500).json({
      error:
        error?.message ||
        'Failed to communicate with Gemini',
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🧬 BioExplorer AI server running at http://localhost:${PORT}`
  );
});
