import { oakCors } from "cors";

// CORS configuration
export const corsMiddleware = oakCors({
  origin: "*", // Change this to your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
