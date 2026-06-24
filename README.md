# 🚀 PrepAI: Premium AI Interview Prep Assistant

PrepAI is a futuristic, highly interactive single-page web application designed to help developers and technical professionals master their interview drills. Styled with a premium glassmorphic dark-mode interface, PrepAI supports both offline standard prep modes and active live AI integrations using Google Gemini.

---

## ✨ Features

- **🎯 Dual Scoring Engines**:
  - **Offline Mode**: Operates out-of-the-box using a comprehensive, local catalog of 15+ complex questions spanning multiple categories (Frontend, Backend, System Design, DSA, and Behavioral) and difficulties (Junior to Staff Lead). Scores answers using structural keyword checks, lengths, and completeness metrics.
  - **Gemini AI Mode**: Connects directly to Google's `gemini-2.5-flash` model. Enables custom question generation based on a **custom job description or resume** and offers deep contextual evaluation grading, custom score points, strengths, improvements, and personalized model answers.
- **🎙️ Voice Integration (Web Speech API)**:
  - **Read Question**: Uses speech synthesis to dictate interview questions, creating a realistic listening comprehension experience.
  - **Answer with Voice**: Uses speech recognition to transcribe spoken answers directly into response windows. Includes a dynamic keyframe CSS audio wave visualizer.
- **📊 Real-time Dashboard Analytics**:
  - Automatically records drill counts, average grading, and top-performing tracks.
  - Visualizes strengths vs weaknesses across specific categories.
  - Keeps chronological session reviews using browser `localStorage` (fully private, secure, and offline).
- **⚙️ Configurable Preferences**:
  - Securely inputs and stores Gemini API keys directly in the browser's sandbox (never shared with any external server).
  - Configures Voice Synthesis pitch and speeds.
  - Full history resets.

---

## 📁 File Structure

The project has zero complex build chains or node package dependencies, allowing immediate static execution or deployment:

```
interview-assistant/
├── index.html           # Main HTML structure, views, and navigation sidebar
├── index.css            # Custom CSS: layouts, glassmorphism design tokens, keyframe animations
├── app.js               # Central state controller, routing, timers, Web Speech APIs, and offline grading
├── gemini.js            # Service layer communicating with Gemini API (JSON structured response modes)
├── questions.js         # Offline questions database containing keywords and reference answers
└── .gitignore           # Excludes local artifacts and build directories
```

---

## 🛠️ Local Setup

1. **Clone or Download** this repository.
2. Locate the folder: `F:\interview-assistant` (or your download path).
3. **Run Locally**:
   - Double-click `index.html` to open it directly in any modern browser.
   - Alternatively, spin up a local server for testing Speech APIs (some browsers require a secure origin/local server context for speech synthesis and recognition to function correctly):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (npx)
     npx serve
     ```
   - Access the server link at `http://localhost:8000` or `http://localhost:3000`.

---

## Live Production link:- https://interview-assistant-green.vercel.app

## 🔑 Configure Gemini AI Mode

1. Navigate to **Settings** in the sidebar.
2. Input your Google AI Studio API key. (Get a free key from [Google AI Studio](https://aistudio.google.com/)).
3. Enable the **Gemini AI Integration** toggle.
4. Click **Save Settings**.
5. You can now setup interviews using **Custom Job Descriptions** for dynamically-generated questions.

---

## ⚡ Deployment

### Deploying to Vercel
Since PrepAI is a pure static web application, it can be deployed on Vercel instantly without any configuration files:

1. Install the Vercel CLI globally (or run via `npx`):
   ```bash
   npm install -g vercel
   ```
2. Log into your Vercel account:
   ```bash
   vercel login
   ```
3. Run the deployment command inside the project directory:
   ```bash
   vercel --prod
   ```
4. Follow the command prompts to set up a new project and retrieve your live production URL!
