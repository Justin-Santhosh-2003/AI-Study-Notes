const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: parse JSON safely from Gemini response text
const parseJSON = (text) => {
  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('AI returned an unexpected format. Please try again.');
  }
};

// Generate a concise summary and key concepts from note content
const generateSummary = async (noteContent) => {
  const prompt = `You are a study assistant. Read the following study note and provide:
1. A concise summary (3-5 sentences)
2. A list of 5 key concepts

Respond ONLY with valid JSON in this exact format:
{
  "summary": "...",
  "keyConcepts": ["concept1", "concept2", "concept3", "concept4", "concept5"]
}

Study Note:
${noteContent}`;

  const response = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  return parseJSON(response.text);
};

// Generate flashcards from note content
const generateFlashcards = async (noteContent, title) => {
  const prompt = `You are a study assistant. Read the following study note and generate 8 flashcards to help a student learn the material.

Respond ONLY with valid JSON in this exact format:
{
  "title": "${title} — Flashcards",
  "cards": [
    { "front": "Question or term", "back": "Answer or definition" }
  ]
}

Generate exactly 8 cards. Study Note:
${noteContent}`;

  const response = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  return parseJSON(response.text);
};

// Generate multiple-choice quiz questions from note content
const generateQuiz = async (noteContent, title) => {
  const prompt = `You are a study assistant. Read the following study note and generate 5 multiple-choice quiz questions.

Respond ONLY with valid JSON in this exact format:
{
  "title": "${title} — Quiz",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of why the answer is correct"
    }
  ]
}

Rules:
- Generate exactly 5 questions
- Each question must have exactly 4 options
- correctIndex is 0-based (0 = first option)
- Make questions test understanding, not just memorization

Study Note:
${noteContent}`;

  const response = await genAI.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  return parseJSON(response.text);
};

module.exports = { generateSummary, generateFlashcards, generateQuiz };
