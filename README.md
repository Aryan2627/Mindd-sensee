# 🧠 Mind-Sense — AI Mental Wellness Companion

> A full-stack AI-powered mental wellness app with emotion detection, supportive chat, mood tracking, and safety features.

![Mind-Sense](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🗂️ Project Structure

```
Mind-Sense/
├── frontend/          # React + Tailwind CSS
├── backend/           # Node.js + Express REST API
├── ml-service/        # Python FastAPI + BERT emotion detection
├── docker/            # Docker configs
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- MongoDB Atlas account
- OpenAI API key

### 1. Clone & setup env files
```bash
git clone https://github.com/Aryan2627/Mind-Sense.git
cd Mind-Sense
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ml-service/.env.example ml-service/.env
```

### 2. Run with Docker (recommended)
```bash
docker-compose up --build
```

### 3. Run manually
```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev

# Terminal 3 — ML Service
cd ml-service && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

## 🌐 Services & Ports

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:5173       |
| Backend    | http://localhost:5000       |
| ML Service | http://localhost:8000       |

## 📦 Deployment

| Service    | Platform           |
|------------|--------------------|
| Frontend   | Vercel             |
| Backend    | Render / AWS EC2   |
| ML Service | Docker + Fly.io    |
| Database   | MongoDB Atlas      |

## ⚠️ Disclaimer

> Mind-Sense is **not** a substitute for professional mental health care. If you are in crisis, please contact a licensed therapist or a helpline immediately.

**India helplines:**
- iCall: 9152987821
- Vandrevala Foundation: 1860-2662-345
- AASRA: 9820466627

## 📄 License
MIT
