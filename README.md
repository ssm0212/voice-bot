# Sharwari · AI Voice Interview Bot

A beautiful, production-ready AI voice interview bot that acts as a personalized AI version of Sharwari Muley — answering interview questions naturally through voice interaction, powered by Google Gemini.

---

## ✨ Features

- 🎤 **Voice Input** — Browser SpeechRecognition API with animated pulse effects
- 🤖 **AI Responses** — Google Gemini 1.5 Flash via FastAPI backend
- 🔊 **Voice Output** — Browser SpeechSynthesis for natural-sounding replies
- 💬 **Chat History** — Scrollable conversation with timestamps
- 💡 **Suggested Questions** — 8 clickable question cards
- ⌨️ **Text Fallback** — Type questions if mic isn't available
- 🌑 **Premium Dark UI** — Cormorant Garamond + DM Sans, gold accents, glass morphism
- 📱 **Mobile Responsive** — Works on all screen sizes
- ⚡ **Conversation Memory** — Last 10 messages sent as context

---

## 🗂 Project Structure

```
sharwari-bot/
├── backend/
│   ├── main.py            # FastAPI app with Gemini integration
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── MicButton.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── SuggestedQuestions.jsx
│   │   │   ├── StatusBar.jsx
│   │   │   └── TextInput.jsx
│   │   ├── hooks/
│   │   │   ├── useSpeechRecognition.js
│   │   │   └── useSpeechSynthesis.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run backend
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# VITE_API_URL=http://localhost:8000 (default, no change needed for local)

# Run frontend
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, set root directory to `backend/`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add Environment Variable: `GEMINI_API_KEY` = your key
7. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set root directory to `frontend/`
3. Framework: Vite
4. Add Environment Variable: `VITE_API_URL` = your Render backend URL (e.g. `https://sharwari-bot.onrender.com`)
5. Deploy

> **Important:** Update the CORS `allow_origins` in `backend/main.py` with your Vercel URL before deploying to production.

---

## 🔧 Environment Variables

### Backend `.env`
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Fonts | Cormorant Garamond + DM Sans |
| Backend | FastAPI (Python) |
| AI | Google Gemini 1.5 Flash |
| Voice In | Web Speech API (SpeechRecognition) |
| Voice Out | Web Speech API (SpeechSynthesis) |
| Deploy | Vercel (FE) + Render (BE) |

---

## 🌟 Browser Compatibility

Voice input (SpeechRecognition) works best in:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ⚠️ Safari (limited support)
- ❌ Firefox (not supported)

Voice output (SpeechSynthesis) works in all modern browsers.

---

## 📝 Customizing the Persona

Edit the `SYSTEM_PROMPT` in `backend/main.py` to change the persona. Adjust:
- Name and background details
- Projects and experience
- Speaking style instructions
- Sample responses for context

---


