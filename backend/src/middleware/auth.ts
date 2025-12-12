import { Context, Next } from "@oak/oak";
import { verify } from "djwt";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

// Export key for signing tokens in controller
export const jwtKey = key;

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
    const payload = await verify(token, key);
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
