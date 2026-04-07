import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory cache with TTL
const cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 300000; // 5 minutes

interface GoogleBadge {
  name: string;
  date: string;
  icon: string;
}

interface GoogleDevProfile {
  headline: string;
  location: string;
  experience: string;
  totalBadges: number;
  favoriteBadges: GoogleBadge[];
  activeThisYear: number;
}

function parseGoogleProfile(raw: string): GoogleDevProfile {
  try {
    const lines = raw.split("\n").map((line) => line.trim());

    const nextNonEmpty = (start: number): string => {
      for (let i = start; i < lines.length; i += 1) {
        if (lines[i]) return lines[i];
      }
      return "";
    };

    const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/;
    const iconRegex = /^!\[Image\s+\d+\]\((https:\/\/developers\.google\.com\/static\/profile\/badges\/[^)]+)\)$/;

    // More flexible headline detection
    const headlineLine = lines.find((line) => line.includes("Student at") || line.includes("Developer")) || "";
    const cityIndex = lines.findIndex((line) => line.includes("City/Town") || line.includes("Location"));
    const expIndex = lines.findIndex((line) => line.includes("Experience"));
    const favStart = lines.findIndex((line) => line.includes("Favorite badges"));
    const badgesStart = lines.findIndex((line) => line.includes("### Badges") || line.includes("All badges"));

    const parseBadgesBetween = (startIdx: number, endIdx: number): GoogleBadge[] => {
      if (startIdx === -1) return [];
      const badges: GoogleBadge[] = [];

      for (let i = startIdx; i < endIdx && i < lines.length; i += 1) {
        const iconMatch = lines[i].match(iconRegex);
        if (!iconMatch) continue;

        const icon = iconMatch[1];
        const name = nextNonEmpty(i + 1);
        const maybeDate = nextNonEmpty(i + 2);
        const date = dateRegex.test(maybeDate) ? maybeDate : "";

        if (name && icon) {
          badges.push({ name, date, icon });
        }
      }

      return badges;
    };

    const favoriteBadges = parseBadgesBetween(
      favStart,
      badgesStart > -1 ? badgesStart : lines.length
    );
    const allBadgesRaw = badgesStart > -1 
      ? parseBadgesBetween(badgesStart, lines.length)
      : [];

    const uniqueByName = new Map<string, GoogleBadge>();
    [...favoriteBadges, ...allBadgesRaw].forEach((badge) => {
      if (!uniqueByName.has(badge.name)) {
        uniqueByName.set(badge.name, badge);
      }
    });

    const allBadges = Array.from(uniqueByName.values());
    const currentYear = new Date().getFullYear();
    const activeThisYear = allBadges
      .filter((badge) => badge.date)
      .filter((badge) => {
        const d = Date.parse(badge.date);
        return !Number.isNaN(d) && new Date(d).getFullYear() === currentYear;
      }).length;

    console.log("[GoogleProfile] Parsed - Total Badges:", allBadges.length, "Favorite:", favoriteBadges.length);

    return {
      headline: headlineLine.replace(/^#+\s*/, "") || "Google Developer Program Member",
      location: cityIndex > -1 ? nextNonEmpty(cityIndex + 1) : "Patiala, Punjab, India",
      experience: expIndex > -1 ? nextNonEmpty(expIndex + 1) : "Early Career (0 - 5 years)",
      totalBadges: allBadges.length,
      favoriteBadges: favoriteBadges.slice(0, 10),
      activeThisYear,
    };
  } catch (error) {
    console.error("[GoogleProfile] Parse error:", error);
    return {
      headline: "Google Developer Program Member",
      location: "Patiala, Punjab, India",
      experience: "Early Career (0 - 5 years)",
      totalBadges: 0,
      favoriteBadges: [],
      activeThisYear: 0,
    };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return res.status(200).json(cache.data);
    }

    // Fetch from r.jina.ai
    console.log("[API] Fetching Google profile...");
    const jinaRes = await fetch(
      `https://r.jina.ai/http://g.dev/BhavyaKansal20?ts=${Date.now()}`,
      {
        headers: {
          "Accept": "text/plain",
          "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)",
        },
      }
    );

    if (!jinaRes.ok) {
      console.warn("[API] r.jina.ai returned", jinaRes.status);
      throw new Error(`Jina API returned ${jinaRes.status}`);
    }

    const text = await jinaRes.text();
    const profile = parseGoogleProfile(text);

    // Update cache
    (cache as any) = { data: profile, timestamp: Date.now() };

    return res.status(200).json(profile);
  } catch (error) {
    console.error("[API] Error:", error);
    return res.status(200).json({
      headline: "Google Developer Program Member",
      location: "Patiala, Punjab, India",
      experience: "Early Career (0 - 5 years)",
      totalBadges: 0,
      favoriteBadges: [],
      activeThisYear: 0,
    });
  }
}
