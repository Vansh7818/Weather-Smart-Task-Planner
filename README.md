# Weather SmartPlanner AI

A production-grade, AI-powered intelligent weather and planning platform designed to help users make smart decisions based on real-time weather data. Built specifically with modern enterprise SaaS aesthetics.

## Overview
Weather SmartPlanner AI helps users optimize their travel, events, study schedules, and outdoor activities using real-time weather data and AI predictive analytics.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Backend:** Next.js Server Actions & API Routes, Prisma ORM
- **Database:** SQLite (Development) -> PostgreSQL (Production)
- **AI Engine:** Gemini API (or OpenAI)

## Project Structure
```text
/src
  /app           # Next.js App Router (Pages & API routes)
  /components
    /layout      # Navbar, Sidebar, etc.
    /ui          # Shadcn components
  /lib           # Utils, Prisma client, AI configuration
/prisma          # Prisma schema and SQLite dev database
```

## Setup Instructions
1. Install dependencies: `npm install`
2. Sync the database: `npx prisma db push`
3. Generate Prisma client: `npx prisma generate`
4. Run development server: `npm run dev`
5. (Optional) Add your AI API keys to `.env`.

## Features Implemented
- **AI Smart Dashboard:** Shows temperature, humidity, precipitation, and AI recommendations.
- **Smart Planner:** UI for generating AI-based itineraries.
- **Modern UI/UX:** Dark mode enabled by default, glassmorphism, responsive navigation.
- **Database Schema:** Users, Locations, Plans, and WeatherAlerts structured via Prisma.

## Next Steps
- Integrate real-time weather API (e.g. OpenWeatherMap).
- Connect the frontend to actual Gemini AI prompt generation.
- Implement Clerk/Auth.js for user authentication.
- Deploy to Vercel and Supabase/Neon for production.
