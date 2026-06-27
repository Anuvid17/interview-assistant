// llm.js - Multi-Provider Open Source LLM Client for PrepAI

/**
 * Checks if the configured provider settings are valid
 * @returns {boolean}
 */
function isLlmConfigured() {
  const provider = localStorage.getItem("prepai_provider") || "ollama";
  if (provider === "ollama") {
    return true; // Ollama defaults to local server, works without key
  }
  const token = localStorage.getItem("prepai_api_token");
  return !!token && token.trim().length > 0;
}

/**
 * Robust JSON parser that finds and extracts JSON blocks from conversational model responses.
 * @param {string} text - Raw model response
 * @returns {any}
 */
function extractAndParseJson(text) {
  try {
    return JSON.parse(text.trim());
  } catch (err) {
    const firstBrace = text.indexOf('{');
    const firstBracket = text.indexOf('[');
    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = text.lastIndexOf('}');
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = text.lastIndexOf(']');
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonSubstr = text.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(jsonSubstr);
      } catch (nestedErr) {
        console.error("Found JSON boundaries, but parsing failed:", jsonSubstr, nestedErr);
      }
    }
    throw new Error("The LLM did not return a valid structured JSON output. Raw output was: " + text.slice(0, 150) + "...");
  }
}

/**
 * General Chat Completion wrapper supporting Ollama, Hugging Face, and OpenAI-compatible APIs
 */
async function callLlmChatCompletions(prompt, forceJson = true) {
  const provider = localStorage.getItem("prepai_provider") || "ollama";
  let baseUrl = localStorage.getItem("prepai_api_url") || "";
  const token = localStorage.getItem("prepai_api_token") || "";
  let modelId = localStorage.getItem("prepai_model_id") || "";

  let fetchUrl = "";
  const headers = { "Content-Type": "application/json" };
  const payload = {
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3
  };

  // Configure parameters based on selected provider
  if (provider === "ollama") {
    if (!baseUrl) baseUrl = "http://localhost:11434";
    fetchUrl = `${baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
    payload.model = modelId || "qwen3:8b";
    if (forceJson) {
      payload.response_format = { type: "json_object" };
    }
  } 
  else if (provider === "huggingface") {
    fetchUrl = "https://api-inference.huggingface.co/v1/chat/completions";
    payload.model = modelId || "Qwen/Qwen2.5-72B-Instruct";
    if (!token) {
      throw new Error("Hugging Face requires a User Access Token. Set it in Settings.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  } 
  else if (provider === "custom") {
    if (!baseUrl) {
      throw new Error("Custom OpenAI-compatible provider requires a Base URL.");
    }
    fetchUrl = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
    payload.model = modelId || "llama-3.1-8b-instant";
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (forceJson) {
      payload.response_format = { type: "json_object" };
    }
  }

  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || `HTTP error ${response.status}`;
    throw new Error(`LLM Error (${provider}): ${errMsg}`);
  }

  const data = await response.json();
  const choiceText = data.choices?.[0]?.message?.content;

  if (!choiceText) {
    throw new Error("Received empty chat completion response from the model.");
  }

  return choiceText;
}

/**
 * Dynamically generates interview questions tailored to categories and prompt contexts
 */
async function generateAIQuestions(topic, difficulty, count = 5, customPrompt = "") {
  const contextBlock = customPrompt 
    ? `The candidate wants to practice specifically on topics matching this prompt/context:\n"""\n${customPrompt}\n"""\nMake sure the generated questions are strictly related to this context.`
    : `Generate general questions suitable for this domain.`;

  const prompt = `You are a technical interviewer. Generate exactly ${count} highly relevant interview questions for a ${difficulty} level candidate in the category "${topic}".
${contextBlock}

You MUST return a JSON array containing the questions. Each question object in the array MUST match this exact schema:
[
  {
    "id": "os-q-[index]",
    "category": "${topic}",
    "difficulty": "${difficulty}",
    "question": "The technical interview question text.",
    "hint": "A helpful hint to guide the candidate's thinking.",
    "keywords": ["list", "of", "important", "technical", "keywords", "relevant", "to", "this", "answer"],
    "modelAnswer": "A detailed model answer showing what a senior candidate should say."
  }
]

Do not return any introductory comments or wrapper text. Return only the raw JSON.`;

  const rawText = await callLlmChatCompletions(prompt, true);
  return extractAndParseJson(rawText);
}

/**
 * Evaluates the candidate's answer and compiles structured scoring and feedback
 */
async function evaluateUserAnswer(question, modelAnswer, userAnswer) {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 0,
      strengths: "No response was provided.",
      weaknesses: "You did not write or speak an answer to this question.",
      modelAnswer: modelAnswer
    };
  }

  const prompt = `You are an AI technical interviewer evaluating a candidate's answer.
Question: "${question}"
Expected Model Answer Guide: "${modelAnswer}"
Candidate's Typed Answer: "${userAnswer}"

Grade the candidate's answer out of 100 based on accuracy, completeness, and usage of correct engineering concepts.
Return your evaluation as a single JSON object matching this schema:
{
  "score": 75, // Numeric score (0-100)
  "strengths": "Detailed feedback on what the candidate answered correctly.",
  "weaknesses": "Constructive feedback on what key concepts were missing or wrong.",
  "modelAnswer": "A revised, optimal model answer demonstrating the missing points."
}

Do not return any conversational text. Return only the raw JSON.`;

  const rawText = await callLlmChatCompletions(prompt, true);
  return extractAndParseJson(rawText);
}

// Attach to window object for access in app.js
window.prepaiLlm = {
  isLlmConfigured,
  generateAIQuestions,
  evaluateUserAnswer
};
