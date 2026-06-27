// app.js - PrepAI Core Controller

// Global App State
const state = {
  activeTab: 'dashboard',
  isInterviewActive: false,
  apiKeyMode: false,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  evaluations: [],
  timer: {
    seconds: 0,
    intervalId: null
  },
  speech: {
    synthesis: window.speechSynthesis,
    recognition: null,
    isSpeaking: false,
    isListening: false
  },
  history: []
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  initSpeechRecognition();
  loadSettings();
  loadHistory();
  renderDashboard();
  setupEventListeners();
  showToast("Welcome to PrepAI! Setup your interview to begin.", "success");
});

// Setup Web Speech Recognition
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    state.speech.recognition = new SpeechRecognition();
    state.speech.recognition.continuous = true;
    state.speech.recognition.interimResults = true;
    state.speech.recognition.lang = 'en-US';

    state.speech.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const answerBox = document.getElementById("answer-input");
      if (answerBox) {
        // Append transcribed text
        if (finalTranscript) {
          const currentText = answerBox.value;
          answerBox.value = currentText + (currentText.length > 0 ? ' ' : '') + finalTranscript;
        }
      }
    };

    state.speech.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopListening();
      if (event.error === 'not-allowed') {
        showToast("Microphone permission denied.", "danger");
      } else {
        showToast(`Speech error: ${event.error}`, "warning");
      }
    };

    state.speech.recognition.onend = () => {
      if (state.speech.isListening) {
        // Auto-restart if we expected to still be listening
        try { state.speech.recognition.start(); } catch (e) {}
      }
    };
  } else {
    console.warn("Speech recognition is not supported in this browser.");
  }
}

// Load configurations from LocalStorage
function loadSettings() {
  const provider = localStorage.getItem("prepai_provider") || "ollama";
  const modelId = localStorage.getItem("prepai_model_id") || "qwen3:8b";
  const apiUrl = localStorage.getItem("prepai_api_url") || "http://localhost:11434";
  const apiToken = localStorage.getItem("prepai_api_token") || "";
  const keyMode = localStorage.getItem("prepai_api_mode");
  
  document.getElementById("settings-provider").value = provider;
  document.getElementById("settings-model-id").value = modelId;
  document.getElementById("settings-api-url").value = apiUrl;
  document.getElementById("settings-api-token").value = apiToken;
  
  if (keyMode === "true") {
    state.apiKeyMode = true;
    document.getElementById("api-mode-toggle").checked = true;
    updateApiBadge(true);
  } else {
    state.apiKeyMode = false;
    document.getElementById("api-mode-toggle").checked = false;
    updateApiBadge(false);
  }
}

// Save settings to LocalStorage
function saveSettings() {
  const provider = document.getElementById("settings-provider").value;
  const modelId = document.getElementById("settings-model-id").value.trim();
  const apiUrl = document.getElementById("settings-api-url").value.trim();
  const apiToken = document.getElementById("settings-api-token").value.trim();
  const keyModeChecked = document.getElementById("api-mode-toggle").checked;

  localStorage.setItem("prepai_provider", provider);
  localStorage.setItem("prepai_model_id", modelId);
  localStorage.setItem("prepai_api_url", apiUrl);
  localStorage.setItem("prepai_api_token", apiToken);

  if (keyModeChecked) {
    if (provider !== "ollama" && !apiToken) {
      document.getElementById("api-mode-toggle").checked = false;
      localStorage.setItem("prepai_api_mode", "false");
      state.apiKeyMode = false;
      updateApiBadge(false);
      showToast("Cannot enable AI Mode for " + provider + " without an API key/token.", "warning");
      return;
    }
    localStorage.setItem("prepai_api_mode", "true");
    state.apiKeyMode = true;
    updateApiBadge(true);
  } else {
    localStorage.setItem("prepai_api_mode", "false");
    state.apiKeyMode = false;
    updateApiBadge(false);
  }

  showToast("Settings saved successfully.", "success");
  renderDashboard();
}

// Update sidebar status badge
function updateApiBadge(active) {
  const badge = document.getElementById("api-status-badge");
  const text = document.getElementById("api-status-text");
  const provider = localStorage.getItem("prepai_provider") || "ollama";
  if (active) {
    badge.classList.add("active");
    text.textContent = provider === "ollama" ? "Ollama Active" : "AI Mode Active";
  } else {
    badge.classList.remove("active");
    text.textContent = "Offline Mode";
  }
}

