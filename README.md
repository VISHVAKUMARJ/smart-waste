# Smart Waste & Recycling Tracker

A full-stack web application designed for the "Tech for Better Tomorrow" hackathon.

## Features
- **Household Dashboard**: Log daily waste, view historical logs, and receive intelligent recycling tips based on the latest waste entry.
- **Admin Dashboard**: Visualize community waste data via charts (Recharts) and identify flagged zones generating unusually high amounts of waste.
- **Leaderboard**: Compete with neighbors to produce the least amount of waste and earn top spots on the leaderboard.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, Axios, Recharts, React Router
- **Backend**: Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Database**: PostgreSQL

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Java 17
- Maven
- PostgreSQL running locally (default port 5432)

### Database Setup
1. Create a PostgreSQL database named `smartwaste`:
   ```sql
   CREATE DATABASE smartwaste;
   ```
2. The application will automatically create the required tables and seed them with initial data on startup.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. The backend connects to PostgreSQL using default credentials (`postgres`/`postgres`). You can override them via environment variables if needed.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Or run it from your IDE)*. The backend will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application at `http://localhost:5173`.

---

## Deployment Guide

### Backend & Database (Railway)
1. Push your code to a GitHub repository.
2. Go to [Railway](https://railway.app/) and create a new project.
3. Add a **PostgreSQL** database service to your project.
4. Add a new service from your GitHub repository. Select the `backend` folder as your root directory (if Railway allows folder-specific deployment, otherwise ensure your repo structure is clean or deploy via Dockerfile).
5. In your Backend service settings, define the following Environment Variables:
   - `DATABASE_URL`: (Railway provides this, ensure it's in the standard JDBC format or map it manually)
   - `DATABASE_USER`: (Railway Postgres username)
   - `DATABASE_PASSWORD`: (Railway Postgres password)
   - `PORT`: `8080`
6. Railway will automatically detect the `Dockerfile` inside the `backend` folder and build the Java application.

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Import your GitHub repository.
3. Set the **Framework Preset** to Vite.
4. Set the **Root Directory** to `frontend`.
5. Under Environment Variables, add:
   - `VITE_API_URL`: Set this to your deployed Railway backend URL (e.g., `https://your-backend.up.railway.app/api`)
6. Click Deploy.

---

## Testing the App (Local Seed Data)
When the backend starts for the first time, it automatically seeds the database. You can log in with:
- **Admin**: `admin@smartwaste.com` / `admin123`
- **Household**: `john@example.com` / `password`
