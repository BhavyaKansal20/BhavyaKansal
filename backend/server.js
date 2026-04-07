import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8787);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN }));
app.use(express.json());

const cache = {
  github: new Map(),
  google: null,
};

const CACHE_TTL_MS = 60_000;

const normalizeContributions = (payload) => {
  const raw = Array.isArray(payload?.contributions)
    ? (Array.isArray(payload.contributions[0]) ? payload.contributions.flat() : payload.contributions)
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return raw
    .map((entry) => ({
      date: entry.date || "",
      count: Number(entry.count ?? entry.contributionCount ?? 0),
    }))
    .filter((entry) => Boolean(entry.date));
};

const parseGoogleProfile = (raw) => {
  const lines = raw.split("\n").map((line) => line.trim());

  const nextNonEmpty = (start) => {
    for (let index = start; index < lines.length; index += 1) {
      if (lines[index]) return lines[index];
    }
    return "";
  };

  const iconRegex = /^!\[Image\s+\d+\]\((https:\/\/developers\.google\.com\/static\/profile\/badges\/[^)]+)\)$/;
  const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/;

  const headlineLine = lines.find((line) => line.includes("Student at") || line.includes("Developer")) || "";
  const cityIndex = lines.findIndex((line) => line.includes("City/Town") || line.includes("Location"));
  const expIndex = lines.findIndex((line) => line.includes("Experience"));
  const favStart = lines.findIndex((line) => line.includes("Favorite badges"));
  const badgesStart = lines.findIndex((line) => line.includes("### Badges") || line.includes("All badges"));

  const parseBadgesBetween = (startIdx, endIdx) => {
    if (startIdx < 0) return [];
    const badges = [];

    for (let index = startIdx; index < endIdx && index < lines.length; index += 1) {
      const iconMatch = lines[index].match(iconRegex);
      if (!iconMatch) continue;

      const icon = iconMatch[1];
      const name = nextNonEmpty(index + 1);
      const maybeDate = nextNonEmpty(index + 2);
      const date = dateRegex.test(maybeDate) ? maybeDate : "";

      if (name && icon) badges.push({ name, icon, date });
    }

    return badges;
  };

  const favoriteBadges = parseBadgesBetween(favStart, badgesStart > -1 ? badgesStart : lines.length);
  const allBadgesRaw = badgesStart > -1 ? parseBadgesBetween(badgesStart, lines.length) : [];
  const deduped = new Map();

  [...favoriteBadges, ...allBadgesRaw].forEach((badge) => {
    if (!deduped.has(badge.name)) deduped.set(badge.name, badge);
  });

  const allBadges = Array.from(deduped.values());
  const currentYear = new Date().getFullYear();
  const activeThisYear = allBadges
    .filter((badge) => Boolean(badge.date))
    .filter((badge) => {
      const parsed = Date.parse(badge.date);
      return !Number.isNaN(parsed) && new Date(parsed).getFullYear() === currentYear;
    }).length;

  return {
    headline: headlineLine.replace(/^#+\s*/, "") || "Google Developer Program Member",
    location: cityIndex > -1 ? nextNonEmpty(cityIndex + 1) : "Patiala, Punjab, India",
    experience: expIndex > -1 ? nextNonEmpty(expIndex + 1) : "Early Career (0 - 5 years)",
    totalBadges: allBadges.length,
    favoriteBadges: favoriteBadges.slice(0, 10),
    activeThisYear,
    fetchedAt: new Date().toISOString(),
  };
};

const fetchGitHubViaGraphql = async (username) => {
  if (!GITHUB_TOKEN) return [];

  const query = `
    query($userName:String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { userName: username } }),
  });

  if (!response.ok) return [];
  const json = await response.json();
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

  return weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: Number(day.contributionCount || 0),
    }))
  );
};

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "bhavya-live-api", time: new Date().toISOString() });
});

app.get("/api/github-contributions", async (req, res) => {
  const user = String(req.query.user || "BhavyaKansal20");
  const cached = cache.github.get(user);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({ contributions: cached.data, source: cached.source, cached: true });
  }

  try {
    const tokenData = await fetchGitHubViaGraphql(user);
    if (tokenData.length > 0) {
      cache.github.set(user, { data: tokenData, timestamp: Date.now(), source: "github-graphql" });
      return res.json({ contributions: tokenData, source: "github-graphql", cached: false });
    }

    const sources = [
      `https://github-contributions.vercel.app/api/v1/${user}`,
      `https://github-contributions-api.deno.dev/${user}.json`,
    ];

    for (const source of sources) {
      try {
        const response = await fetch(`${source}?ts=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) continue;
        const json = await response.json();
        const normalized = normalizeContributions(json);

        if (normalized.length > 0) {
          cache.github.set(user, { data: normalized, timestamp: Date.now(), source });
          return res.json({ contributions: normalized, source, cached: false });
        }
      } catch {
        // Try next source
      }
    }

    if (cached?.data?.length) {
      return res.json({ contributions: cached.data, source: cached.source, cached: true, stale: true });
    }

    return res.status(502).json({ contributions: [], error: "No live GitHub source available" });
  } catch (error) {
    if (cached?.data?.length) {
      return res.json({ contributions: cached.data, source: cached.source, cached: true, stale: true });
    }
    return res.status(500).json({ contributions: [], error: String(error) });
  }
});

app.get("/api/google-profile", async (_, res) => {
  if (cache.google && Date.now() - cache.google.timestamp < CACHE_TTL_MS) {
    return res.json({ ...cache.google.data, cached: true });
  }

  const sources = [
    `https://r.jina.ai/http://g.dev/BhavyaKansal20?ts=${Date.now()}`,
    `https://r.jina.ai/http://developers.google.com/profile/u/BhavyaKansal20?hl=en&ts=${Date.now()}`,
  ];

  try {
    for (const source of sources) {
      try {
        const response = await fetch(source, { cache: "no-store" });
        if (!response.ok) continue;
        const text = await response.text();
        const parsed = parseGoogleProfile(text);

        if (parsed.totalBadges > 0 || parsed.favoriteBadges.length > 0) {
          cache.google = { data: parsed, timestamp: Date.now() };
          return res.json({ ...parsed, source, cached: false });
        }
      } catch {
        // Try next source
      }
    }

    if (cache.google?.data) {
      return res.json({ ...cache.google.data, cached: true, stale: true });
    }

    return res.status(502).json({
      headline: "Google Developer Program Member",
      location: "Patiala, Punjab, India",
      experience: "Early Career (0 - 5 years)",
      totalBadges: 0,
      favoriteBadges: [],
      activeThisYear: 0,
      error: "Google source is currently rate-limited",
    });
  } catch (error) {
    if (cache.google?.data) {
      return res.json({ ...cache.google.data, cached: true, stale: true });
    }
    return res.status(500).json({
      headline: "Google Developer Program Member",
      location: "Patiala, Punjab, India",
      experience: "Early Career (0 - 5 years)",
      totalBadges: 0,
      favoriteBadges: [],
      activeThisYear: 0,
      error: String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`bhavya-live-api running on http://localhost:${PORT}`);
});
