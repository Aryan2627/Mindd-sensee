#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  Mind-Sense — Push to GitHub
#  Usage: bash push_to_github.sh
# ─────────────────────────────────────────────────────────────

set -e

REPO="https://github.com/Aryan2627/Mind-Sense.git"

echo ""
echo "🧠 Mind-Sense — GitHub Push Script"
echo "────────────────────────────────────"

# Check git is installed
if ! command -v git &> /dev/null; then
  echo "❌ git is not installed. Please install it first."
  exit 1
fi

# Initialize repo if needed
if [ ! -d ".git" ]; then
  echo "📁 Initialising git repository…"
  git init
fi

# Set up remote
if git remote | grep -q "^origin$"; then
  echo "🔗 Remote 'origin' already exists — updating URL…"
  git remote set-url origin "$REPO"
else
  echo "🔗 Adding remote origin…"
  git remote add origin "$REPO"
fi

# Stage everything
echo "📦 Staging all files…"
git add .

# Commit
echo "✍️  Creating initial commit…"
git commit -m "🚀 Initial commit — Mind-Sense full-stack AI wellness app

Services included:
- frontend/    React + Tailwind + Chart.js
- backend/     Node.js + Express + MongoDB
- ml-service/  Python FastAPI + BERT emotion detection
- docker-compose.yml for local development

Features:
- JWT authentication
- AI chat with OpenAI GPT-4o
- Emotion detection (LR + BERT)
- Risk detection with crisis helplines
- Mood logging + analytics
- Personalised recommendations
- Voice input support" || echo "ℹ️  Nothing new to commit."

# Push
echo ""
echo "🚀 Pushing to GitHub…"
echo "   Repository: $REPO"
echo ""
echo "⚠️  You will be prompted for your GitHub credentials."
echo "   Use your GitHub username and a Personal Access Token (not your password)."
echo "   Create a token at: https://github.com/settings/tokens"
echo ""

git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to https://github.com/Aryan2627/Mind-Sense"
echo ""
echo "Next steps:"
echo "  1. Add your .env files (copy from .env.example)"
echo "  2. Deploy frontend to Vercel: https://vercel.com/import"
echo "  3. Deploy backend to Render:  https://render.com"
echo "  4. Train ML model: cd ml-service && python train_model.py --mode lr"
