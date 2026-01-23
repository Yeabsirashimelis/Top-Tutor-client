# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Top Tutor (እንማር)** - An online learning platform built with Next.js 15 (App Router). This is the client application that connects to a separate backend API.

## Commands

```bash
npm run dev      # Start dev server with Turbopack (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **State Management**: TanStack React Query for server state, Zustand for client state
- **Authentication**: NextAuth.js with Google OAuth provider
- **Database**: MongoDB via Mongoose (for auth user sync only - main data comes from backend API)
- **UI**: Tailwind CSS 4, shadcn/ui (new-york style), Radix UI primitives, Lucide icons
- **File Uploads**: UploadThing
- **Video**: HLS.js for video streaming

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - React components organized by feature (home, courses, gamification, video-player, etc.)
- `components/ui/` - shadcn/ui base components
- `hooks/` - TanStack Query hooks for API calls (one file per domain: courses, gamification, payments, etc.)
- `providers/` - React context providers (Auth, Query, ProtectedRoute)
- `types/` - TypeScript type definitions
- `lib/` - Utilities (`cn()` for className merging, MongoDB connection, toast helpers)
- `utils/` - Auth options and helpers

### Data Flow Pattern
1. API calls are made to `NEXT_PUBLIC_BACKEND_LINK` using `@better-fetch/fetch`
2. Each domain has a hooks file (e.g., `hooks/course-hooks.tsx`) exporting React Query hooks
3. Components use hooks like `useGetCourses()`, `useGetCourse(id)` for data fetching
4. Query keys follow pattern: `["entity"]` or `["entity", id]`

### Authentication Flow
- Google OAuth via NextAuth.js
- User synced to local MongoDB on first sign-in (`utils/authOptions.ts`)
- Session extended with `user.id`, `user.username`, `user.isProfileComplete`
- `<ProtectedRoute>` wrapper handles route protection

### Core Domain Types (from `types/types.ts`)
- `Course` - Contains sections, lectures, quizzes, instructor info
- `Section` - Groups lectures, has order and duration
- `Lecture` - Video content with resources
- `Quiz` - Section-level quizzes with questions and options

### Gamification System
- XP points, levels, badges, daily streaks, leaderboards
- Components in `components/gamification/`
- Hooks in `hooks/gamification-hooks.tsx`, `hooks/daily-challenges-hooks.tsx`
- Points awarded for lecture completion, quiz passes, course completion

## Environment Variables

Required in `.env`:
- `MONGODB_URI` - MongoDB connection string (for auth user sync)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `NEXT_PUBLIC_BACKEND_LINK` - Backend API URL
- `UPLOADTHING_TOKEN` - UploadThing API token

## Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`)

```typescript
import { cn } from "@/lib/utils"
import { useGetCourse } from "@/hooks/course-hooks"
```
