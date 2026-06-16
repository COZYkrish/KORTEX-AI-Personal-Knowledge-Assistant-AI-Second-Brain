# KORTEX AI — Personal Knowledge Assistant & AI Second Brain

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-blue?style=for-the-badge&logo=postgresql)](https://github.com/pgvector/pgvector)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-green?style=for-the-badge&logo=google-gemini)](https://ai.google.dev)
[![BullMQ](https://img.shields.io/badge/Queue-BullMQ%20+%20Redis-red?style=for-the-badge&logo=redis)](https://bullmq.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

![Kortex AI Banner](./public/images/kortex_ai_banner.png)

Kortex AI is a production-grade, multi-tenant AI-powered Personal Knowledge Assistant and AI Second Brain platform. Built on Next.js 16, Neon Postgres, pgvector, and BullMQ, and powered by Google Gemini 2.5 Flash, it brings advanced retrieval-augmented generation (RAG), semantic graph extraction, spaced repetition learning, and analytics into a cohesive, cinematic, dark-themed Bauhaus workspace.

---

## 📸 Workspace Walkthrough

Here is a visual overview of the Kortex AI dashboard mockup and semantic knowledge graph visualizations:

![Kortex AI Dashboard UI](./public/images/dashboard_ui_mockup.png)
*Figure 1: Premium, high-contrast dark-themed productivity dashboard design showcasing files and workspace metrics.*

![Semantic Knowledge Graph Visual](./public/images/knowledge_graph_visual.png)
*Figure 2: Conceptual semantic graph representation mapping nodes and connecting relationship vectors.*

---

## 📌 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Bauhaus Design System & Aesthetics](#-bauhaus-design-system--aesthetics)
3. [System Architecture Deep-Dive](#-system-architecture-deep-dive)
4. [Use Cases & Feature Specifications](#-use-cases--feature-specifications)
5. [Specialized AI Agents Registry](#-specialized-ai-agents-registry)
6. [Retrieval-Augmented Generation (RAG) Architecture](#-retrieval-augmented-generation-rag-architecture)
7. [SM-2 Spaced Repetition Logic](#-sm-2-spaced-repetition-logic)
8. [Core Implementation Challenges & Solutions](#-core-implementation-challenges--solutions)
9. [Database Schema & Prisma Reference](#-database-schema--prisma-reference)
10. [Detailed API Route Specifications](#-detailed-api-route-specifications)
11. [Background Workers & Job Schema](#-background-workers--job-schema)
12. [Folder Structure Walkthrough](#-folder-structure-walkthrough)
13. [Detailed Installation & Setup Guide](#-detailed-installation--setup-guide)
14. [Environment Variable Configuration](#-environment-variable-configuration)
15. [Production Deployment & Scaling Architectures](#-production-deployment--scaling-architectures)
16. [Troubleshooting Guide & FAQ](#-troubleshooting-guide--faq)
17. [MIT License Reference](#-mit-license-reference)

---

## 🧠 Executive Summary

Modern knowledge workers are overwhelmed by information scattered across documents, PDFs, bookmarks, and notes. Traditional search engines fail to understand semantic context, while standard LLM interfaces lack access to specialized personal or organizational files.

Kortex AI solves this problem by acting as a local, secure **AI Second Brain**. Users can upload documents (PDF, DOCX, TXT), which are automatically processed, chunked, embedded, and stored in a vector database. A hybrid search engine combines classic keyword search (BM25) with vector similarity (pgvector) to fetch relevant context. Specialized AI agents then synthesize this context, providing answers with precise citations, extracting key concepts to build a visual knowledge graph, generating study guides, creating spaced-repetition flashcards, and compiling daily digests.

---

## 🎨 Bauhaus Design System & Aesthetics

Kortex AI adopts a **print-Bauhaus** design system characterized by high contrast, structural layouts, and cinematic dark mode aesthetics.

### Key Design Tokens
<!-- * **Color Palette**: Highly tailored HSL colors. Sleek charcoal and deep obsidian backgrounds contrast with cream highlights, crimson accents, and muted primary colors. Generic browser primary colors are strictly avoided in favor of harmonized, premium tones. -->
* **Typography**: Uses modern typography utilizing fonts like *Inter*, *Outfit*, or *Roboto* loaded via Google Fonts instead of default browser sans-serif faces.
* **Glassmorphism**: Layouts feature semi-transparent glass panel overlays with fine subtle borders (`rgba(255,255,255,0.05)`) and deep backdrop filters.
* **Micro-Animations**: Hover interactions, page routing transitions, and graph rendering utilize *Framer Motion* and *GSAP* to create smooth, premium micro-animations that make the UI feel alive and responsive.
* **Responsive Layouts**: Fully responsive grid systems adapt seamlessly to mobile views, tablets, and ultra-wide desktop monitors.

---

## 🏗️ System Architecture Deep-Dive

Kortex AI is built on a decoupled, asynchronous, event-driven architecture to keep the client interface fast and responsive. Document processing and graph extraction are offloaded to BullMQ background workers powered by Redis.

```mermaid
graph TD
    User([User Client]) <--> NextJS[Next.js App Server / Port 3000]
    NextJS <--> Clerk[Clerk Auth Provider]
    NextJS <--> Database[(Neon PostgreSQL + pgvector)]
    NextJS <--> Redis[(Upstash Redis / Queue Broker)]
    NextJS <--> Gemini[Google Gemini 2.5 Flash API]
    
    subgraph Background Workers
        Redis <--> Workers[BullMQ Worker Processes]
        Workers <--> Database
        Workers <--> Gemini
    end
```

### Key Architectural Layers
1. **Frontend Tier (Next.js 16)**: Built using React Server Components (RSC) and Client Components. Leverages Zustand for global state management and TanStack Query for dynamic server cache syncing.
2. **API/Proxy Tier (proxy.ts)**: Acts as the security boundary. Next.js 16 proxy routing validates Clerk session tokens and forwards authenticated requests to dashboard views and api routing endpoints.
3. **Database Tier (Neon PostgreSQL + pgvector)**: Acts as the single source of truth. Prisma ORM translates Javascript schema objects to relational DDL. pgvector allows direct vector indexing of semantic embeddings.
4. **Queue Broker (BullMQ + Redis)**: Manages slow background tasks. Redis acts as the message broker, storing jobs in robust queues with configured exponential backoffs and retry attempts.
5. **AI Tier (Google Gemini 2.5)**: Used for both embeddings generation (`gemini-embedding-001`) and logical synthesis/agent tasks (`gemini-2.5-flash`).

---

## 🎯 Use Cases & Feature Specifications

### 1. NotebookLM-Style Document RAG Chat
* **Use Case**: Upload lecture notes, research papers, or API manuals, and ask questions directly.
* **Specification**: Fetches semantic chunks related to the query, appends the chunks as context to the Gemini prompt, and renders markdown answers with clickable citation markers mapping back to source page numbers and matching paragraphs.

### 2. Hybrid Semantic Search
* **Use Case**: Retrieve information from a library of 100+ documents without remembering the exact file names.
* **Specification**: Performs a multi-stage search query. First, retrieves keyword matches via full-text search. Second, queries pgvector using `cosine_similarity` for semantic matches. Third, combines and reranks results, providing the most relevant passages.

### 3. Spaced Repetition (Anki-Style SM-2 Algorithm)
* **Use Case**: Efficiently memorize key terms and concepts extracted from documents.
* **Specification**: Implements the SuperMemo-2 (SM-2) algorithm. Flashcards are presented based on user rating (Easy, Medium, Hard). Review intervals, repetitions, and ease factors are computed dynamically.

### 4. Semantic Concept Graphs & 3D Universe
* **Use Case**: Visually map connections between topics and technologies present in your files.
* **Specification**: An event-driven BullMQ worker automatically processes extracted text, using Gemini to extract key concepts (nodes) and their semantic relationships (edges). These are rendered in a dynamic React Flow canvas and visualized in a force-directed 3D interactive layout.

### 5. Automated AI Learning Paths
* **Use Case**: Generate a structured curriculum to learn a new topic based on uploaded resources.
* **Specification**: The Study Agent evaluates the core concepts of uploaded documents and generates a node-based curriculum tree detailing estimated study durations, prerequisites, milestones, and links.

### 6. Event-Sourced Analytics Dashboard
* **Use Case**: Track learning velocity, study hours, document counts, and flashcard recall rates.
* **Specification**: Every action (upload, search, review, quiz completion) registers an event in an event-sourced audit table. The analytics dashboard aggregates these events using raw SQL queries to display learning statistics and graphs.

### 7. Nightly Daily Digest Reports
* **Use Case**: Receive email/dashboard summary of concepts learned and questions missed during the day.
* **Specification**: BullMQ cron task schedules nightly compilation of learning progress and flashcard scores, prompting Gemini to generate a cohesive markdown summary.

### 8. Voice AI Interface
* **Use Case**: Talk to your Second Brain hands-free.
* **Specification**: Uses the browser speech-recognition API for live text capturing and synthesizes response streams back into voice output using dynamic browser voice engines.

---

## 🤖 Specialized AI Agents Registry

Kortex AI employs a registry of highly specialized agents (in `lib/agents/index.ts`) built on the `BaseAgent` class:

### 1. Research Agent (`ResearchAgent`)
* **Objective**: Compares and contrasts multiple documents to extract contradictions, key similarities, and novel insights.
* **Prompt Strategy**: Instructs the agent to act as an academic literature reviewer, outputting structured comparative reviews.
* **JSON Schema**:
  ```json
  {
    "similarities": ["string"],
    "contradictions": ["string"],
    "insights": ["string"],
    "literatureReview": "string"
  }
  ```

### 2. Study Agent (`StudyAgent`)
* **Objective**: Designs learning paths and milestones based on document topics.
* **Prompt Strategy**: Focuses on scaffolding knowledge, tracking prerequisites, and calculating logical milestones.
* **JSON Schema**:
  ```json
  {
    "title": "string",
    "description": "string",
    "nodes": [
      {
        "title": "string",
        "description": "string",
        "order": 1,
        "estimatedMinutes": 45
      }
    ]
  }
  ```

### 3. Quiz Agent (`QuizAgent`)
* **Objective**: Creates assessment questions based on document text chunks.
* **Question Types**: Multiple Choice Questions (MCQ), True/False, Short Answer.
* **JSON Schema**:
  ```json
  {
    "title": "string",
    "questions": [
      {
        "type": "MCQ | TRUE_FALSE | SHORT_ANSWER",
        "content": "string",
        "options": ["string"],
        "correctAnswer": "string",
        "explanation": "string",
        "order": 1
      }
    ]
  }
  ```

### 4. Knowledge Graph Agent (`KnowledgeGraphAgent`)
* **Objective**: Extracts workspace concepts and structural relationships.
* **Prompts**: Asks for 10-30 concepts and their most meaningful relations.
* **JSON Schema**:
  ```json
  {
    "concepts": [
      {
        "name": "string",
        "description": "string",
        "type": "concept | entity | topic | technology"
      }
    ],
    "relationships": [
      {
        "source": "string",
        "target": "string",
        "type": "includes | uses | related_to | contradicts | enables | requires",
        "label": "string"
      }
    ]
  }
  ```

### 5. Summarization Agent (`SummarizationAgent`)
* **Objective**: Generates summaries at varying detail levels.
* **Modes**: `brief` (2-3 paragraphs), `detailed` (comprehensive sections), `bullets` (10-15 key takeaways), `study_notes` (concepts, misconceptions, memory aids).

---

## 🔍 Retrieval-Augmented Generation (RAG) Architecture

The RAG pipeline is designed to achieve maximum precision and recall while minimizing LLM hallucination rates:

### Ingestion Pipeline
1. **Document Upload**: Files are written to the target server storage (Vercel Blob or local disk).
2. **Text Extraction**: The document text is extracted based on mime types:
   * **PDF**: Handled by `pdf-parse`, processing raw text streams page-by-page.
   * **Word (DOCX)**: Handled by `mammoth`, extracting raw semantic paragraph blocks.
   * **TXT**: Read directly as a UTF-8 stream.
3. **Semantic Chunking**: Extracted text is split into semantic paragraphs (around 500-1000 characters per chunk) using sliding window parameters with a 15% overlap. This preserves structural context across boundaries.
4. **Vector Embedding**: Chunks are processed by `gemini-embedding-001` (configured with `outputDimensionality: 768`) to obtain 768-dimensional float vectors.
5. **pgvector Storage**: Vectors are stored in a Neon PostgreSQL table (`document_chunks`) in an `embedding` column configured as `vector(768)`.

### Search & Synthesis Pipeline
1. **Query Embedding**: The search string is embedded into a 768-dimension vector using the same embedding model.
2. **Hybrid Search Execution**: A single raw query joins:
   * **Semantic Search**: pgvector cosine similarity index lookup:
     $$\text{Cosine Distance} = 1 - \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
     Filtered to match a threshold of $\ge 0.70$.
   * **Keyword Search**: PostgreSQL text search indexing (`tsvector` and `tsquery`) targeting terms in the chunk contents.
3. **Synthesis & Citation**: The top 5-7 chunks are combined and passed to the Gemini 2.5 Flash model alongside the user query. The model synthesizes the answer, inserting citation tags (e.g. `[1]`) that map directly to the matched document names and page numbers.

---

## 🃏 SM-2 Spaced Repetition Logic

Spaced repetition in Kortex AI utilizes the SuperMemo-2 (SM-2) algorithm. Flashcards are presented based on user rating. Review intervals, repetitions, and ease factors are computed dynamically.

### SM-2 Algorithm Steps:
For each card review, the user provides a quality grade ($q$) from 0 to 5:
* **0**: "Complete blackout", total forgetting.
* **1**: Incorrect response; the correct one felt familiar.
* **2**: Incorrect response; the correct one was easy to recall.
* **3**: Correct response recalled with serious difficulty.
* **4**: Correct response after a hesitation.
* **5**: "Perfect" response.

The calculations for Interval ($I$, in days) and Ease Factor ($EF$) follow:
* If $q < 3$, repetitions is reset to 0, and Interval is set to 1 day.
* If $q \ge 3$, Ease Factor is updated:
  $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
  * Ease Factor is capped at a minimum value of 1.3.
  * Repetitions is incremented by 1.
  * The new Interval is scheduled:
    * If repetitions == 1: $I' = 1$ day.
    * If repetitions == 2: $I' = 6$ days.
    * If repetitions > 2: $I' = \text{round}(I \times EF')$.

```mermaid
sequenceDiagram
    autonumber
    User->>Dashboard: Open Flashcards Review
    Dashboard->>DB: Fetch cards where nextReviewAt <= NOW
    DB-->>Dashboard: Return Flashcard records
    User->>Dashboard: Review Card & Select Grade (0-5)
    Dashboard->>API: POST /api/flashcards/review (id, grade)
    API->>API: Compute SM-2 (Interval, EaseFactor, Repetitions)
    API->>DB: UPDATE Flashcard (nextReviewAt, easeFactor, interval, repetitions)
    DB-->>API: Success
    API-->>Dashboard: Return updated Flashcard details
    Dashboard-->>User: Show Next Scheduled Flashcard
```

---

## ⚡ Core Implementation Challenges & Solutions

During the implementation and migration from mocked modules to production APIs, several complex engineering challenges were resolved:

### 1. PostgreSQL Column Casing in Raw SQL Queries
* **Problem**: Prisma defaults to camelCase mapping for fields (e.g., `workspaceId`, `createdAt`). In raw SQL queries (which are required for pgvector cosine distance operations and full-text search), PostgreSQL defaults to folding unquoted identifiers to lowercase. This caused queries targeting `workspaceId` or `createdAt` to fail with `column workspace_id does not exist` or `column createdat does not exist`.
* **Solution**: Updated all raw SQL query statements in the vector store providers and analytics routes to explicitly wrap identifiers in double quotes (e.g., `"workspaceId"`, `"createdAt"`). This prevents PostgreSQL from folding the identifiers to lowercase, ensuring they align perfectly with Prisma-generated DDL tables.

### 2. Next.js 16 Middleware Deprecation (proxy.ts Adaptation)
* **Problem**: Next.js 16.x deprecates `middleware.ts` in favor of `proxy.ts`. Attempting to run traditional Clerk auth checks in middleware caused compiler errors, page crashes, or redundant route blocking.
* **Solution**: Deleted the deprecated `middleware.ts` and successfully migrated Clerk authentication checks and route protection logic to [proxy.ts](file:///d:/Desktop/Kortex%20AI/kortex-ai/proxy.ts). We aligned the path pattern matching to protect dashboard and API routes while keeping public landing and authentication endpoints open.

### 3. BullMQ Worker Retries causing Unique Constraint Failures
* **Problem**: When `document-worker.ts` retried a failed ingestion job, it attempted to create records in `documentVersion` and `documentChunk`. However, because previous runs had partially succeeded, it crashed with database unique constraint violations (`documentId_versionNumber` unique key constraint).
* **Solution**: Implemented an idempotent transaction sweep at the beginning of the ingestion job. Before executing chunk insertion or creating document versions, the worker deletes all existing chunks, version models, and vector embeddings associated with that specific document ID.

### 4. SDK Type Omissions (The `outputDimensionality` Issue)
* **Problem**: The Google Generative AI SDK (`@google/generative-ai` version `^0.24.1`) does not declare the `outputDimensionality` parameter inside its `EmbedContentRequest` TypeScript type definition. However, the model `gemini-embedding-001` defaults to 3072 dimensions, whereas the database schema column size is configured as `vector(768)`. Omitting `outputDimensionality: 768` results in database insertion errors, but adding it throws a TypeScript compilation error.
* **Solution**: Configured the model payload as `{ content: { role: 'user', parts: [...] }, outputDimensionality: 768 }` and cast the request parameter as `as any` (e.g., `await model.embedContent({...} as any)`). This successfully compiles while instructing the Gemini API to truncate the output embeddings to 768 dimensions at runtime.

### 5. Gemini JSON Truncation & Parsing Failures
* **Problem**: The knowledge graph worker enqueues tasks that ask Gemini to output JSON arrays for 10-30 concepts and relationships. When outputting JSON as normal text, the LLM sometimes wraps the response in markdown code blocks (e.g., ` ```json `), or truncates the response if it hits the default token limit, causing `JSON.parse` syntax errors.
* **Solution**: Modified [gemini.ts](file:///d:/Desktop/Kortex%20AI/kortex-ai/lib/ai/gemini.ts) to explicitly set `responseMimeType: "application/json"` in the `generationConfig` of the fast model instance and increased `maxOutputTokens` from `4096` to `8192`. This forces the Gemini endpoint to return structured JSON without markdown fences and ensures ample token buffer size.

---

## 🗄️ Database Schema & Prisma Reference

Below is the database structure represented in the Prisma schema file (`prisma/schema.prisma`):

### Enums
* `WorkspaceRole`: Defines roles `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.
* `DocumentStatus`: File status tracking `PENDING`, `EXTRACTING`, `EMBEDDING`, `GRAPHING`, `READY`, `ERROR`.
* `MessageRole`: Message actors `USER`, `ASSISTANT`, `SYSTEM`.
* `FlashcardDifficulty`: SM-2 levels `EASY`, `MEDIUM`, `HARD`.
* `QuestionType`: Quiz formats `MCQ`, `TRUE_FALSE`, `SHORT_ANSWER`.
* `PathNodeStatus`: Milestone progress `PENDING`, `IN_PROGRESS`, `COMPLETED`.
* `EventType`: Audit tags tracking `DOCUMENT_UPLOADED`, `DOCUMENT_PROCESSED`, `CHAT_MESSAGE_SENT`, etc.

### Core Models DDL Mapping
```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  workspaceMembers WorkspaceMember[]
  events           Event[]
  settings         UserSettings?
  quizResults      QuizResult[]
}

model UserSettings {
  id              String  @id @default(cuid())
  userId          String  @unique
  theme           String  @default("dark")
  emailDigest     Boolean @default(true)
  voiceEnabled    Boolean @default(false)
  defaultLanguage String  @default("en")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  logoUrl     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members       WorkspaceMember[]
  invitations   WorkspaceInvitation[]
  folders       Folder[]
  documents     Document[]
  chats         Chat[]
  concepts      Concept[]
  flashcards    Flashcard[]
  quizzes       Quiz[]
  events        Event[]
  digests       DailyDigest[]
  learningPaths LearningPath[]
}

model Document {
  id           String         @id @default(cuid())
  workspaceId  String
  folderId     String?
  title        String
  fileName     String
  fileUrl      String
  mimeType     String
  fileSize     Int
  pageCount    Int?
  status       DocumentStatus @default(PENDING)
  errorMessage String?
  isFavorite   Boolean        @default(false)
  tags         String[]
  summary      String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  workspace Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  versions  DocumentVersion[]
  chunks    DocumentChunk[]
  concepts  Concept[]
}

model DocumentChunk {
  id         String                       @id @default(cuid())
  documentId String
  content    String
  embedding  Unsupported("vector(768)")?
  chunkIndex Int
  pageNumber Int?
  tokenCount Int?
  metadata   Json?
  createdAt  DateTime                     @default(now())

  document Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
}

model Concept {
  id          String   @id @default(cuid())
  workspaceId String
  documentId  String?
  name        String
  description String?
  type        String   @default("concept")
  color       String?
  x           Float?
  y           Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  workspace         Workspace      @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  document          Document?      @relation(fields: [documentId], references: [id], onDelete: SetNull)
  outgoingRelations Relationship[] @relation("source")
  incomingRelations Relationship[] @relation("target")
}

model Relationship {
  id              String @id @default(cuid())
  sourceConceptId String
  targetConceptId String
  type            String
  label           String?
  weight          Float  @default(1.0)

  source Concept @relation("source", fields: [sourceConceptId], references: [id], onDelete: Cascade)
  target Concept @relation("target", fields: [targetConceptId], references: [id], onDelete: Cascade)
}
```

---

## 🔌 Detailed API Route Specifications

Kortex AI communicates via standardized JSON API payloads. The core API endpoints are detailed below:

### 1. User Settings API (`/api/settings`)
* **Endpoint**: `/api/settings`
* **Method**: `GET`
  * **Description**: Retrieve settings configurations for the authenticated user session.
  * **Response (200 OK)**:
    ```json
    {
      "id": "cmql78xyz0000abcde",
      "userId": "cmql78abc0000defgh",
      "theme": "dark",
      "emailDigest": true,
      "voiceEnabled": false,
      "defaultLanguage": "en"
    }
    ```
* **Method**: `PATCH`
  * **Description**: Update user-specific preferences.
  * **Request Body**:
    ```json
    {
      "theme": "light",
      "emailDigest": false
    }
    ```
  * **Response (200 OK)**: Returns the updated settings JSON payload.

### 2. Semantic Search RAG API (`/api/search`)
* **Endpoint**: `/api/search`
* **Method**: `GET`
  * **Description**: Queries database chunks using keyword and semantic search, reranked via Gemini.
  * **Query Parameters**:
    * `q` (string, required): The search string.
    * `workspaceId` (string, required): Active workspace context.
  * **Response (200 OK)**:
    ```json
    [
      {
        "id": "chunk-cuid-1",
        "documentId": "doc-cuid-1",
        "title": "stanford-word-vectors.pdf",
        "content": "Word vectors represent words as continuous vectors in a dense space...",
        "score": 0.892,
        "pageNumber": 3
      }
    ]
    ```

### 3. AI Canvas / Assistant API (`/api/workspace/ai`)
* **Endpoint**: `/api/workspace/ai`
* **Method**: `POST`
  * **Description**: Invokes the agent panel models to rewrite, summarize, or query content.
  * **Request Body**:
    ```json
    {
      "action": "summarize",
      "content": "Text to be processed by the assistant...",
      "workspaceId": "ws-cuid-1"
    }
    ```
  * **Response (200 OK)**:
    ```json
    {
      "success": true,
      "result": "### Summary \n\nThe input text outlines..."
    }
    ```

### 4. Knowledge Graph API (`/api/knowledge-graph`)
* **Endpoint**: `/api/knowledge-graph`
* **Method**: `POST`
  * **Description**: Explicitly triggers background concept and relationship extraction.
  * **Request Body**:
    ```json
    {
      "documentId": "doc-cuid-1",
      "workspaceId": "ws-cuid-1"
    }
    ```
  * **Response (202 Accepted)**:
    ```json
    {
      "success": true,
      "message": "Graph extraction job enqueued."
    }
    ```

---

## ⚙️ Background Workers & Job Schema

Decoupling slow tasks from web requests is managed via BullMQ workers running in separate terminal sessions:

### 1. Document Ingestion Worker (`workers/document-worker.ts`)
Processes files uploaded to static directories.
* **Queue Name**: `document-ingestion`
* **Job Payload Interface**:
  ```typescript
  interface DocumentIngestionPayload {
    documentId: string;
    workspaceId: string;
    fileUrl: string;
    mimeType: string;
  }
  ```
* **Step-by-Step Pipeline Flow**:
  1. Set Status to `EXTRACTING` in Postgres.
  2. Download file buffer from fileUrl (Vercel Blob / uploads folder).
  3. Extract raw text (using pdf-parse, mammoth, or text stream).
  4. Delete existing chunks, versions, and embeddings (Idempotency sweep).
  5. Create DocumentVersion record in DB.
  6. Set Status to `EMBEDDING` in Postgres.
  7. Chunk text using semantic window configurations.
  8. For each chunk batch (size 10):
     * Create DocumentChunk records in DB.
     * Call gemini-embedding-001 (outputDimensionality: 768).
     * Store raw vectors inside pgvector.
  9. Set Status to `GRAPHING` in Postgres.
  10. Enqueue job inside `graph-extraction` queue.

### 2. Graph Extraction Worker (`workers/graph-worker.ts`)
Runs concept extraction once embeddings are completed.
* **Queue Name**: `graph-extraction`
* **Job Payload Interface**:
  ```typescript
  interface GraphExtractionPayload {
    documentId: string;
    workspaceId: string;
    extractedText: string;
  }
  ```
* **Execution Flow**:
  1. Retrieves first 15,000 characters of document text.
  2. Invokes the `KnowledgeGraphAgent` (configured with `responseMimeType: "application/json"`).
  3. Parses the returned concepts and relationships arrays.
  4. For each concept, checks if a matching concept already exists in that workspace.
     * If existing: sets mappings and binds the document ID.
     * If new: creates the concept node in database.
  5. Upserts relationships between concept nodes.
  6. Updates the document status to `READY`.

### 3. Nightly Digest Worker (`dailyDigestQueue`)
Triggered via cron task every night at 11 PM. Compiles a summary of documents studied, quiz performance, and schedules a personalized email report.

---

## 📂 Folder Structure Walkthrough

A structured overview of the directory layout and file responsibilities:

```
kortex-ai/
├── app/                      # Next.js App Router root
│   ├── (landing)/          # Cinematic marketing & landing page
│   ├── (auth)/             # Authentication routing (Clerk integration)
│   ├── api/                  # Backend REST API routes
│   │   ├── documents/        # Upload & download endpoints
│   │   ├── search/           # Hybrid RAG search route
│   │   ├── settings/         # Settings API routes
│   │   └── workspace/        # AI Canvas API endpoint
│   └── dashboard/            # Protected Dashboard layouts
│       ├── search/           # RAG Search page
│       ├── settings/         # User/Workspace settings interface
│       ├── workspace/        # Writing dashboard and AI assistance panel
│       └── knowledge-graph/  # Interactive React Flow graph canvas
├── components/               # UI components (Shadcn, React Flow wrappers)
│   ├── landing/              # Interactive marketing modules
│   └── ui/                   # Reusable visual primitives
├── lib/                      # Core business logic helpers
│   ├── ai/                   # Gemini LLM config & interface
│   ├── db/                   # Prisma client singleton connection
│   ├── queue/                # Redis connections & BullMQ queues
│   ├── rag/                  # Semantic search & reranker implementation
│   └── vector-store/         # pgvector raw SQL execution provider
├── public/                   # Static uploads, PDFs, and asset images
├── prisma/                   # DB connection config & schema models
│   └── schema.prisma         # Active database modeling file
└── workers/                  # BullMQ background worker scripts
    ├── document-worker.ts    # File parser and chunk embedder
    └── graph-worker.ts       # Semantic network extractor
```

---

## 🛠️ Detailed Installation & Setup Guide

Ensure your development workspace matches the following prerequisites:
* Node.js version 20+ or newer.
* PostgreSQL 15+ database instance with the `vector` extension installed.
* Redis server (e.g. Local Redis or Upstash cloud instance).

### Step 1: Install Dependencies
Clone the repository and install packages:
```bash
git clone https://github.com/krishsharma/kortex-ai.git
cd kortex-ai
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```bash
# PostgreSQL + pgvector Connection
DATABASE_URL="postgresql://your_db_user:your_db_password@your_db_host/your_db_name?sslmode=require"

# Redis Server Connection
REDIS_URL="redis://localhost:6379"

# Clerk Auth Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Gemini AI Studio Key
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Application Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kortex AI"
NODE_ENV="development"
```

### Step 3: Setup database schema
Push the schema models directly to your Neon Postgres database and compile the Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Run the next dev server
Launch the Next.js Turbo dev server locally on port 3000:
```bash
npm run dev
```

### Step 5: Start the background BullMQ workers
Open two separate terminal windows and run the document processing and graph extraction worker scripts:
```bash
# Terminal 1: Ingestion worker
npm run workers

# Terminal 2: Knowledge graph worker
npm run worker:graph
```

Open `http://localhost:3000` inside your web browser to access the dashboard.

---

## 🌍 Environment Variable Configuration

Below is a detailed reference guide for the required and optional parameters inside `.env`:

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | N/A | Connection string for your PostgreSQL + pgvector instance (SSL mode required for Neon). |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Connection URI for the Redis queue broker (Upstash recommended for prod). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | N/A | Publishable key from your Clerk application dashboard. |
| `CLERK_SECRET_KEY` | Yes | N/A | Secret token used to authenticate calls with Clerk API endpoints. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | `/sign-in` | Route pattern pointing to the Clerk login card view. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | `/sign-up` | Route pattern pointing to the Clerk registration card view. |
| `GEMINI_API_KEY` | Yes | N/A | Google AI Studio developer API key for accessing LLM endpoints. |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Local or production domain routing address. |
| `NEXT_PUBLIC_APP_NAME` | No | `Kortex AI` | Visual name displayed inside page headers and emails. |

---

## 🌐 Production Deployment & Scaling Architectures

When deploying to a production cloud workspace, use the following topology:

1. **Frontend App**: Deploy to **Vercel** as a Next.js serverless application. Configure environment variables inside the Vercel project dashboard.
2. **Background Workers**: Deploy the workers as persistent background services on **Railway** or **Render**. Ensure they keep running in the background to listen for BullMQ jobs.
3. **Database**: Use **Neon** or **Supabase** for managed PostgreSQL. Ensure `pgvector` is enabled on the instance.
4. **Queue Broker**: Use **Upstash Redis** for a managed, serverless Redis instance. Set `maxRetriesPerRequest: null` inside your BullMQ connection config.

### Performance Optimization Strategies
* **Connection Pooling**: Use connection poolers like `pgbouncer` or Neon’s connection pooler URL when running in serverless environments (like Vercel functions) to prevent running out of PostgreSQL client connections.
* **Vector Indexing**: Once your document chunks table exceeds 50,000 records, establish an HNSW (Hierarchical Navigable Small World) index on the embedding vector column to speed up similarity lookups. Run the following raw migration:
  ```sql
  CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);
  ```
* **Redis Eviction**: Configure your Upstash Redis eviction policy to `noeviction` for BullMQ queues to ensure jobs are never dropped during memory pressure.

---

## 🔍 Troubleshooting Guide & FAQ

Here are common issues encountered during setup and how to resolve them:

#### Q1: Database query fails with `operator does not exist: vector <=> vector`
* **Reason**: The pgvector extension is either not installed or not enabled on your database schema.
* **Fix**: Ensure your Postgres user has superuser privileges and run the following command on the target database:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

#### Q2: Background workers crash with `Error: Connection lost` to Redis
* **Reason**: Redis connection timed out or is closed due to idle state.
* **Fix**: Set `maxRetriesPerRequest: null` inside `lib/queue/index.ts` to allow IORedis to handle reconnections automatically.

#### Q3: Gemini API fails with `404 Not Found: models/gemini-2.5-flash is not found`
* **Reason**: An outdated API version or model string is configured.
* **Fix**: Double check that `GEMINI_API_KEY` is active and correct. Set the model parameter to `gemini-2.5-flash` or `gemini-1.5-flash` depending on subscription tiers.

#### Q4: Next.js dev server shows port 3000 is in use
* **Reason**: An orphaned next dev server node process is running in the background.
* **Fix**: Kill the orphaned process. On Windows:
  ```powershell
  taskkill /F /IM node.exe
  ```
  On macOS/Linux:
  ```bash
  killall node
  ```

#### Q5: BullMQ job stuck in `active` state indefinitely
* **Reason**: The worker crashed while processing the job without rejecting or resolving the promise (often due to unhandled database connection losses).
* **Fix**: Set active job timeouts and keepalive configurations, or restart the BullMQ process manually to reclaim the locked job.

#### Q6: How does pgvector index vector embeddings?
* **Answer**: pgvector indexes vectors by creating index trees (like HNSW or IVFFlat) that partition the high-dimensional space into regions. Query lookups are executed as approximate nearest neighbor (ANN) searches, looking up adjacent nodes rather than scanning the entire table.

#### Q7: How does Kortex AI handle large documents (e.g. 500+ pages) without hitting Gemini limits?
* **Answer**: Large files are divided into small, individual semantic paragraphs (chunks). Only the top 5-7 most relevant chunks matching the query vectors are selected and sent to the LLM during RAG chat synthesis. This filters out 99% of the document content, remaining well within the context window limits.

---

## 📄 MIT License Reference

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
