FROM denoland/deno:2.5.6

EXPOSE 8000
WORKDIR /app

# Switch to the non-root user 'deno'
# Prefer not to run as root.
RUN chown -R deno:deno /app
USER deno

# 1. Copy ONLY dependency files first
COPY --chown=deno:deno deno.json .
COPY --chown=deno:deno deno.lock .

# 2. Install dependencies
# In Deno 2, 'deno install' reads deno.json/lock and downloads everything.
# We do this BEFORE copying the source code so it's cached.
RUN deno install

# 3. Copy the rest of the source code
# Since this is after the install step, changing code won't trigger a re-download.
COPY . .

# 4. (Optional) Cache the entry point explicitly
# 'deno install' usually covers it, but if you have specific deep imports not in deno.json:
RUN deno cache src/main.ts

# 5. Start command
CMD ["task", "start"]