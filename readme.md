# Vaani

> A voice-first personal health companion that remembers your health context, helps manage medications and appointments, and proactively checks in with you.

Vaani is a real-time digital nurse designed around **voice-first interaction**, persistent medical context, and proactive healthcare assistance.

Instead of treating every conversation as an isolated interaction, Vaani maintains structured health information, semantic medical memory, prescriptions, reminders, and user preferences so that interactions can become increasingly contextual over time.

The system combines **real-time voice processing, AI agents, structured medical data, semantic memory, caching, text-to-speech, authentication, notifications, and scheduled reminders** into a single healthcare-oriented platform.

---

## What Vaani Does

Vaani is designed to act as a persistent digital health companion rather than a conventional chatbot.

### Voice-first interaction

Users can speak naturally with Vaani instead of navigating forms or typing medical information.

The system supports:

- Real-time microphone input
- Streaming voice interaction
- English
- Hindi
- Hinglish
- Streaming AI responses
- Text-to-speech through Rime
- Interrupting and pausing ongoing audio
- Context-aware conversations

### Persistent health memory

Vaani can remember relevant medical information across conversations.

Medical information is separated into two layers:

**MongoDB**

The source of truth for structured medical information.

Examples include:

- Medical events
- Prescriptions
- Reminders
- User information
- Medication-related information
- Appointment-related information

**Qdrant**

The semantic memory layer used to retrieve relevant medical context based on meaning rather than exact keyword matching.

This allows Vaani to answer questions such as:

> "What medication was I taking for my previous infection?"

without requiring the user to remember the exact wording used when the information was originally stored.

### Redis caching

Redis is used as a **caching layer** to reduce unnecessary database and computation overhead.

The architecture therefore follows:

```text
                 ┌─────────────────┐
                 │    Frontend     │
                 │  Voice / UI     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Backend      │
                 │ Node.js/Express │
                 └───────┬─────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
       ┌─────────┐  ┌─────────┐  ┌─────────┐
       │ MongoDB │  │  Redis  │  │ Qdrant  │
       │ Source  │  │ Cache   │  │ Semantic│
       │ of Truth │  │         │  │ Memory  │
       └─────────┘  └─────────┘  └─────────┘
            │
            │
            ▼
       Structured
       Medical Data
```

Redis should not replace MongoDB. Cached data can be regenerated from the source of truth.

---

# Core Use Cases

## 1. Medical Conversation

A user can simply speak to Vaani:

> "I've been feeling a headache since yesterday."

Vaani can understand the conversation, determine whether the information is relevant to the user's medical context, and persist appropriate information.

---

## 2. Medication Management

Vaani can help users keep track of medications and prescriptions.

Potential interactions include:

- Asking what medications are currently being taken
- Remembering prescription information
- Creating medication reminders
- Retrieving previously stored prescriptions
- Discussing medication context during future conversations

---

## 3. Prescription Understanding

Users can upload prescription images.

The system can process the uploaded prescription and extract relevant information for storage and future retrieval.

This allows a prescription to become part of the user's persistent health context rather than remaining an isolated image.

---

## 4. Medical History Retrieval

Instead of manually searching through previous conversations, users can ask:

> "When did I last have this problem?"

or:

> "What did the doctor prescribe me last time?"

Vaani can retrieve relevant structured records and semantic memories.

---

## 5. Reminders

Vaani can manage scheduled reminders for things such as:

- Medication
- Appointments
- Follow-ups
- Health-related tasks

The backend uses a job/queue-based scheduling system to execute scheduled actions.

---

## 6. Proactive Check-ins

Vaani is designed to move beyond a request-response chatbot.

It can proactively interact with the user based on scheduled events and stored context.

For example:

> "You have a medication scheduled for 8 PM."

The goal is to make the assistant useful even when the user is not actively asking questions.

---

## 7. Push Notifications

Vaani supports browser push notifications using the Web Push ecosystem.

This enables reminders and other scheduled events to reach the user without requiring an active voice session.

---

## 8. Authentication

The backend supports authenticated users through:

- Access tokens
- Refresh tokens
- Email verification
- Google OAuth

Authentication is separated from the medical-memory system so that user identity and medical context can be managed independently.

---

# Architecture

```text
                         ┌─────────────────────┐
                         │      Vaani UI       │
                         │ React / Frontend    │
                         └──────────┬──────────┘
                                    │
                           WebSocket / HTTP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Node.js API     │
                         │      Express        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼──────────────────────┐
              │                     │                      │
              ▼                     ▼                      ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │   Primary   │       │    Redis    │       │   Qdrant    │
       │    Agent    │       │    Cache    │       │   Semantic   │
       └──────┬──────┘       └─────────────┘       │    Memory   │
              │                                     └─────────────┘
              │
              ▼
       ┌─────────────┐
       │   MongoDB   │
       │ Source of   │
       │    Truth    │
       └──────┬──────┘
              │
       ┌──────┼───────────────┐
       │      │               │
       ▼      ▼               ▼
   Medical  Prescriptions  Reminders
    Events

              ┌─────────────────────┐
              │      AI Layer      │
              │       Gemini       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │        Rime         │
              │        TTS          │
              └─────────────────────┘

                         │
                         ▼
              ┌─────────────────────┐
              │    Notifications    │
              │      Web Push       │
              └─────────────────────┘
```

