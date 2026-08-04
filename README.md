# AI-Powered Study Notes Management System (MERN Stack)

A streamlined, full-stack MERN application for managing study notes, subjects, AI summarization, AI flashcards, AI quizzes, and learning progress tracking. Designed for a 1-month MCA academic project.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Axios, Tailwind CSS, `@uiw/react-md-editor`, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- **AI Integration**: Google Gemini API (`@google/genai`)

---

## 📁 Monorepo Folder Structure

```
AI-Study-Notes/
├── client/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/          # Node.js + Express Backend
│   ├── src/
│   │   ├── config/  # DB connection
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
└── README.md
```

---

## 🚀 Running the Project

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
# Server starts at http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
# Client starts at http://localhost:5173
```

---

## 🔑 Key Features (Phase-by-Phase)

1. **Authentication**: Single JWT token strategy with bcrypt password hashing (Roles: `Student`, `Teacher`, `Admin`).
2. **Subject Management**: Subject CRUD (managed by Teachers & Admins).
3. **Notes Workspace**: Markdown note editor with tag support.
4. **AI Features**: AI Summaries, AI Flashcard Decks, and AI Quizzes powered by Google Gemini API.
5. **Learning Progress**: Quiz score history, completion stats, and performance charts.
