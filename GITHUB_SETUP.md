# 📋 GitHub Setup Instructions

## Push to GitHub

To push this repository to GitHub, follow these steps:

### 1. Create Repository on GitHub
- Go to https://github.com/new
- Repository name: `ainlp-chatbot`
- Description: "AI NLP Chatbot for IIM Indore with multilingual support, temperature control, and chat styles"
- Make it **Public** (for live demo)
- Click "Create repository"

### 2. Add Remote and Push

```bash
cd /Users/rohanmalik/CascadeProjects/multilingual-chatbot

# Add remote origin
git remote add origin https://github.com/rohan-malik/ainlp-chatbot.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Verify on GitHub
- Go to https://github.com/rohan-malik/ainlp-chatbot
- You should see all files pushed successfully

---

## One-Touch Live Demo Setup

### Option 1: Netlify (Frontend) + Render (Backend)

**Frontend on Netlify:**
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub repository: `rohan-malik/ainlp-chatbot`
4. Build command: `npm run build`
5. Publish directory: `frontend/dist`
6. Base directory: `frontend`
7. Deploy!

**Backend on Render:**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Select GitHub repository: `rohan-malik/ainlp-chatbot`
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Add environment variable: `OPENAI_API_KEY`
7. Deploy!

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
1. Go to https://vercel.com
2. Click "New Project"
3. Select GitHub repository: `rohan-malik/ainlp-chatbot`
4. Root directory: `frontend`
5. Deploy!

**Backend on Railway:**
1. Go to https://railway.app
2. Click "New Project"
3. Select GitHub repository: `rohan-malik/ainlp-chatbot`
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy!

---

## Expected Live URLs

- **Frontend**: `https://ainlp-chatbot.netlify.app` (or Vercel equivalent)
- **Backend**: `https://ainlp-chatbot-backend.onrender.com` (or Railway equivalent)

---

## Troubleshooting

If deployment fails:
1. Check that `.env.example` exists in backend folder
2. Ensure `OPENAI_API_KEY` is set in deployment environment
3. Verify build commands are correct
4. Check deployment logs for errors

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
