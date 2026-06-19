# KORTEX AI — Personal Knowledge Assistant & AI Second Brain

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-blue)](https://github.com/pgvector/pgvector)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-green)](https://ai.google.dev)

> A production-grade AI Second Brain platform powered by Gemini 2.5 Flash, Hybrid Search RAG, and an event-driven architecture. Comparable to Notion AI + NotebookLM + Obsidian.

---

## ✨ Features

- 🧠 **AI Chat with Documents** — NotebookLM-style RAG with source citations
- 🔍 **Hybrid Semantic Search** — BM25 + PgVector + Reranking
- 🕸️ **AI Knowledge Graph** — Auto-extracted concepts and relationships
- 🌌 **Memory Universe** — Force-directed 3D knowledge visualization
- 📚 **Learning Paths** — AI-generated curriculum from your documents
- 🃏 **Spaced Repetition Flashcards** — Anki-style SM-2 algorithm
- 🧪 **Quiz Generator** — MCQ, True/False, Short Answer
- 📊 **Analytics Dashboard** — Event-sourced learning metrics
- 🗣️ **Voice AI** — Whisper STT + OpenAI TTS
- 🤖 **AI Agents** — Research, Study, Graph, Summarization, Quiz agents
- 💼 **Multi-Tenant Workspaces** — Teams with RBAC roles
- 📅 **Daily Knowledge Digest** — Personalized nightly AI reports

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Framer Motion, GSAP |
| UI | Shadcn UI, Radix Primitives, Lucide Icons |
| Graph | React Flow (@xyflow/react) |
| State | Zustand, TanStack Query |
| Auth | Clerk |
| AI LLM | Google Gemini 2.5 Flash |
| AI Embeddings | OpenAI text-embedding-3-small |
| Voice | OpenAI Whisper + TTS |
| Database | PostgreSQL + pgvector (Prisma ORM) |
| Queue | BullMQ + Redis (Upstash) |
| Storage | Vercel Blob / AWS S3 |
| Deployment | Vercel + Render (workers) |

---

## 📦 Prerequisites

- Node.js 20+
- PostgreSQL 15+ with pgvector extension
- Redis (Upstash recommended)
- Clerk account
- Google AI Studio (Gemini API key)
- OpenAI API key

---

## 🛠️ Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd kortex-ai
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Enable pgvector on PostgreSQL

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 4. Setup database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run development server

```bash
npm run dev
```

### 6. Run BullMQ workers (in a separate terminal)

```bash
npm run workers
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📁 Project Structure

```
kortex-ai/
├── app/
│   ├── (landing)/          # Cinematic landing page
│   ├── (auth)/             # Clerk sign-in/sign-up
│   ├── dashboard/          # Main dashboard
│   ├── documents/          # Document management
│   ├── chat/               # RAG Chat
│   ├── workspace/          # AI Productivity Hub
│   ├── knowledge-graph/    # Graph + Memory Universe
│   ├── learning-paths/     # AI Learning Paths
│   ├── flashcards/         # SRS Flashcard system
│   ├── quizzes/            # Quiz generator
│   ├── analytics/          # Analytics dashboard
│   ├── voice/              # Voice AI interface
│   └── settings/           # User/Workspace settings
├── components/             # Reusable UI components
├── lib/
│   ├── ai/                 # Gemini AI service
│   ├── embeddings/         # OpenAI embeddings service
│   ├── vector-store/       # VectorStore abstraction + PgVector
│   ├── rag/                # Hybrid RAG pipeline
│   ├── agents/             # Specialized AI agents
│   ├── queue/              # BullMQ publishers
│   └── db/                 # Prisma client
├── workers/                # BullMQ background workers
└── prisma/
    └── schema.prisma       # Database schema
```

---

## 🌍 Deployment

1. Deploy Next.js app to **Vercel**
2. Deploy workers to **Render** or **Railway** as background services
3. Use **Supabase** for PostgreSQL + pgvector
4. Use **Upstash** for Redis
5. Set all environment variables in Vercel Dashboard

---

## 📄 License

MIT
