# Gamified Life

A gamified productivity platform inspired by Solo Leveling.

## Project Overview

This repository contains a full-stack web application built with:

- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion, Zustand, React Router DOM, Axios
- **Backend:** Node.js + Express, Prisma ORM, PostgreSQL, JWT auth, bcryptjs
- **Architecture:**
  - `frontend/` contains the single-page application UI
  - `backend/` contains the REST API, authentication, and Prisma data models

The app is designed to help users manage quests, dungeons, shadows, and rewards with a game-like progression system.

## Key Features

- JWT-based authentication and protected routes
- Quest management with daily and recurring activities
- Dungeon creation, progress tracking, and task completion
- Shadow habit tracking with streaks and awakening rewards
- In-app shop for purchasing rewards with earned coins
- Hunter profile, leaderboard, and XP/rank progression

## Repository Structure

```
Gamified_Life/
  frontend/      # React + Vite application
  backend/       # Express API with Prisma and PostgreSQL
  README.md      # Project overview and setup
```

## Frontend Setup

1. Open a terminal at `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Backend Setup

1. Open a terminal at `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and update values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/solo_leveling"
   JWT_SECRET="replace-with-a-secure-secret"
   PORT=4000
   ```
4. Run Prisma migrations and generate client:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

## Environment Variables

The backend expects the following variables in `backend/.env`:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret key for signing JWT tokens
- `PORT` — backend server port (default `4000`)

## Available API Routes

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — authenticate and receive JWT token
- `GET /api/auth/me` — current user profile
- `GET /api/hunter/status` — hunter profile and stats
- `PUT /api/hunter/allocate-stats` — allocate stat points
- `GET /api/hunter/leaderboard` — ranking overview
- `GET /api/quests` — list quests
- `POST /api/quests` — create a quest
- `PUT /api/quests/:id` — update a quest
- `DELETE /api/quests/:id` — delete a quest
- `POST /api/quests/:id/complete` — complete a quest
- `POST /api/quests/:id/fail` — fail a quest
- `GET /api/quests/daily` — list daily quests
- `POST /api/quests/generate-daily` — generate daily quests
- `GET /api/dungeons` — list dungeons
- `POST /api/dungeons` — create a dungeon
- `GET /api/dungeons/:id` — view dungeon details
- `PUT /api/dungeons/:id` — update a dungeon
- `POST /api/dungeons/:id/tasks` — add a dungeon task
- `PUT /api/dungeons/:id/tasks/:taskId/complete` — complete a dungeon task
- `POST /api/dungeons/:id/clear` — clear a dungeon
- `GET /api/shadows` — list shadow habits
- `POST /api/shadows` — create a shadow habit
- `POST /api/shadows/:id/checkin` — check in a shadow habit
- `GET /api/shop` — list shop items
- `POST /api/shop` — create a shop item
- `POST /api/shop/:id/buy` — buy a shop item

## Notes

- The frontend is configured to talk to `http://localhost:4000/api` by default.
- Authentication token is stored in `localStorage.token`.
- If you change the backend port, update `VITE_API_URL` in the frontend environment configuration.

## Future Improvements

- Add persistent user settings and theme preferences
- Improve UI/UX for dungeon and shadow flows
- Add notifications and rewards history
- Add tests for frontend and backend routes

---

Built for a gamified productivity experience with a Solo Leveling theme.