---

# Tech Stack

## Frontend

- React
- Vite
- WebSocket
- Web Audio API
- Web Push API

The frontend captures microphone audio and communicates with the backend in real time.

## Backend

- Node.js
- Express.js
- WebSocket
- REST APIs

The backend coordinates authentication, AI agents, medical memory, reminders, notifications, and external services.

## AI

- Google Gemini
- AI agent/tool architecture
- Structured medical memory retrieval

Gemini handles conversational reasoning and interaction with Vaani's backend tools.

## Voice

### Speech Input

The frontend captures microphone audio and streams it to the backend.

### Text-to-Speech

Vaani uses **Rime** for voice output.

The architecture intentionally keeps TTS separate from the reasoning model so that the voice layer can be controlled independently.

## Databases

### MongoDB

MongoDB is Vaani's **source of truth**.

It stores structured application and medical data.

### Qdrant

Qdrant stores semantic representations of medical memories and enables similarity-based retrieval.

### Redis

Redis acts as the caching layer.

It is used to avoid repeatedly performing expensive operations when previously computed or frequently accessed data is available.

## Authentication

- JWT access tokens
- JWT refresh tokens
- Email verification
- Google OAuth

## File Storage

Cloudinary is used for media and image storage, including uploaded prescription images.

## Email

Mailjet is used for transactional email functionality such as email verification.

## Notifications

Browser push notifications use VAPID credentials and the Web Push ecosystem.

## Scheduling

Scheduled reminders are processed asynchronously through a queue-based architecture.

---

# Project Structure

A simplified representation of the project:

```text
vaani/
│
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   ├── memory/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── queue/
│   │   ├── tts/
│   │   └── websocket/
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

The exact directory structure may vary depending on the current branch.

---

# Prerequisites

Install the following before running Vaani:

- Node.js 18+
- npm
- MongoDB
- Redis
- Qdrant
- Git

You also need API credentials for the external services used by the project.

---

# Running MongoDB

If MongoDB is installed locally, start the MongoDB service.

On Linux:

```bash
sudo systemctl start mongod
```

Verify that MongoDB is running:

```bash
mongosh
```

The default local connection used by Vaani is:

```text
mongodb://localhost:27017
```

---

# Running Redis

Vaani expects Redis at:

```text
redis://localhost:6379
```

If Redis is installed locally:

```bash
redis-server
```

Verify the connection:

```bash
redis-cli ping
```

Expected response:

```text
PONG
```

---

# Running Qdrant

The easiest way to run Qdrant locally is Docker.

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Qdrant should then be available at:

```text
http://localhost:6333
```

---

# Backend Setup

Clone the repository:

```bash
git clone <repository-url>
cd vaani
```

Enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env-sample .env
```

On Windows PowerShell:

```powershell
Copy-Item .env-sample .env
```

Fill in the required credentials inside `.env`.

Start the development server:

```bash
npm run dev
```

If the project uses the standard Node start script instead:

```bash
npm start
```

The backend should be available on:

```text
http://localhost:3000
```

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env-sample .env
```

On Windows PowerShell:

```powershell
Copy-Item .env-sample .env
```

Add the VAPID public key:

```env
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key
```

Start the frontend:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

Use `.env-sample` as the template.

Required categories include:

| Variable                    | Purpose                          |
| --------------------------- | -------------------------------- |
| `PORT`                      | Backend server port              |
| `GEMINI_API_KEY`            | Gemini API access                |
| `QDRANT_URL`                | Qdrant server                    |
| `QDRANT_COLLECTION`         | Semantic memory collection       |
| `RIME_API_KEY`              | Rime TTS                         |
| `MONGODB_URI`               | MongoDB connection               |
| `MONGODB_DB`                | MongoDB database                 |
| `REDIS_URL`                 | Redis connection                 |
| `ACCESS_TOKEN_SECRET`       | JWT access token signing         |
| `REFRESH_TOKEN_SECRET`      | JWT refresh token signing        |
| `EMAIL_VERIFICATION_SECRET` | Email verification token signing |
| `EMAIL_HOST`                | SMTP host                        |
| `EMAIL_PORT`                | SMTP port                        |
| `EMAIL_USER`                | SMTP username                    |
| `EMAIL_PASS`                | SMTP password                    |
| `EMAIL_FROM`                | Sender email                     |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary account               |
| `CLOUDINARY_API_KEY`        | Cloudinary API                   |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret            |
| `GOOGLE_CLIENT_ID`          | Google OAuth                     |
| `GOOGLE_CLIENT_SECRET`      | Google OAuth                     |
| `GOOGLE_CALLBACK_URL`       | OAuth callback                   |
| `VAPID_PUBLIC_KEY`          | Push notification public key     |
| `VAPID_PRIVATE_KEY`         | Push notification private key    |
| `VAPID_SUBJECT`             | VAPID contact identifier         |

## Frontend

Create:

```text
frontend/.env
```

The frontend currently requires:

```env
VITE_VAPID_PUBLIC_KEY=your_public_vapid_key
```

Only variables prefixed with `VITE_` should be exposed to the frontend.

---

# Important Security Rule

Never commit:

```text
.env
```

to Git.

The repository should contain:

```text
.env-sample
```

but not the actual credentials.

Add the following to `.gitignore`:

```gitignore
.env
.env.*
!.env-sample
```

If credentials have already been committed to Git, rotating the credentials is not optional. Removing the file from the latest commit does not invalidate secrets that already exist in Git history.

---

# Running the Complete Stack

Start the infrastructure services first:

### MongoDB

```bash
mongod
```

### Redis

```bash
redis-server
```

### Qdrant

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Then start the backend:

```bash
cd backend
npm install
npm run dev
```

And in another terminal:

```bash
cd frontend
npm install
npm run dev
```

The resulting system is:

```text
Browser
   │
   ├── Microphone Audio
   │
   ▼