// Load past histories
function loadHistory() {
  try {
    const rawHistory = localStorage.getItem("prepai_history");
    state.history = rawHistory ? JSON.parse(rawHistory) : [];
  } catch (e) {
    console.error("Failed to load history:", e);
    state.history = [];
  }
}

// Navigation between tabs
function switchTab(tabId) {
  if (state.isInterviewActive && tabId !== 'interview') {
    if (!confirm("Your active interview is in progress. Leaving this page will end the session. Proceed?")) {
      return;
    }
    endInterview(false);
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  document.querySelectorAll(".tab-view").forEach(view => {
    view.classList.remove("active");
  });

  const selectedLink = document.querySelector(`[data-tab="${tabId}"]`);
  const selectedView = document.getElementById(`${tabId}-view`);

  if (selectedLink) selectedLink.classList.add("active");
  if (selectedView) selectedView.classList.add("active");

  state.activeTab = tabId;

  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'history') renderHistoryList();
}

// Setup core listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      const tabId = link.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Settings save
  document.getElementById("save-settings-btn").addEventListener("click", saveSettings);
  document.getElementById("clear-history-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all interview histories? This cannot be undone.")) {
      localStorage.removeItem("prepai_history");
      state.history = [];
      renderDashboard();
      showToast("History cleared successfully.", "success");
    }
  });

  // Setup Interview Form submit
  document.getElementById("start-interview-btn").addEventListener("click", startNewInterview);

  // Active Interview controllers
  document.getElementById("speak-btn").addEventListener("click", toggleSpeakQuestion);
  document.getElementById("mic-btn").addEventListener("click", toggleMicrophone);
  document.getElementById("submit-answer-btn").addEventListener("click", submitCurrentAnswer);
  document.getElementById("next-question-btn").addEventListener("click", nextQuestion);
  document.getElementById("quit-interview-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to quit this interview? Your progress won't be saved.")) {
      endInterview(false);
      switchTab('dashboard');
    }
  });
}

// Renders stats on the main dashboard
function renderDashboard() {
  const totalInterviews = state.history.length;
  document.getElementById("stat-total").textContent = totalInterviews;

  let averageScore = 0;
  if (totalInterviews > 0) {
    const totalScoreSum = state.history.reduce((sum, session) => sum + session.averageScore, 0);
    averageScore = Math.round(totalScoreSum / totalInterviews);
  }
  document.getElementById("stat-avg-score").textContent = averageScore + "%";

  // Calculate top category
  const categoryStats = calculateCategoryAverages();
  let topCategory = "N/A";
  let maxScore = -1;
  for (const cat in categoryStats) {
    if (categoryStats[cat].count > 0 && categoryStats[cat].avg > maxScore) {
      maxScore = categoryStats[cat].avg;
      topCategory = cat;
    }
  }
  document.getElementById("stat-top-cat").textContent = topCategory;

  // Render dashboard category breakdown bars
  const metricsContainer = document.getElementById("dashboard-categories");
  metricsContainer.innerHTML = '';
  
  const tracks = ["Frontend", "Backend", "System Design", "Data Structures & Algorithms", "Behavioral"];
  const colors = {
    "Frontend": "#a78bfa", // Purple
    "Backend": "#22d3ee", // Cyan
    "System Design": "#f472b6", // Pink
    "Data Structures & Algorithms": "#fbbf24", // Amber
    "Behavioral": "#34d399" // Green
  };

  tracks.forEach(track => {
    const stat = categoryStats[track];
    const score = stat ? stat.avg : 0;
    
    const metricHtml = `
      <div class="category-metric">
        <div class="category-header">
          <span>${track}</span>
          <span>${score > 0 ? score + '%' : 'No data'}</span>
        </div>
        <div class="category-bar-bg">
          <div class="category-bar-fill" style="width: ${score}%; background-color: ${colors[track] || '#8b5cf6'}"></div>
        </div>
      </div>
    `;
    metricsContainer.insertAdjacentHTML('beforeend', metricHtml);
  });

  // Recent Interviews list
  const recentContainer = document.getElementById("recent-interviews");
  recentContainer.innerHTML = '';
  
  if (state.history.length === 0) {
    recentContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem 0;">No interviews completed yet. Configure one in the Setup tab!</p>';
    return;
  }

  // Show top 3 recent
  state.history.slice(0, 3).forEach((session, index) => {
    const sessionHtml = `
      <div class="history-item" onclick="viewHistoricalSession(${index})">
        <div class="history-meta">
          <div class="history-title">${session.topic} (${session.difficulty})</div>
          <div class="history-date">${new Date(session.timestamp).toLocaleDateString()} • ${session.questionsCount} Questions</div>
        </div>
        <div class="history-score" style="color: ${getScoreColor(session.averageScore)}">${session.averageScore}%</div>
      </div>
    `;
    recentContainer.insertAdjacentHTML('beforeend', sessionHtml);
  });
}

