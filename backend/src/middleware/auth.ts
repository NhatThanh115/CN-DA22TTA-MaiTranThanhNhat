import { Context, Next } from "@oak/oak";
import { verify } from "djwt";

// Use a stable secret key from environment variable
const secret = Deno.env.get("JWT_SECRET") || "your-super-secret-key-change-in-production";

// Create key for JWT signing/verification
export const jwtKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(secret),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"]
);

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      error: "Unauthorized: No token provided",
    };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, jwtKey);
    // Attach user information to context state for downstream use
    ctx.state.user = payload;
    await next();
  } catch (_error) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      error: "Unauthorized: Invalid token",
    };
  }
};
