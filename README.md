# 🧠 AI-Powered Study Notes Management System (MERN Stack)

A comprehensive, production-grade full-stack MERN application for managing academic study notes, subjects, and automated AI study aids. Features **Google Gemini API** integration for automated summarization, 3D interactive flashcard generation, AI quiz assessments with detailed explanations, learning progress tracking, and role-based access control (RBAC).

---

## 🌟 Key Features

### 1. 🔐 Authentication & RBAC (Role-Based Access Control)
- **Roles**: `Student`, `Teacher`, and `Admin`.
- **JWT Authentication**: Secure token-based authorization with `bcryptjs` password hashing.
- **Teacher Approval Workflow**:
  - Newly registered teachers have `isApproved: false` by default.
  - Teachers cannot log in until verified and approved by an `Admin`.
  - Admins have an approval management dashboard to approve or reject pending teacher accounts.
- **Admin Governance**:
  - Secure role initialization via backend API (`POST /api/v1/auth/signup` with `"role": "Admin"`).
  - Full management of academic subjects and teacher approvals.

### 2. 📚 Subject & Note Management
- **Subject Management**: Teachers and Admins can create and organize academic subjects with subject codes (e.g., `CS301 - Operating Systems`).
- **Markdown Notes Editor**: Full Markdown support using `@uiw/react-md-editor` with live preview, syntax highlighting, and tags.
- **Real-Time Search & Filtering**:
  - Instant live search by note title, content keywords, tags, or subject name.
  - Dropdown filter by academic subject with high-contrast dark theme styling.
  - Dynamic note counter and one-click search reset.

### 3. 🤖 AI-Powered Study Aids (Google Gemini)
- **AI Summary**: Generates concise, bulleted key takeaways, core concepts, and exam revision summaries from any note in one click.
- **Interactive 3D Flashcards**:
  - Generates study flashcards (Question & Answer) directly from note content.
  - 3D perspective flip card deck with keyboard shortcuts (<kbd>Space</kbd> to flip, <kbd>→</kbd> next, <kbd>←</kbd> previous).
  - Deck selector, card shuffle, and mastery tracking.
- **AI-Powered Quizzes**:
  - Generates multiple-choice quizzes (MCQs) with 4 options per question.
  - Timed or self-paced quiz runner with real-time score calculation.
  - Server-side grading with instant answer explanations for every question.

### 4. 📈 Learning Analytics & Progress Tracking
- **Quiz Score History**: Chronological log of all quiz attempts with timestamps, scores, and accuracy percentages.
- **Performance Tiers**: Dynamic proficiency tier badge (e.g., *Novice*, *Competent*, *Proficient*, *Master*).
- **Summary Metrics**: High-level KPI cards tracking total quizzes taken, average score, highest score, and total cards studied.

### 5. 🎨 Modern UI / UX Design
- **Figma-Aligned Left Vertical Sidebar**: Seamless navigation between Dashboard, Subjects, Study Notes, Flashcards, Quiz Runner, and Progress.
- **Aesthetic Dark Theme**: Clean `#0b0f17` palette with glassmorphism panels, subtle borders, and smooth micro-interactions.
- **Fully Responsive**: Mobile-friendly sidebar drawer and adaptive grid layouts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), React Router DOM v6, Axios, Tailwind CSS, `@uiw/react-md-editor`, Lucide React |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM |
| **AI Integration** | Google Gemini API (`@google/genai` using model `gemini-3.6-flash`) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS, Dotenv |

---

## 📁 Repository Structure

```
AI-Study-Notes/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Sidebar, Navbar, etc.)
│   │   ├── pages/              # Views (Dashboard, Notes, Flashcards, Quiz, Progress, Auth)
│   │   ├── services/           # Axios API services (auth, notes, subjects, ai, flashcards, quiz)
│   │   ├── styles/             # Global CSS and custom utility styles
│   │   ├── App.jsx             # Main router & layout structure
│   │   └── main.jsx            # React root entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Database connection (db.js)
│   │   ├── controllers/        # Route controllers (auth, note, subject, ai, flashcard, quiz, progress)
│   │   ├── middlewares/        # Auth verification & RBAC middlewares
│   │   ├── models/             # Mongoose schemas (User, Subject, Note, Flashcard, Quiz, Progress)
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # Gemini AI integration service
│   │   ├── app.js              # Express app setup & middleware mounting
│   │   └── server.js           # HTTP server bootstrap
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: Local MongoDB instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI.
- **Google Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).

---

### 1. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/ai-study-notes
   JWT_SECRET=your_super_secret_jwt_key_here
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Ensure the API URL points to the backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The client will run on `http://localhost:5173`.

