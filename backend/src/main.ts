import { Application } from "@oak/oak";
import { corsMiddleware } from "./middleware/cors.ts";
import { loggerMiddleware } from "./middleware/logger.ts";
import progressRoutes from "./routes/progressRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";

const app = new Application();
const PORT = parseInt(Deno.env.get("PORT") || "8000");

// Middleware
app.use(corsMiddleware);
app.use(loggerMiddleware);

// Routes
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());
app.use(progressRoutes.routes());
app.use(progressRoutes.allowedMethods());
app.use(commentRoutes.routes());
app.use(commentRoutes.allowedMethods());

// Health check endpoint
app.use((ctx) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.body = {
      success: true,
      message: "TVEnglish API is running",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      success: false,
      error: "Route not found",
    };
  }
});

// Error handling
app.addEventListener("error", (evt) => {
  console.error("Application error:", evt.error);
});

console.log(`🚀 Server is running on http://localhost:${PORT}`);
console.log(`📚 TVEnglish API v1.0.0`);
console.log(`\nAvailable endpoints:`);
console.log(`  POST   /api/users/register`);
console.log(`  POST   /api/users/login`);
console.log(`  GET    /api/users/:userId`);
console.log(`  PUT    /api/users/:userId`);
console.log(`  POST   /api/progress/lesson/start`);
console.log(`  POST   /api/progress/lesson/complete`);
console.log(`  POST   /api/progress/exercise/submit`);
console.log(`  POST   /api/progress/quiz/submit`);
console.log(`  GET    /api/progress/:userId`);
console.log(`  GET    /api/progress/:userId/stats`);
console.log(`  GET    /api/progress/:userId/streak`);
console.log(`  GET    /api/comments/:lessonId`);
console.log(`  POST   /api/comments`);
console.log(`  POST   /api/comments/:commentId/like`);
console.log(`  DELETE /api/comments/:commentId\n`);

await app.listen({ port: PORT });

