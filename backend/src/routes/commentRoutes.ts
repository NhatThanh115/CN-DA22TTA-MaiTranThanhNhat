import { Router } from "@oak/oak";
import { authMiddleware } from "../middleware/auth.ts";
import {
  addComment,
  deleteComment,
  getCommentsByLesson,
  toggleLikeComment,
} from "../controllers/commentController.ts";

const router = new Router();

// Get comments for a lesson (public, but includes user's like status if authenticated)
router.get("/api/comments/:lessonId", async (context) => {
  try {
    const lessonId = context.params.lessonId;
    
    // Try to get user from auth header if present
    let userId: string | undefined;
    const authHeader = context.request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        // Import jwt verification
        const { verify } = await import("djwt");
        const token = authHeader.substring(7);
        const key = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(Deno.env.get("JWT_SECRET") || "your-super-secret-key-change-in-production"),
          { name: "HMAC", hash: "SHA-512" },
          false,
          ["verify"]
        );
        const payload = await verify(token, key) as { id: string };
        userId = payload.id;
      } catch {
        // Token invalid or expired, continue without user
      }
    }
    
    const result = await getCommentsByLesson(lessonId, userId);
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

// Add a comment (requires authentication)
router.post("/api/comments", authMiddleware, async (context) => {
  try {
    const body = await context.request.body.json();
    const user = context.state.user as { id: string };
    
    if (!body.lesson_id || !body.content) {
      context.response.status = 400;
      context.response.body = {
        success: false,
        error: "lesson_id and content are required",
      };
      return;
    }
    
    const result = await addComment({
      user_id: user.id,
      lesson_id: body.lesson_id,
      content: body.content,
    });
    
    context.response.status = result.success ? 201 : 400;
    context.response.body = result;
  } catch (error) {
    context.response.status = 500;
    context.response.body = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

// Like/unlike a comment (requires authentication)
router.post("/api/comments/:commentId/like", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { id: string };
    const commentId = context.params.commentId;
    
    const result = await toggleLikeComment({
      user_id: user.id,
      comment_id: commentId,
    });
    
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

// Delete a comment (requires authentication, only owner can delete)
router.delete("/api/comments/:commentId", authMiddleware, async (context) => {
  try {
    const user = context.state.user as { id: string };
    const commentId = context.params.commentId;
    
    const result = await deleteComment(user.id, commentId);
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
