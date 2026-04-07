import { VercelRequest, VercelResponse } from '@vercel/node';

interface ContributionDay {
  date: string;
  count: number;
}

// GitHub GraphQL Query to get contributions
const GITHUB_QUERY = `
query($userName:String!) {
  user(login: $userName) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
    repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
      totalCount
    }
  }
}
`;

// Cache with TTL
let cache: {
  github?: { data: ContributionDay[]; timestamp: number };
  google?: { data: any; timestamp: number };
} = {};

const CACHE_TTL = 60000; // 1 minute

async function fetchGitHubContributions(username: string): Promise<ContributionDay[]> {
  try {
    console.log(`[GitHub] Fetching contributions for ${username}...`);
    
    // Check cache
    if (cache.github && Date.now() - cache.github.timestamp < CACHE_TTL) {
      console.log("[GitHub] ✓ Serving from cache");
      return cache.github.data;
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("[GitHub] ⚠️ No GitHub token found");
      return [];
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { userName: username },
      }),
    });

    if (!response.ok) {
      console.error(`[GitHub] API error: ${response.status}`);
      return [];
    }

    const json = await response.json();

    if (json.errors) {
      console.error("[GitHub] GraphQL error:", json.errors);
      return [];
    }

    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const contributions: ContributionDay[] = [];

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
        });
      }
    }

    console.log(`[GitHub] ✓ Fetched ${contributions.length} days of data`);

    // Cache the data
    cache.github = { data: contributions, timestamp: Date.now() };
    return contributions;
  } catch (error) {
    console.error("[GitHub] Error:", error);
    return [];
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const username = req.query.user as string || "BhavyaKansal20";
    
    const contributions = await fetchGitHubContributions(username);

    if (contributions.length === 0) {
      console.warn("[GitHub] ⚠️ No contributions found");
      return res.status(200).json({
        contributions: [],
        error: "Unable to fetch contributions",
      });
    }

    return res.status(200).json({
      contributions,
      count: contributions.length,
      lastFetch: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] Error:", error);
    return res.status(200).json({
      contributions: [],
      error: String(error),
    });
  }
}
