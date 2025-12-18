import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { retrieveRelevantContext, formatContext } from './rag.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

// Language configurations
const languages = {
  en: { name: 'English', code: 'en' },
  hi: { name: 'Hindi', code: 'hi' },
  ta: { name: 'Tamil', code: 'ta' },
  te: { name: 'Telugu', code: 'te' },
  es: { name: 'Spanish', code: 'es' },
  fr: { name: 'French', code: 'fr' },
};

// System prompts for different styles
const systemPrompts = {
  professional: `You are Dr. Sharma, a Senior Academic Advisor at IIM Indore with 15+ years of experience.
Your communication style is:
- FORMAL and AUTHORITATIVE: Use academic language, proper terminology, and structured explanations
- COMPREHENSIVE: Provide detailed, well-researched information with context and background
- STRUCTURED: Use formal paragraphs, proper punctuation, and professional tone
- DETAIL-ORIENTED: Include specific numbers, dates, percentages, and official information
- NO EMOJIS: Maintain professional appearance throughout
- CITATIONS: Reference official sources and programs by their full names

Example tone: "The Post Graduate Programme in Management (PGP) at IIM Indore is a two-year, full-time residential MBA programme that has been accredited by the Association of MBAs (AMBA), London. The programme aims to develop competent professional managers through a rigorous curriculum combining functional expertise with soft skills development."

When greeting: Respond formally and professionally, then ask specific questions about their interests.`,
  
  casual: `You are Alex, a friendly IIM Indore student mentor who loves helping people!
Your communication style is:
- CONVERSATIONAL: Use casual language, contractions, and friendly expressions
- EMOJI-RICH: Use relevant emojis to make responses fun and engaging 😊
- RELATABLE: Share enthusiasm and make people feel comfortable
- STORYTELLING: Use examples and anecdotes to explain things
- ENCOURAGING: Be supportive and motivating in your responses
- INFORMAL: Use phrases like "Hey!", "Cool!", "Awesome!", "You'll love it!"

Example tone: "Hey! 🎓 So the PGP is basically a 2-year MBA program that's super cool! 🚀 You'll be living on campus with like 240 amazing people, and honestly, it's such an incredible experience. The placements are amazing too - like, people get jobs at McKinsey, Google, Amazon... it's wild! 💼"

When greeting: Respond warmly with enthusiasm, use emojis, and make them feel welcome!`,
  
  bollywood: `You are Bollywood Bhaiya, an enthusiastic and dramatic IIM Indore guide with Bollywood flair!
Your communication style is:
- DRAMATIC and THEATRICAL: Use Bollywood dialogues, movie references, and dramatic expressions
- ENERGETIC: Use lots of exclamation marks, capital letters, and enthusiasm!
- FILMY LANGUAGE: Use Hindi-Bollywood phrases like "Bhai!", "Yaar!", "Dekho!", "Bilkul!", "Shukriya!"
- MOVIE REFERENCES: Reference Bollywood movies, songs, and famous dialogues
- MOTIVATIONAL: Be inspiring and use Bollywood-style motivational language
- EMOJI-RICH: Use relevant emojis and Bollywood-style expressions
- STORYTELLING: Tell stories like a Bollywood narrator

Example tone: "Arre bhai! 🎬 IIM Indore ke PGP ke baare mein suno! Yeh toh bilkul 'Dilwale Dulhania Le Jayenge' jaisa hai - 2 saal ka romantic journey! 💕 240 students, aur sab ko placement milta hai! Yaar, average salary ₹20 lakhs! Bilkul BLOCKBUSTER! 🎥✨ 'Bhaag Milkha Bhaag' ki tarah, yahan bhi success ki race hai!"

When greeting: Respond with Bollywood enthusiasm, use filmy expressions, and make them feel like a movie hero!`,
};

// Chat endpoint with RAG
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      message, 
      language = 'en', 
      style = 'professional', 
      temperature = 0.7,
      conversationHistory = [] 
    } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and must be non-empty' });
    }

    if (language !== 'auto' && !languages[language]) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    if (!systemPrompts[style]) {
      return res.status(400).json({ error: `Unsupported style: ${style}` });
    }

    const trimmedMessage = message.trim();
    console.log(`[CHAT] User: "${trimmedMessage}" | Lang: ${language} | Style: ${style}`);

    // RAG: Retrieve relevant context from knowledge base
    const relevantSections = retrieveRelevantContext(trimmedMessage);
    const context = formatContext(relevantSections);
    console.log(`[RAG] Retrieved ${relevantSections.length} sections`);

    // Enhanced system prompt with RAG context
    const languageInstruction = language === 'auto' 
      ? 'Detect the language of the user message and respond in that same language.'
      : `Respond in ${languages[language].name}.`;

    const ragSystemPrompt = `${systemPrompts[style]}

You are an expert assistant for IIM Indore (Indian Institute of Management Indore). 
Use the following knowledge base to answer questions accurately and helpfully.
Always ground your answers in the provided information.
If information is not in the knowledge base, clearly state that.
Keep responses concise and relevant.

KNOWLEDGE BASE:
${context}

${languageInstruction}`;

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: ragSystemPrompt,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: trimmedMessage,
      },
    ];

    console.log(`[OPENAI] Calling GPT-3.5-turbo with ${messages.length} messages, temperature: ${temperature}`);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: temperature,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0].message.content;
    console.log(`[RESPONSE] Generated response (${assistantMessage.length} chars)`);

    res.json({
      response: assistantMessage,
      language,
      style,
      source: 'rag',
    });
  } catch (error) {
    console.error('[ERROR] Chat endpoint error:', error.message);
    console.error('[ERROR] Full error:', error);
    
    // Provide specific error messages
    if (error.message.includes('API key')) {
      return res.status(500).json({ error: 'API configuration error' });
    }
    if (error.message.includes('rate_limit')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    if (error.message.includes('timeout')) {
      return res.status(504).json({ error: 'Request timeout. Please try again.' });
    }
    
    res.status(500).json({ error: 'Failed to process request. Please try again.' });
  }
});

// Evaluation endpoint
app.post('/api/evaluate', (req, res) => {
  try {
    const evaluation = req.body;
    const evaluationsFile = path.join(__dirname, 'evaluations.json');

    let evaluations = [];
    if (fs.existsSync(evaluationsFile)) {
      evaluations = JSON.parse(fs.readFileSync(evaluationsFile, 'utf8'));
    }

    evaluations.push({
      ...evaluation,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(evaluationsFile, JSON.stringify(evaluations, null, 2));

    res.json({ success: true, message: 'Evaluation saved' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save evaluation' });
  }
});

// Get evaluations
app.get('/api/evaluations', (req, res) => {
  try {
    const evaluationsFile = path.join(__dirname, 'evaluations.json');

    if (!fs.existsSync(evaluationsFile)) {
      return res.json([]);
    }

    const evaluations = JSON.parse(fs.readFileSync(evaluationsFile, 'utf8'));
    res.json(evaluations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
