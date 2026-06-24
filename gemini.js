// Gemini API Service Module for PrepAI

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Checks if the Gemini API key is configured in localStorage
 * @returns {boolean}
 */
function hasGeminiKey() {
  const key = localStorage.getItem("prepai_gemini_api_key");
  return !!key && key.trim().length > 0;
}

/**
 * Retrieves the Gemini API key from localStorage
 * @returns {string|null}
 */
function getGeminiKey() {
  return localStorage.getItem("prepai_gemini_api_key");
}

/**
 * Calls the Gemini API
 * @param {string} prompt - Prompt text
 * @param {boolean} forceJson - Enforce JSON response mime type
 * @returns {Promise<any>}
 */
async function callGeminiAPI(prompt, forceJson = true) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please add one in Settings.");
  }

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  if (forceJson) {
    payload.generationConfig = {
      responseMimeType: "application/json"
    };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || `HTTP error ${response.status}`;
    throw new Error(`Gemini API Error: ${errMsg}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error("No response content received from Gemini API.");
  }

  if (forceJson) {
    try {
      return JSON.parse(textContent);
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", textContent);
      throw new Error("Gemini API did not return valid JSON. Please try again.");
    }
  }

  return textContent;
}

/**
 * Generates custom interview questions based on topic, difficulty, and job description
 * @param {string} topic - Frontend, Backend, etc.
 * @param {string} difficulty - Junior, Mid-Level, etc.
 * @param {number} count - Number of questions to generate
 * @param {string} [jobDesc] - Optional job description to align questions with
 * @returns {Promise<Array>}
 */
async function generateAIQuestions(topic, difficulty, count = 5, jobDesc = "") {
  const jobContext = jobDesc ? `tailored to the following Job Description/Resume:\n\"\"\"\n${jobDesc}\n\"\"\"\n` : "";
  const prompt = `You are an expert interviewer. Generate exactly ${count} highly technical, realistic, and situational interview questions for a ${difficulty} level role in the domain: ${topic}.
${jobContext}
Provide a JSON array containing the questions. Each object in the array MUST strictly follow this JSON schema:
[
  {
    "id": "ai-q-[index]",
    "category": "${topic}",
    "difficulty": "${difficulty}",
    "question": "Clear, detailed technical interview question text.",
    "hint": "A helpful, brief hint or conceptual guide for the interviewee.",
    "keywords": ["list", "of", "important", "technical", "keywords", "relevant", "to", "this", "answer"],
    "modelAnswer": "A comprehensive model answer demonstrating senior-level understanding of the concept."
  }
]

Do not return any markdown codeblocks or extra text. Return raw JSON.`;

  return await callGeminiAPI(prompt, true);
}

/**
 * Evaluates the user's answer to a specific interview question
 * @param {string} question - The question asked
 * @param {string} modelAnswer - The model answer for reference
 * @param {string} userAnswer - The answer typed or spoken by the user
 * @returns {Promise<object>}
 */
async function evaluateUserAnswer(question, modelAnswer, userAnswer) {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 0,
      strengths: "No answer was provided.",
      weaknesses: "You did not respond to the question. A complete response is needed for evaluation.",
      modelAnswer: modelAnswer
    };
  }

  const prompt = `You are an AI interviewer assessing a candidate's answer.
Question: "${question}"
Standard Model Answer: "${modelAnswer}"
Candidate's Answer: "${userAnswer}"

Analyze the candidate's answer based on correctness, technical depth, clarity, and usage of relevant concepts.
Rate the answer on a scale from 0 to 100.
Provide a detailed assessment. You must return your evaluation as a JSON object matching this schema:
{
  "score": 85, // Numeric score out of 100
  "strengths": "Detailed description of what the candidate answered correctly, noting specific concepts they explained well.",
  "weaknesses": "Constructive feedback on what was missing, incorrect, or could be expanded upon.",
  "modelAnswer": "A revised, optimal model answer tailored to the context, highlighting key points they should have mentioned."
}

Do not return any markdown format, only return the raw JSON object.`;

  return await callGeminiAPI(prompt, true);
}

// Export for ES Module usage or browser script load
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hasGeminiKey, getGeminiKey, generateAIQuestions, evaluateUserAnswer };
} else {
  window.prepaiGemini = { hasGeminiKey, getGeminiKey, generateAIQuestions, evaluateUserAnswer };
}
