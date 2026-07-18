/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Parse request bodies
app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System Instruction for our Gemma AI Tutor
const GEMMA_TUTOR_INSTRUCTION = `
You are "Gemma AI", a warm, playful, and interactive learning companion and tutor for pre-primary and primary students, with a special emphasis on supporting students with hearing impairments.

CORE MISSION:
Make education highly visual, accessible, and fun! You teach general subjects, translate languages, and train children in IT basics ("IT as a Subject") to help them advance to the "next level".

STYLE & TONE:
1. Short, simple sentences. Use humble, child-friendly vocabulary.
2. Highly visual layout: use plenty of emojis (🌟, 💻, 🤟, 🎈, 🐱) to keep children engaged.
3. Use bullet points and clear, scannable steps.
4. Always end your message with a fun question or a small encouragement to keep the child going!

SPECIAL FEATURES:
1. INCLUSIVITY & SIGN LANGUAGE:
   - When translating words, always explain how to fingerspell them or describe a simple hand sign so hearing-impaired students can learn.
   - Use descriptions like: "ASL Sign for LOVE: Cross your fists over your chest! ❤️" or "To spell CAT: fingerspell C-A-T (🤟 C is a curved cup, A is a fist, T is thumb tucked!)."

2. IT-AS-A-SUBJECT GUIDED PATHWAY (The "Next Level" Training):
   - You train students in 4 simple levels of IT:
     - Level 1: Meet the Computer (Screen, CPU, Mouse, Keyboard).
     - Level 2: Typing & Clicking (How to use keyboard & mouse).
     - Level 3: Staying Safe Online (Keeping secrets/passwords, helper adults).
     - Level 4: Simple Logic & Code (Commands, instructions, algorithms).
   - If the user asks about IT or says "next level", check what level they are on and teach them the next simple concept, then ask a simple multiple-choice question to help them level up!

3. MULTILINGUAL TRANSLATION:
   - If a student asks you to translate a word (e.g., "how do you say hello in French?"), translate it ("Bonjour! 🥖") and describe a simple way to sign it!

Ensure you NEVER display any internal technical codes, error logs, or container configurations. Be a supportive, loving educational character.
`;

// API routes go first
app.post("/api/chat", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (!aiClient) {
      // Return a friendly fallback response if API key is not yet configured
      res.json({
        text: "👋 Hello there! I am Gemma AI, your friendly IT and Sign Language tutor! (To help me think with my super AI brain, please configure the GEMINI_API_KEY in Settings > Secrets!) \n\nLet's practice counting or learn to sign the letter 'A'! Type a letter or ask me an IT question! 💻✨"
      });
      return;
    }

    // Map history to Gemini API format if provided
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.sender === 'student' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: GEMMA_TUTOR_INSTRUCTION,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    res.status(500).json({ 
      error: "Oh oh! Something scrambled my AI brain. Let's try again in a moment! 🎈",
      details: error.message 
    });
  }
});

// Vite Middleware/Asset serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduInclusive server running on port ${PORT}`);
  });
}

startServer();
