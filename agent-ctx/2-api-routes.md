# Task 2: API Routes

## Status: ✅ Completed

## Files Created

1. **`/src/app/api/courses/route.ts`** — GET list all courses with modules, supports `?userId=` query param to attach student progress per course.
2. **`/src/app/api/courses/[id]/route.ts`** — GET single course by ID with ordered modules.
3. **`/src/app/api/quiz/route.ts`** — GET returns 10 randomly shuffled questions with parsed JSON options; POST accepts `{userId, answers, duration}`, calculates score, checks pass (≥70%), creates QuizAttempt record.
4. **`/src/app/api/chat/route.ts`** — POST receives `{userId, message}`, resolves user, saves user message to ChatMessage, fetches last 20 messages for context, calls `LLM.chat` from `z-ai-web-dev-sdk` with French system prompt (ADSO AI Coach), saves assistant reply to ChatMessage, returns `{reply}`.
5. **`/src/app/api/analytics/route.ts`** — GET returns platform stats: totalUsers, totalCourses, totalQuizAttempts, totalQuestions, totalEnrollments, completedCourses, averageScore, passRate, difficulty/category distributions, recent attempts.
6. **`/src/app/api/leaderboard/route.ts`** — GET returns top quiz scores with `?limit=` param (default 10, max 50). Groups by userId, takes best score per user, fetches user names/avatars.

## Key Design Decisions
- All routes use `NextResponse.json()` for responses with proper error handling and French error messages.
- User resolution supports both email and ID lookup.
- Quiz route uses Fisher-Yates shuffle for random question selection.
- Chat route maintains conversation context (last 20 messages) for multi-turn dialogue.
- Leaderboard uses `groupBy` with `_max` to find each user's best score.
- ESLint passes cleanly with zero errors.
