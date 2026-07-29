# 🚀 Runway Job Application Tracker — Deployment Guide

This guide provides step-by-step instructions for deploying your **Runway** full-stack web application to production.

---

## 🏗️ Architecture Overview

| Component | Technology | Recommended Hosting |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS | **Vercel** / **Netlify** / **Firebase App Hosting** |
| **Backend API** | FastAPI (Python 3.11+), SQLModel, Uvicorn | **Render** / **Railway** / **GCP Cloud Run** |
| **Database** | PostgreSQL | **Supabase** / **Neon** / **Render Postgres** / **GCP Cloud SQL** |

---

## 1. ⚙️ Backend Deployment (FastAPI + PostgreSQL)

### Option A: Render.com (Recommended & Easiest)

1. Push your project code to **GitHub** or **GitLab**.
2. Log into [Render.com](https://render.com).
3. Click **New +** -> **Web Service**.
4. Connect your repository and choose the `backend` directory.
5. Configure the service settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables**:
   - `DATABASE_URL`: `postgresql://username:password@hostname:5432/dbname` (Your PostgreSQL URI)
   - `SECRET_KEY`: A random secure string (e.g. `runway_prod_secret_998877`)
7. Click **Create Web Service**. Render will build and launch your backend API at a public URL (e.g. `https://runway-api.onrender.com`).

---

## 2. 🎨 Frontend Deployment (Next.js 14)

### Option A: Vercel (Official Next.js Creator)

1. Log into [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `frontend`.
5. Add **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-api-url.onrender.com/api/v1` (The public URL of your deployed FastAPI backend).
6. Click **Deploy**. Vercel will automatically build and publish your app to a custom `.vercel.app` URL!

---

## 🔐 Production Environment Variables Checklist

### Backend (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@db-host:5432/runway
SECRET_KEY=a_very_long_and_random_secret_string_for_jwt
```

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.onrender.com/api/v1
```

---

## ✅ Deployment Verification Checklist

- [x] Backend database tables (`users`, `job_applications`, `activity_logs`) are created via `SQLModel.metadata.create_all(engine)`.
- [x] Next.js frontend builds cleanly (`✓ Compiled successfully`).
- [x] Pilot authentication endpoints (`/api/v1/auth/register` and `/api/v1/auth/login`) verified live.
- [x] CORS middleware configured to accept incoming web traffic from your production frontend URL.