// Calculate averages grouped by category
function calculateCategoryAverages() {
  const categories = {};
  state.history.forEach(session => {
    if (!session || !Array.isArray(session.questions)) return;
    
    const evals = Array.isArray(session.evaluations) ? session.evaluations : [];
    
    session.questions.forEach((q, idx) => {
      if (!q) return;
      const cat = q.category || "General";
      const evaluation = evals[idx];
      if (evaluation && typeof evaluation.score === 'number') {
        if (!categories[cat]) {
          categories[cat] = { sum: 0, count: 0 };
        }
        categories[cat].sum += evaluation.score;
        categories[cat].count += 1;
      }
    });
  });

  const results = {};
  for (const cat in categories) {
    results[cat] = {
      avg: Math.round(categories[cat].sum / categories[cat].count),
      count: categories[cat].count
    };
  }
  return results;
}

// Render historical logs
function renderHistoryList() {
  const container = document.getElementById("full-history-list");
  container.innerHTML = '';

  if (state.history.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 3rem 0;">No interview history found.</p>';
    return;
  }

  state.history.forEach((session, index) => {
    const itemHtml = `
      <div class="history-item" onclick="viewHistoricalSession(${index})">
        <div class="history-meta">
          <div class="history-title">${session.topic} (${session.difficulty})</div>
          <div class="history-date">${new Date(session.timestamp).toLocaleString()} • ${session.questionsCount} Questions</div>
        </div>
        <div class="history-score" style="color: ${getScoreColor(session.averageScore)}">${session.averageScore}%</div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', itemHtml);
  });
}

// Opens historical interview details in a modal/view overlay
function viewHistoricalSession(index) {
  const session = state.history[index];
  if (!session) return;

  const evals = Array.isArray(session.evaluations) ? session.evaluations : [];
  const answers = Array.isArray(session.answers) ? session.answers : [];

  // Build a review content overlay
  const overlayHtml = `
    <div id="history-modal" class="glass-card" style="position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 1000; overflow-y: auto; box-shadow: 0 0 50px rgba(0,0,0,0.8); border-color: var(--color-primary-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
        <div>
          <h2>Review: ${session.topic || "Practice Session"}</h2>
          <p class="text-muted">${session.difficulty || "Mixed"} • ${new Date(session.timestamp).toLocaleString()}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <div style="font-size: 1.5rem; font-weight: 700; color: ${getScoreColor(session.averageScore)}">Avg Score: ${session.averageScore || 0}%</div>
          <button class="btn btn-secondary" onclick="closeHistoryModal()">Close</button>
        </div>
      </div>
      <div>
        ${(session.questions || []).map((q, idx) => {
          const evalRes = evals[idx] || { score: 0, strengths: "No feedback was generated.", weaknesses: "No improvement items.", modelAnswer: q.modelAnswer || "No reference answer." };
          const ans = answers[idx] || "No answer provided.";
          return `
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.01); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1rem;">
                <h3 style="font-size: 1.15rem; max-width: 80%;">${idx+1}. ${q.question}</h3>
                <span class="tag" style="background: rgba(255,255,255,0.05); color: ${getScoreColor(evalRes.score)}">Score: ${evalRes.score}</span>
              </div>
              <div style="margin-bottom: 1rem;">
                <strong style="font-size: 0.85rem; color: var(--color-secondary);">Your Answer:</strong>
                <p style="margin-top: 0.25rem; font-size: 0.95rem; color: #d1d5db; white-space: pre-wrap;">${ans}</p>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                <div class="grade-box strengths" style="margin: 0; padding: 0.85rem;">
                  <h4>Strengths</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">${evalRes.strengths}</p>
                </div>
                <div class="grade-box weaknesses" style="margin: 0; padding: 0.85rem;">
                  <h4>Areas for Improvement</h4>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">${evalRes.weaknesses}</p>
                </div>
              </div>
              <div class="grade-box model-ans" style="margin-top: 1rem; padding: 0.85rem;">
                <h4>Ideal Answer</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${evalRes.modelAnswer}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    <div id="modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 999;" onclick="closeHistoryModal()"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', overlayHtml);
}

// Closes historical session review modal
window.closeHistoryModal = function() {
  const modal = document.getElementById("history-modal");
  const backdrop = document.getElementById("modal-backdrop");
  if (modal) modal.remove();
  if (backdrop) backdrop.remove();
};

// Smart local related-questions ranker/filter
function getRelatedOfflineQuestions(pool, promptText, count) {
  if (!promptText || promptText.trim().length === 0) {
    return selectRandomItems(pool, count);
  }
  
  // Clean tokens from the search prompt
  const keywords = promptText.toLowerCase().split(/[\s,.\-_/()]+/).filter(k => k.length > 2);
  if (keywords.length === 0) {
    return selectRandomItems(pool, count);
  }

  const scored = pool.map(q => {
    let score = 0;
    const searchString = `${q.question} ${q.hint} ${q.category} ${q.keywords ? q.keywords.join(' ') : ''} ${q.modelAnswer}`.toLowerCase();
    
    keywords.forEach(kw => {
      if (searchString.includes(kw)) {
        score += 10;
        // Boost scores for matching specific metadata fields
        if (q.category.toLowerCase().includes(kw)) score += 15;
        if (q.question.toLowerCase().includes(kw)) score += 8;
        if (q.keywords && q.keywords.some(k => k.toLowerCase() === kw)) score += 12;
      }
    });
    
    return { question: q, score: score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take elements that actually had matches first
  const positiveMatches = scored.filter(item => item.score > 0);
  let results = [];
  
  if (positiveMatches.length > 0) {
    results = positiveMatches.slice(0, count).map(item => item.question);
    
    // Backfill if we matched fewer questions than requested
    if (results.length < count) {
      const matchedIds = results.map(r => r.id);
      const remainder = pool.filter(q => !matchedIds.includes(q.id));
      const backfill = selectRandomItems(remainder, count - results.length);
      results = results.concat(backfill);
    }
  } else {
    // If absolutely zero matches, just pick random questions from the pool
    results = selectRandomItems(pool, count);
  }
  
  return results;
}

// Start a fresh interview session
async function startNewInterview() {
  const topic = document.getElementById("interview-topic").value;
  const difficulty = document.getElementById("interview-difficulty").value;
  const count = parseInt(document.getElementById("interview-count").value, 10);
  const jobDesc = document.getElementById("job-description").value.trim();

  // Reset interview parameters
  state.questions = [];
  state.answers = [];
  state.evaluations = [];
  state.currentQuestionIndex = 0;

  // Show loading indicator
  const startBtn = document.getElementById("start-interview-btn");
  const originalText = startBtn.innerHTML;
  startBtn.disabled = true;
  startBtn.innerHTML = '<span class="spinner"></span> Loading Questions...';

  try {
    if (state.apiKeyMode && window.prepaiLlm && window.prepaiLlm.isLlmConfigured()) {
      // Dynamic Open Source AI question generation
      const aiQuestions = await window.prepaiLlm.generateAIQuestions(topic, difficulty, count, jobDesc);
      state.questions = aiQuestions;
      showToast(`Generated ${aiQuestions.length} custom AI questions using Open Source LLM!`, "success");
    } else {
      // Offline mode questions selection with keyword filters
      let pool = [];
      if (topic === "All") {
        pool = window.interviewQuestions;
      } else {
        pool = window.interviewQuestions.filter(q => q.category === topic);
      }

      // Filter by difficulty
      let filtered = pool.filter(q => q.difficulty === difficulty);
      if (filtered.length === 0) {
        // Fallback: use whatever is in the pool
        filtered = pool;
      }

      if (filtered.length === 0) {
        throw new Error("No questions available for the selected configuration.");
      }

      // Apply smart prompt keyword filter if provided
      if (jobDesc) {
        state.questions = getRelatedOfflineQuestions(filtered, jobDesc, count);
        showToast(`Matched related offline questions using prompt keywords!`, "success");
      } else {
        state.questions = selectRandomItems(filtered, count);
        showToast(`Selected ${state.questions.length} offline practice questions!`, "success");
      }
    }

    if (state.questions.length === 0) {
      throw new Error("Failed to populate questions. Try another configuration or check local LLM settings.");
    }

    // Launch Arena
    state.isInterviewActive = true;
    switchTab('interview');
    loadQuestion(0);

  } catch (error) {
    console.error("Failed to start interview:", error);
    showToast(error.message || "Failed to initialize interview.", "danger");
  } finally {
    startBtn.disabled = false;
    startBtn.innerHTML = originalText;
  }
}

// Selects N random items from an array
function selectRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Load details of the current question in the arena
function loadQuestion(index) {
  state.currentQuestionIndex = index;
  const q = state.questions[index];

  // Update progress bar
  const progressPercent = ((index) / state.questions.length) * 100;
  document.getElementById("interview-progress-bar").style.width = `${progressPercent}%`;
  document.getElementById("progress-text").textContent = `Question ${index + 1} of ${state.questions.length}`;

  // Hide feedback card, show response container
  document.getElementById("evaluation-card").style.display = "none";
  document.getElementById("answer-area").style.display = "flex";
  document.getElementById("submit-answer-btn").style.display = "inline-flex";
  document.getElementById("next-question-btn").style.display = "none";

  // Question details
  document.getElementById("q-category-tag").textContent = q.category;
  document.getElementById("q-difficulty-tag").textContent = q.difficulty;
  document.getElementById("q-text").textContent = q.question;

  // Clear answer
  document.getElementById("answer-input").value = '';
  document.getElementById("answer-input").disabled = false;

  // Reset timer
  resetTimer();
  startTimer();

  // TTS
  stopSpeaking();
}

// Submit answer for evaluation
async function submitCurrentAnswer() {
  const userAnswer = document.getElementById("answer-input").value.trim();
  const q = state.questions[state.currentQuestionIndex];

  stopListening();
  stopTimer();
  stopSpeaking();

  document.getElementById("answer-input").disabled = true;
  const submitBtn = document.getElementById("submit-answer-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Evaluating...';

  let evaluationResult = null;

  try {
    if (state.apiKeyMode && window.prepaiLlm && window.prepaiLlm.isLlmConfigured()) {
      // Dynamic Open Source LLM Evaluation
      evaluationResult = await window.prepaiLlm.evaluateUserAnswer(q.question, q.modelAnswer, userAnswer);
    } else {
      // Offline Simulated Evaluation
      evaluationResult = simulateOfflineEvaluation(q, userAnswer);
    }

    // Save states
    state.answers[state.currentQuestionIndex] = userAnswer;
    state.evaluations[state.currentQuestionIndex] = evaluationResult;

    // Render Evaluation Card
    renderEvaluationCard(evaluationResult);

    // Adjust controllers
    submitBtn.style.display = "none";
    
    const nextBtn = document.getElementById("next-question-btn");
    nextBtn.style.display = "inline-flex";
    if (state.currentQuestionIndex === state.questions.length - 1) {
      nextBtn.innerHTML = 'Complete Interview <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    } else {
      nextBtn.innerHTML = 'Next Question <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }

  } catch (error) {
    console.error("Evaluation error:", error);
    showToast(error.message || "Failed to submit answer.", "danger");
    document.getElementById("answer-input").disabled = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Move to next question or complete interview
function nextQuestion() {
  if (state.currentQuestionIndex < state.questions.length - 1) {
    loadQuestion(state.currentQuestionIndex + 1);
  } else {
    // Complete Session
    endInterview(true);
  }
}

// End the interview, save results if complete
function endInterview(save = true) {
  state.isInterviewActive = false;
  stopTimer();
  stopListening();
  stopSpeaking();

  if (save && state.questions.length > 0) {
    const evals = Array.isArray(state.evaluations) ? state.evaluations : [];
    const scores = evals.map(e => e ? (Number(e.score) || 0) : 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b, 0) / scores.length) : 0;

    const newSession = {
      timestamp: Date.now(),
      topic: state.questions[0]?.category || "General",
      difficulty: state.questions[0]?.difficulty || "Mixed",
      questionsCount: state.questions.length,
      questions: state.questions,
      answers: state.answers,
      evaluations: state.evaluations,
      averageScore: avgScore
    };

    state.history.unshift(newSession);
    localStorage.setItem("prepai_history", JSON.stringify(state.history));
    showToast(`Interview complete! Average score: ${avgScore}%`, "success");
    renderDashboard();
    switchTab('dashboard');
  }
}

// Heuristic-based Offline Answer Evaluation Simulator
function simulateOfflineEvaluation(questionObj, userAnswer) {
  if (!userAnswer || userAnswer.trim().length < 5) {
    return {
      score: 0,
      strengths: "No meaningful answer was provided.",
      weaknesses: "Your response is too short or empty. Provide a structured explanation covering the core concepts of the question.",
      modelAnswer: questionObj.modelAnswer
    };
  }

  const answerLower = userAnswer.toLowerCase();
  const matchedKeywords = [];
  
  // Calculate keyword matches
  questionObj.keywords.forEach(keyword => {
    if (answerLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  });

  const keywordMatchRatio = matchedKeywords.length / questionObj.keywords.length;
  
  // Score heuristics:
  // - Keyword coverage (up to 60 points)
  // - Length check (up to 25 points) - optimal length between 150 and 600 characters
  // - Detailed depth simulation (up to 15 points)
  let score = 0;
  score += Math.round(keywordMatchRatio * 60);

  const len = userAnswer.length;
  if (len >= 150 && len <= 600) {
    score += 25;
  } else if (len > 600) {
    score += 20; // Slight penalty for potential rambling
  } else if (len >= 50) {
    score += 12;
  } else {
    score += 5;
  }

  // Simulated completeness
  if (matchedKeywords.length >= 2) {
    score += 15;
  } else if (matchedKeywords.length === 1) {
    score += 8;
  }

  // Cap at 100, floor at 10 (since they wrote something)
  score = Math.min(100, Math.max(10, score));

  // Dynamic feedback compiled from matched/unmatched keywords
  const missedKeywords = questionObj.keywords.filter(k => !matchedKeywords.includes(k));
  
  let strengths = `You demonstrated familiarity with: ${matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'the basic concept'}. Your answer shows attempt to address the question directly.`;
  if (matchedKeywords.length === 0) {
    strengths = "Your answer contains initial descriptions, but lacks core technical keywords necessary for this level.";
  }

  let weaknesses = '';
  if (missedKeywords.length > 0) {
    weaknesses = `You should expand on concepts like: ${missedKeywords.slice(0, 3).join(', ')}. Try detailing their functionality, architectural impact, or usage in real-world scenarios.`;
  } else {
    weaknesses = "Very solid coverage of keywords. For further improvement, include specific code patterns or edge cases.";
  }

  if (len < 100) {
    weaknesses += " Your response was somewhat brief. Technical interviewers look for deep, structured answers.";
  }

  return {
    score: score,
    strengths: strengths,
    weaknesses: weaknesses,
    modelAnswer: questionObj.modelAnswer
  };
}

// Render the evaluated card elements in the active arena
function renderEvaluationCard(evaluation) {
  const card = document.getElementById("evaluation-card");
  card.style.display = "flex";

  // Score circular indicator animation
  const circle = card.querySelector(".score-circle");
  circle.style.setProperty("--score-value", evaluation.score);
  circle.style.setProperty("--score-color", getScoreColor(evaluation.score));
  
  card.querySelector(".score-num").textContent = evaluation.score;
  card.querySelector(".score-num").style.color = getScoreColor(evaluation.score);

  card.querySelector("#eval-strengths").textContent = evaluation.strengths;
  card.querySelector("#eval-weaknesses").textContent = evaluation.weaknesses;
  card.querySelector("#eval-model").textContent = evaluation.modelAnswer;

  // Scroll to feedback
  card.scrollIntoView({ behavior: 'smooth' });
}

// Color ranges based on grades
function getScoreColor(score) {
  if (score >= 80) return "var(--color-success)"; // green
  if (score >= 50) return "var(--color-warning)"; // yellow
  return "var(--color-danger)"; // red
}

// Timer loops
function startTimer() {
  state.timer.seconds = 0;
  updateTimerUI();
  
  state.timer.intervalId = setInterval(() => {
    state.timer.seconds++;
    updateTimerUI();
  }, 1000);
}

function stopTimer() {
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
}

function resetTimer() {
  stopTimer();
  state.timer.seconds = 0;
  updateTimerUI();
}

function updateTimerUI() {
  const mins = Math.floor(state.timer.seconds / 60);
  const secs = state.timer.seconds % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  const box = document.getElementById("timer-display");
  if (box) {
    box.textContent = timeStr;
    // Add flashing styling if exceeding 3 mins (180 secs)
    if (state.timer.seconds >= 180) {
      box.parentElement.classList.add("warning");
    } else {
      box.parentElement.classList.remove("warning");
    }
  }
}

// Speak voice controls (TTS)
function toggleSpeakQuestion() {
  if (state.speech.isSpeaking) {
    stopSpeaking();
  } else {
    const qText = document.getElementById("q-text").textContent;
    if (qText && state.speech.synthesis) {
      // Cancel ongoing first
      state.speech.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(qText);
      
      // Get settings preferences
      const pitch = parseFloat(document.getElementById("voice-pitch")?.value || 1);
      const rate = parseFloat(document.getElementById("voice-rate")?.value || 1);
      
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onend = () => {
        stopSpeaking();
      };
      
      utterance.onerror = () => {
        stopSpeaking();
      };

      state.speech.isSpeaking = true;
      const speakBtn = document.getElementById("speak-btn");
      speakBtn.classList.add("btn-primary");
      speakBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9c-.5.8-1.5 1.5-2.5 1.5s-2-.7-2.5-1.5M23 15c-.5-.8-1.5-1.5-2.5-1.5s-2 .7-2.5 1.5"/></svg> Stop Reading';

      state.speech.synthesis.speak(utterance);
    }
  }
}

function stopSpeaking() {
  if (state.speech.synthesis && state.speech.isSpeaking) {
    state.speech.synthesis.cancel();
  }
  state.speech.isSpeaking = false;
  const speakBtn = document.getElementById("speak-btn");
  if (speakBtn) {
    speakBtn.classList.remove("btn-primary");
    speakBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Read Question';
  }
}

// Microphone voice controls (STT)
function toggleMicrophone() {
  if (state.speech.isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (state.speech.recognition) {
    try {
      state.speech.recognition.start();
      state.speech.isListening = true;
      
      const micBtn = document.getElementById("mic-btn");
      micBtn.innerHTML = '<span class="spinner" style="border-top-color:#fca5a5; width:16px; height:16px;"></span> Listening...';
      micBtn.style.background = "rgba(239, 68, 68, 0.2)";
      micBtn.style.borderColor = "var(--color-danger)";
      
      document.getElementById("mic-wave").classList.add("active");
      showToast("Speech recording active. Speak clearly into your mic.", "info");
    } catch (e) {
      console.error(e);
      showToast("Microphone is already in use or initialization failed.", "warning");
    }
  } else {
    showToast("Speech recognition is not supported by your browser. Please type your response.", "warning");
  }
}

function stopListening() {
  if (state.speech.recognition && state.speech.isListening) {
    state.speech.recognition.stop();
    state.speech.isListening = false;
    
    const micBtn = document.getElementById("mic-btn");
    if (micBtn) {
      micBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> Answer with Voice';
      micBtn.style.background = "";
      micBtn.style.borderColor = "";
    }
    
    const wave = document.getElementById("mic-wave");
    if (wave) wave.classList.remove("active");
  }
}

// Display Toast Alerts
function showToast(message, type = 'info') {
  // Remove existing
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toastHtml = `
    <div class="toast ${type}">
      <span>${message}</span>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', toastHtml);

  // Trigger animation
  setTimeout(() => {
    const toast = document.querySelector(".toast");
    if (toast) toast.classList.add("show");
  }, 100);

  // Auto remove
  setTimeout(() => {
    const toast = document.querySelector(".toast");
    if (toast) {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}