---

## 📬 API Reference (`/api/v1`)

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user (`Student`, `Teacher`, `Admin`) | Public |
| `POST` | `/signin` | Authenticate user & issue JWT | Public |
| `GET` | `/me` | Get current authenticated user profile | Private |
| `GET` | `/check-admin` | Verify admin authorization | Admin |
| `GET` | `/pending-teachers` | List teacher accounts awaiting approval | Admin |
| `PATCH` | `/teachers/:id/approve` | Approve a pending teacher | Admin |
| `DELETE` | `/teachers/:id/reject` | Reject/delete a teacher registration | Admin |

### Subjects (`/api/v1/subjects`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all academic subjects | Authenticated |
| `POST` | `/` | Create a new subject | Teacher / Admin |
| `PUT` | `/:id` | Update a subject | Teacher / Admin |
| `DELETE`| `/:id` | Delete a subject | Teacher / Admin |

### Notes (`/api/v1/notes`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all notes (supports `?subjectId=...` filter) | Authenticated |
| `GET` | `/:id` | Get note by ID | Authenticated |
| `POST` | `/` | Create a new study note | Authenticated |
| `PUT` | `/:id` | Update an existing note | Author |
| `DELETE`| `/:id` | Delete a note | Author |

### AI Study Aids (`/api/v1/ai`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/summarize/:noteId` | Generate AI summary from note content | Authenticated |
| `POST` | `/flashcards/:noteId` | Generate flashcards and save deck | Authenticated |
| `POST` | `/quiz/:noteId` | Generate multiple-choice quiz questions | Authenticated |

### Flashcards & Quizzes (`/api/v1/flashcards`, `/api/v1/quizzes`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/flashcards` | Get all user flashcard decks | Authenticated |
| `GET` | `/flashcards/:noteId` | Get flashcard deck for specific note | Authenticated |
| `GET` | `/quizzes` | Get all user quiz assessments | Authenticated |
| `GET` | `/quizzes/:noteId` | Get quiz for specific note | Authenticated |

### Learning Progress (`/api/v1/progress`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/progress/summary` | Get aggregated study metrics (cards, scores) | Authenticated |
| `GET` | `/progress/history` | Get chronological quiz attempt history | Authenticated |
| `POST` | `/progress/quiz-result` | Record completed quiz score & update metrics | Authenticated |

---

## 🧪 Postman Setup Guide

### 1. Creating the First Admin Account
To create an initial Admin account without exposing Admin registration on the public frontend:
- **URL**: `POST http://localhost:5000/api/v1/auth/signup`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "System Administrator",
    "email": "admin@studyai.edu",
    "password": "AdminPassword123!",
    "role": "Admin"
  }
  ```

### 2. Teacher Registration & Approval Flow
1. Teachers register via frontend or Postman (`"role": "Teacher"`).
2. Status will be `isApproved: false`. If they try to log in, they receive:
   `"Your teacher account is pending administrator approval."`
3. Log in as **Admin** in the web dashboard.
4. Navigate to the **Dashboard** to see the **Pending Teacher Approvals** widget.
5. Click **Approve** to enable the teacher account immediately.

---

## ⌨️ Keyboard Shortcuts (Flashcard Runner)

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Flip current flashcard (Question ⇄ Answer) |
| <kbd>→</kbd> (Right Arrow) | Advance to next flashcard |
| <kbd>←</kbd> (Left Arrow) | Return to previous flashcard |

---

## 📄 License

This project is developed for academic learning and educational purposes under the **MIT License**.
