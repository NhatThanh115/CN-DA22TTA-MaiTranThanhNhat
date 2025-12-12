import type { Context, Next } from "@oak/oak";

// Request logger middleware
export async function loggerMiddleware(ctx: Context, next: Next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  console.log(
    `${ctx.request.method} ${ctx.request.url.pathname} - ${ctx.response.status} - ${ms}ms`,
  );
}