Frontend
   │
   │ WebSocket / HTTP
   ▼
Backend
   │
   ├── Gemini
   ├── Rime
   ├── MongoDB
   ├── Redis
   ├── Qdrant
   ├── Cloudinary
   ├── Mailjet
   ├── Google OAuth
   └── Web Push
```

---

# Data Architecture

Vaani deliberately separates different types of data instead of putting everything into a single database.

### MongoDB

**Authoritative structured state**

```text
Users
Medical Events
Prescriptions
Reminders
Push Subscriptions
Authentication Data
```

MongoDB is the source of truth.

### Qdrant

**Semantic memory**

```text
Medical memories
Conversation-derived medical context
Semantic embeddings
Retrieval metadata
```

Qdrant answers:

> "What stored information is semantically relevant to this conversation?"

### Redis

**Temporary acceleration layer**

```text
Frequently accessed data
Computed results
Short-lived state
Cacheable operations
```

Redis answers:

> "Can we serve this without doing the expensive operation again?"

This distinction is important:

```text
MongoDB = Truth
Qdrant   = Meaning
Redis    = Speed
```

---

# Memory Flow

A simplified memory flow looks like:

```text
User speaks
     │
     ▼
Voice Processing
     │
     ▼
AI Agent
     │
     ├───────────────┐
     │               │
     ▼               ▼
MongoDB          Qdrant
Structured       Semantic
Data             Memory
     │               │
     └───────┬───────┘
             ▼
          Context
             │
             ▼
          AI Response
             │
             ▼
           Rime
             │
             ▼
        Voice Output
```

Redis can sit in front of frequently accessed operations to reduce latency and database load.

---

# Design Principles

## Source of Truth First

Structured medical information should have an authoritative representation in MongoDB.

Vector databases should not become the authoritative storage mechanism for critical medical state.

## Semantic Retrieval

Not every piece of information needs to be retrieved for every conversation.

Qdrant allows Vaani to retrieve the memories that are semantically relevant to the current interaction.

## Cache, Don't Duplicate Truth

Redis is an optimization layer.

If Redis is cleared, Vaani should still be able to reconstruct its required state from the underlying databases.

## Voice First

Voice is not an additional interface layered on top of a chatbot.

It is a core interaction model.

## Persistent Context

The objective is to make Vaani increasingly useful over time by maintaining relevant user context instead of treating every conversation as independent.

---

# Development

Install dependencies after cloning:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run backend:

```bash
npm run dev
```

Run frontend:

```bash
npm run dev
```

Run Redis:

```bash
redis-server
```

Run Qdrant:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

---

# External Services

Vaani currently integrates with:

- Google Gemini for AI processing
- Rime for text-to-speech
- MongoDB for structured persistence
- Qdrant for semantic memory
- Redis for caching
- Cloudinary for media storage
- Mailjet for email delivery
- Google OAuth for authentication
- Web Push for notifications

Each service has a clearly defined role rather than being treated as a generic dependency.

---

# Current Direction

Vaani is being built toward a system that can maintain long-term health context while remaining responsive enough for real-time voice interaction.

The architecture is intentionally split into:

```text
Real-time interaction
        +
Structured medical state
        +
Semantic memory
        +
Caching
        +
Proactive scheduling
        +
Notifications
```

The long-term goal is not simply to build another medical chatbot.

It is to build a persistent, voice-first health companion that can understand the user's current context, remember relevant history, and take useful actions at the appropriate time.

---

# Disclaimer

Vaani is a software project and is not a replacement for a qualified medical professional.

Medical information generated by an AI system should not be treated as a definitive diagnosis or substitute for professional medical advice.

---

# License

```text
MIT License
```
