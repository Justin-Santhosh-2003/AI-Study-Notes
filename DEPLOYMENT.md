# 🚀 Production Deployment Guide

This guide walks you through deploying the **AI-Powered Study Notes Management System** for free using the recommended modern stack:
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free M0 Cluster)
- **Backend API**: [Render](https://render.com) (Free Web Service) or [Railway](https://railway.app)
- **Frontend SPA**: [Vercel](https://vercel.com) (Free Hosting) or [Netlify](https://netlify.com)

---

## 📋 Step 1: Set Up MongoDB Atlas (Cloud Database)

Since local `mongodb://127.0.0.1:27017` is only accessible on your computer, you need a cloud MongoDB database:

1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and sign in / create a free account.
2. Click **Create Deployment** → Select the **M0 Free** shared cluster.
3. Choose a cloud provider and region close to your users (e.g., AWS / Mumbai or N. Virginia) and click **Create**.
4. **Security Setup**:
   - **Database Access**: Under *Security* → *Database Access*, create a database user (e.g., username `appuser` and a strong password). Make sure the role is `Read and write to any database`.
   - **Network Access**: Under *Security* → *Network Access*, click **Add IP Address** → choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your Render/Railway backend can connect.
5. **Get Connection String**:
   - Go to *Database* → click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ai-study-notes?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the database credentials you created.

---

## 🖥️ Step 2: Deploy Backend to Render

1. Sign in to **[render.com](https://render.com)** with your GitHub account.
2. In the Render Dashboard, click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your repo: `AI-Study-Notes`.
4. Configure the Web Service settings:
   - **Name**: `ai-study-notes-api` (or any unique name)
   - **Region**: Closest to your database region (e.g., Singapore or Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: `server` ⚠️ *(Crucial since this is a monorepo)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add the following keys:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | *Your MongoDB Atlas connection string from Step 1* |
   | `JWT_SECRET` | *Any strong random secret key (e.g., `SuperSecureJwtSecret_2026_xYz`)* |
   | `GEMINI_API_KEY` | *Your Google Gemini API key* |
6. Click **Create Web Service**.
7. Wait 2–3 minutes for the build to finish. Once live, Render will give you a public URL, for example:
   ```
   https://ai-study-notes-api.onrender.com
   ```
8. **Test backend health**: Open `https://ai-study-notes-api.onrender.com/api/v1/health` in your browser. You should see:
   ```json
   {
     "status": "success",
     "message": "AI Study Notes API Server is running smoothly"
   }
   ```

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Sign in to **[vercel.com](https://vercel.com)** with your GitHub account.
2. Click **Add New...** → **Project**.
3. Select and import your GitHub repository: `AI-Study-Notes`.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`** ⚠️ *(Crucial)*
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Under **Environment Variables**, add:
   | Name | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://ai-study-notes-api.onrender.com/api/v1` *(your Render backend URL + `/api/v1`)* |
6. Click **Deploy**.
7. In ~1 minute, your client will be live with a URL like:
   ```
   https://ai-study-notes.vercel.app
   ```

*(Note: The repository already includes `client/vercel.json` and `client/public/_redirects` to ensure SPA page refreshes like `/notes` or `/flashcards` work without 404 errors).*

---

## 🔑 Step 4: First-Time Setup on Production

1. **Create the Admin Account**:
   Send a `POST` request to your live backend via Postman or Curl:
   - **URL**: `https://ai-study-notes-api.onrender.com/api/v1/auth/signup`
   - **Body** (JSON):
     ```json
     {
       "name": "Production Admin",
       "email": "admin@studyai.edu",
       "password": "StrongAdminPassword123!",
       "role": "Admin"
     }
     ```
2. **Access the Web App**:
   - Open your Vercel URL (`https://ai-study-notes.vercel.app`).
   - Log in with your Admin account.
   - Go to **Subjects** to create academic subjects.
   - Now Students and Teachers can register and begin using the platform!

---

## ⚡ Troubleshooting & Tips

- **Free Tier Cold Starts**: Render's free tier spins down after 15 minutes of inactivity. The first request after sleep may take ~30–50 seconds to boot up.
- **CORS Errors**: The backend has `app.use(cors())` enabled, allowing requests from your Vercel frontend out of the box.
- **Gemini API Errors**: Make sure your Google AI Studio API key has quota and access to `gemini-3.6-flash`.
