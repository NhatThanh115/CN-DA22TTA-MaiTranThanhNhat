import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import {
  completeLesson,
  getUserProgress,
  getUserStats,
  getUserStreak,
  startLesson,
  submitExercise,
  submitQuiz,
} from "../controllers/progressController.ts";

const router = new Router();

// Start a lesson
// Start a lesson
router.post("/api/progress/lesson/start", authMiddleware, async (context) => {
  try {
    const body = await context.request.body.json();
    const user = context.state.user as { id: string };
    const result = await startLesson({ ...body, user_id: user.id });
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Complete a lesson
router.post("/api/progress/lesson/complete", authMiddleware, async (context) => {
  try {
    const body = await context.request.body.json();
    const user = context.state.user as { id: string };
    const result = await completeLesson({ ...body, user_id: user.id });
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Submit exercise attempt
router.post("/api/progress/exercise/submit", authMiddleware, async (context) => {
  try {
    const body = await context.request.body.json();
    const user = context.state.user as { id: string };
    const result = await submitExercise({ ...body, user_id: user.id });
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Submit quiz results
router.post("/api/progress/quiz/submit", authMiddleware, async (context) => {
  try {
    const body = await context.request.body.json();
    const user = context.state.user as { id: string };
    const result = await submitQuiz({ ...body, user_id: user.id });
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Get user progress
router.get("/api/progress/:userId", authMiddleware, async (context) => {
  try {
    // Enforce getting progress only for the authenticated user or allow admin (future scope)
    // For now, let's allow getting own progress
    const user = context.state.user as { id: string };
    const _requestedUserId = context.params.userId;
    
    // Optional: Add check if user.id === requestedUserId logic here if strictly enforcing privacy
    // But for now, we will trust the route param matches the intent, or we can just override it.
    // Let's rely on the token ID to be safe.
    
    const courseId = context.request.url.searchParams.get("courseId") || undefined;
    const result = await getUserProgress(user.id, courseId);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Get user stats
router.get("/api/progress/:userId/stats", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { id: string };
    const result = await getUserStats(user.id);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Get user streak
router.get("/api/progress/:userId/streak", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { id: string };
    const result = await getUserStreak(user.id);
    context.response.status = result.success ? 200 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

export default router;
