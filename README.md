# 🚀 SmartResume

AI-powered SaaS tool to tailor your resume for any job description in seconds.  
Paste your resume + JD, hit generate, and get a personalized version instantly.

---

## ✨ Features

- 🔐 **User Auth** — Supabase email/password auth
- 📄 **Paste Resume + Job Description** — Simple input UI
- 🤖 **AI Tailoring** — OpenAI GPT-4 creates a job-matching resume
- 💾 **Save Versions** — Store and manage multiple tailored resumes
- 🧠 **Real-time Suggestions** (optional) — Live feedback powered by AI
- 📤 **Export as PDF** (optional) — Download resume versions

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database & Auth**: Supabase
- **AI Engine**: OpenAI API (GPT-4)

---

## 📦 Getting Started

### 1. Clone the repo

git clone https://github.com/your-username/smartresume.git
cd smartresume

### 2. Install dependencies

bash
Copy
Edit
npm install

### 3. Set up environment variables

Create a .env.local file and add:

env
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

### 4. Run the dev server

bash
Copy
Edit
npm run dev
App will be running at http://localhost:3000

## 📁 File Structure

bash
Copy
Edit
/app → App Router pages
/components → Reusable UI components
/lib → Supabase + OpenAI API clients
/pages/api → API route for resume generation
/styles → Global Tailwind styles
.env.local → Environment variables

## 🧠 How It Works

User logs in via Supabase

Pastes their resume and job description

Frontend sends both to the /api/generate endpoint

OpenAI returns a tailored resume and improvement suggestions

User can save, edit, or export the results

## 📌 TODO / Roadmap

Export to PDF

Real-time feedback (via Supabase Realtime)

AI scoring system

Subscription/paywall model

LinkedIn import integration

## 💡 Inspiration

Combines 🔥 keywords: AI + SaaS + career productivity.
Perfect for job-seekers, recruiters, and anyone tired of editing resumes manually.

## 📜 License

MIT — free to use, modify, and deploy. Please give credit where due. This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
