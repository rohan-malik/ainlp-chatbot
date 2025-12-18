# ⚡ Quick Start Guide

## 🎯 What is This?

AI NLP Chatbot for IIM Indore - A multilingual, intelligent chatbot with:
- ✅ 6 languages with auto-detect
- ✅ Temperature control (Factual/Balanced/Creative)
- ✅ 3 chat styles (Professional/Casual/Bollywood)
- ✅ Quick action buttons
- ✅ RAG system (grounded in knowledge base)
- ✅ Beautiful, modern UI

---

## 🚀 One-Touch Deployment

### Step 1: Push to GitHub
```bash
cd /Users/rohanmalik/CascadeProjects/multilingual-chatbot
git remote add origin https://github.com/rohan-malik/ainlp-chatbot.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend (Netlify)
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select `rohan-malik/ainlp-chatbot`
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish: `frontend/dist`
7. **Deploy!** ✅

### Step 3: Deploy Backend (Render)
1. Go to https://render.com
2. Click "New Web Service"
3. Select `rohan-malik/ainlp-chatbot`
4. Build: `cd backend && npm install`
5. Start: `cd backend && npm start`
6. Add env var: `OPENAI_API_KEY=your_key`
7. **Deploy!** ✅

---

## 📊 Live URLs (After Deployment)

- **Frontend**: https://ainlp-chatbot.netlify.app
- **Backend**: https://ainlp-chatbot-backend.onrender.com

---

## 💻 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5001
```

---

## 📁 Project Structure

```
ainlp-chatbot/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   └── StyleSelector.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js + Express
│   ├── server.js            # Main server
│   ├── rag.js               # RAG system
│   ├── knowledge-base.json  # Knowledge base
│   └── package.json
├── README.md
├── DEPLOYMENT_GUIDE.md
└── GITHUB_SETUP.md
```

---

## 🎮 Features to Try

1. **Auto-Detect Language** - Type in Hindi/Spanish/Tamil and it responds in the same language
2. **Temperature Control** - Try Factual vs Creative for different response styles
3. **Chat Styles** - Switch between Professional, Casual, and Bollywood
4. **Quick Actions** - Click buttons to auto-send predefined queries
5. **Conversation History** - Chat maintains context across messages

---

## 🔑 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key
PORT=5001
```

---

## 📚 Documentation

- `README.md` - Full project documentation
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `GITHUB_SETUP.md` - GitHub and one-touch deployment setup

---

## ✨ That's It!

Your chatbot is ready for production! 🎉

For detailed instructions, see `DEPLOYMENT_GUIDE.md` or `GITHUB_SETUP.md`.
