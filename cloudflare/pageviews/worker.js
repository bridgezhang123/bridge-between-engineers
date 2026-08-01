const ENDPOINT_PATH = "/api/pageview";
const MAX_PATH_LENGTH = 240;

const BOT_USER_AGENT =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|linkedinbot|preview/i;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function normalizePath(input) {
  if (!input || typeof input !== "string") return null;

  let pathname = input.trim();

  try {
    pathname = new URL(pathname, "https://www.bridgezhang.com").pathname;
  } catch {
    return null;
  }

  pathname = pathname.replace(/\/{2,}/g, "/");

  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  if (pathname.length > 1 && pathname.endsWith("index.html")) {
    pathname = pathname.slice(0, -"index.html".length);
  }

  return pathname.length <= MAX_PATH_LENGTH ? pathname : null;
}

async function getPathFromRequest(request) {
  const url = new URL(request.url);

  if (request.method === "GET") {
    return normalizePath(url.searchParams.get("path"));
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  try {
    const body = await request.json();
    return normalizePath(body.path);
  } catch {
    return null;
  }
}

async function readViews(db, path) {
  const row = await db
    .prepare("SELECT views FROM page_views WHERE path = ?1")
    .bind(path)
    .first();

  return row ? Number(row.views) : 0;
}

async function incrementViews(db, path) {
  const row = await db
    .prepare(
      `INSERT INTO page_views (path, views, updated_at)
       VALUES (?1, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(path) DO UPDATE SET
         views = views + 1,
         updated_at = CURRENT_TIMESTAMP
       RETURNING views`
    )
    .bind(path)
    .first();

  return Number(row.views);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true });
    }

    if (url.pathname !== ENDPOINT_PATH) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    if (!env.DB) {
      return jsonResponse({ error: "D1 binding DB is not configured" }, 500);
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const path = await getPathFromRequest(request);
    if (!path) {
      return jsonResponse({ error: "Invalid path" }, 400);
    }

    const userAgent = request.headers.get("user-agent") || "";
    const shouldCount = request.method === "POST" && !BOT_USER_AGENT.test(userAgent);
    const views = shouldCount ? await incrementViews(env.DB, path) : await readViews(env.DB, path);

    return jsonResponse({ path, views, counted: shouldCount });
  },
};

