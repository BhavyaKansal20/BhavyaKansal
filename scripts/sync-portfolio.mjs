import fs from 'fs';
import path from 'path';

const GITHUB_USER = 'BhavyaKansal20';
const LEETCODE_USER = 'BhavyaKansal20';
const GFG_USER = 'kansalbhavya20';

const PROJECTS_JSON_PATH = 'src/data/projects.json';
const GITHUB_CONTRIBUTIONS_PATH = 'public/github-contributions.json';
const GOOGLE_PROFILE_PATH = 'public/google-profile.json';
const LEETCODE_PROFILE_PATH = 'public/leetcode-profile.json';
const GFG_PROFILE_PATH = 'public/gfg-profile.json';

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
  }
}
`;

// Helper to parse Google Profile Markdown from Jina
function parseGoogleProfile(raw) {
  try {
    const lines = raw.split("\n").map((line) => line.trim());

    const nextNonEmpty = (start) => {
      for (let i = start; i < lines.length; i += 1) {
        if (lines[i]) return lines[i];
      }
      return "";
    };

    const dateRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/;
    const iconRegex = /^!\[Image\s+\d+\]\((https:\/\/developers\.google\.com\/static\/profile\/badges\/[^)]+)\)$/;

    const headlineLine = lines.find((line) => line.includes("Student at") || line.includes("Developer")) || "";
    const cityIndex = lines.findIndex((line) => line.includes("City/Town") || line.includes("Location"));
    const expIndex = lines.findIndex((line) => line.includes("Experience"));
    const favStart = lines.findIndex((line) => line.includes("Favorite badges"));
    const badgesStart = lines.findIndex((line) => line.includes("### Badges") || line.includes("All badges"));

    const parseBadgesBetween = (startIdx, endIdx) => {
      if (startIdx === -1) return [];
      const badges = [];

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

    const uniqueByName = new Map();
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
    return null;
  }
}

async function run() {
  console.log("=== Portfolio Hourly Sync Script ===");
  const rawToken = process.env.GITHUB_TOKEN;
  const githubToken = rawToken && rawToken.trim().length > 5 ? rawToken.trim() : null;

  // 1. Fetch GitHub Contributions
  if (githubToken) {
    try {
      console.log("Fetching GitHub contribution calendar via GraphQL...");
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GITHUB_QUERY,
          variables: { userName: GITHUB_USER },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
        const contributions = [];

        for (const week of weeks) {
          for (const day of week.contributionDays) {
            contributions.push({
              date: day.date,
              count: day.contributionCount,
            });
          }
        }

        if (contributions.length > 0) {
          fs.writeFileSync(GITHUB_CONTRIBUTIONS_PATH, JSON.stringify({
            contributions,
            count: contributions.length,
            lastFetch: new Date().toISOString()
          }, null, 2), 'utf8');
          console.log(`✓ Saved ${contributions.length} days of contribution data to ${GITHUB_CONTRIBUTIONS_PATH}`);
        } else {
          console.warn("⚠️ No contribution data found in GraphQL payload.");
        }
      } else {
        console.error(`❌ GraphQL request failed: ${response.status}`);
      }
    } catch (e) {
      console.error("❌ Error fetching GitHub contributions:", e);
    }
  } else {
    console.warn("⚠️ GITHUB_TOKEN not found in environment, skipping GraphQL contributions update.");
  }

  // 2. Fetch Google Developer Profile
  try {
    console.log("Fetching Google Developer Profile via Jina Reader...");
    const jinaUrl = `https://r.jina.ai/http://g.dev/${GITHUB_USER}`;
    const response = await fetch(jinaUrl, {
      headers: {
        "Accept": "text/plain",
        "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)",
      }
    });

    if (response.ok) {
      const text = await response.text();
      const profile = parseGoogleProfile(text);
      if (profile && profile.totalBadges > 0) {
        profile.fetchedAt = new Date().toISOString();
        profile.isMockData = false;
        fs.writeFileSync(GOOGLE_PROFILE_PATH, JSON.stringify(profile, null, 2), 'utf8');
        console.log(`✓ Saved Google Developer Profile with ${profile.totalBadges} badges to ${GOOGLE_PROFILE_PATH}`);
      } else {
        console.warn("⚠️ Google profile parsing yielded 0 badges, skipping write.");
      }
    } else {
      console.error(`❌ Google Profile scrape failed: ${response.status}`);
    }
  } catch (e) {
    console.error("❌ Error fetching Google Developer Profile:", e);
  }

  // 3. Fetch Repositories & Sync projects.json
  try {
    console.log("Fetching public repositories from GitHub REST API...");
    const headers = {};
    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, { headers });

    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      console.log(`✓ Fetched ${repos.length} public repositories.`);

      if (fs.existsSync(PROJECTS_JSON_PATH)) {
        const projects = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
        let projectsModified = false;

        for (const repo of repos) {
          const matchingProject = projects.find(p => {
            if (!p.githubUrl) return false;
            const cleanUrl = p.githubUrl.toLowerCase().replace(/\.git$/, '');
            const cleanRepoUrl = repo.clone_url.toLowerCase().replace(/\.git$/, '');
            return cleanUrl === cleanRepoUrl || cleanUrl.endsWith(`/${repo.name.toLowerCase()}`);
          });

          if (matchingProject) {
            let starsUpdated = false;
            let forksUpdated = false;

            if (matchingProject.metrics) {
              matchingProject.metrics = matchingProject.metrics.map(metric => {
                if (metric.label.toLowerCase().includes("star")) {
                  starsUpdated = true;
                  if (metric.value !== String(repo.stargazers_count)) {
                    projectsModified = true;
                    return { ...metric, value: String(repo.stargazers_count) };
                  }
                }
                if (metric.label.toLowerCase().includes("fork")) {
                  forksUpdated = true;
                  if (metric.value !== String(repo.forks_count)) {
                    projectsModified = true;
                    return { ...metric, value: String(repo.forks_count) };
                  }
                }
                return metric;
              });

              if (!starsUpdated && repo.stargazers_count > 0) {
                matchingProject.metrics.push({
                  value: String(repo.stargazers_count),
                  label: "GitHub Stars",
                  description: "Community feedback signal"
                });
                projectsModified = true;
              }
              if (!forksUpdated && repo.forks_count > 0) {
                matchingProject.metrics.push({
                  value: String(repo.forks_count),
                  label: "Forks",
                  description: "Repository forks"
                });
                projectsModified = true;
              }
            }

            if (repo.language && !matchingProject.techStack.includes(repo.language)) {
              matchingProject.techStack.push(repo.language);
              projectsModified = true;
            }
          }
        }

        if (projectsModified) {
          fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(projects, null, 2), 'utf8');
          console.log(`✓ Successfully updated ${PROJECTS_JSON_PATH} with latest repository stats.`);
        } else {
          console.log("✓ No updates needed for projects.json.");
        }
      } else {
        console.error(`❌ File not found: ${PROJECTS_JSON_PATH}`);
      }
    } else {
      console.error(`❌ Failed to fetch repositories: ${reposResponse.status}`);
    }
  } catch (e) {
    console.error("❌ Error syncing projects data:", e);
  }

  // 4. Fetch LeetCode Data — full profile including contest ranking history
  try {
    console.log("Fetching LeetCode Profile via GraphQL...");
    const leetCodeQuery = `
      query getUserProfile($username: String!) {
        allQuestionsCount { difficulty count }
        matchedUser(username: $username) {
          contributions { points }
          profile { reputation ranking }
          submitStats {
            acSubmissionNum { difficulty count submissions }
            totalSubmissionNum { difficulty count submissions }
          }
          badges { id displayName icon creationDate }
          upcomingBadges { name icon }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge { name }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          finishTimeInSeconds
          rating
          ranking
          contest { title startTime }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        query: leetCodeQuery,
        variables: { username: LEETCODE_USER },
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.data && json.data.matchedUser) {
        const dataToSave = {
          ...json.data,
          fetchedAt: new Date().toISOString(),
        };
        fs.writeFileSync(LEETCODE_PROFILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf8');
        const solved = json.data.matchedUser.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'All')?.count || 0;
        const contestRating = json.data.userContestRanking?.rating ? Math.round(json.data.userContestRanking.rating) : 0;
        const historyCount = json.data.userContestRankingHistory?.filter(h => h.attended)?.length || 0;
        console.log(`✓ Saved LeetCode Profile — Solved: ${solved}, Contest Rating: ${contestRating}, Contest History: ${historyCount} entries`);
      } else {
        if (json.errors) {
          console.warn("⚠️ LeetCode GraphQL errors:", JSON.stringify(json.errors));
        } else {
          console.warn("⚠️ LeetCode profile not found or hidden.");
        }
      }
    } else {
      const errorText = await response.text().catch(() => '');
      console.error(`❌ LeetCode GraphQL request failed: ${response.status} — ${errorText.slice(0, 200)}`);
    }
  } catch (e) {
    console.error("❌ Error fetching LeetCode data:", e);
  }

  // 5. Fetch GeeksforGeeks Data — try GFG API first, then scrape as fallback
  try {
    console.log("Fetching GeeksforGeeks Profile...");
    let gfgSolved = null;

    // Try the official GFG user API endpoint first
    try {
      const gfgApiResponse = await fetch(`https://geeksforgeeks.org/api/v1/user/info/?handle=${GFG_USER}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (gfgApiResponse.ok) {
        const gfgJson = await gfgApiResponse.json();
        // API returns { info: { totalProblemsSolved: N, ... } }
        const total = gfgJson?.info?.totalProblemsSolved ?? gfgJson?.total_problems_solved ?? null;
        if (total !== null && !isNaN(Number(total))) {
          gfgSolved = Number(total);
          console.log(`✓ GFG API returned totalProblemsSolved: ${gfgSolved}`);
        }
      }
    } catch (apiErr) {
      console.warn("⚠️ GFG API fetch failed, trying page scrape:", apiErr.message);
    }

    // Fallback: scrape the profile page HTML
    if (gfgSolved === null) {
      const gfgResponse = await fetch(`https://www.geeksforgeeks.org/user/${GFG_USER}/`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (gfgResponse.ok) {
        const html = await gfgResponse.text();
        // Multiple regex patterns to find solved count
        const patterns = [
          /total_problems_solved\\?":\s*(\d+)/,
          /"totalProblemsSolved":\s*(\d+)/,
          /"total_solved":\s*(\d+)/,
          /Problems Solved[^<]*<[^>]*>(\d+)/,
          /(\d+)\s*(?:Questions|Problems)\s*Solved/i,
        ];
        for (const pattern of patterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            gfgSolved = parseInt(match[1], 10);
            console.log(`✓ GFG page scrape found: ${gfgSolved}`);
            break;
          }
        }
      } else {
        console.error(`❌ GeeksforGeeks page request failed: ${gfgResponse.status}`);
      }
    }

    if (gfgSolved !== null) {
      const gfgData = {
        total_problems_solved: gfgSolved,
        username: GFG_USER,
        fetchedAt: new Date().toISOString(),
      };
      fs.writeFileSync(GFG_PROFILE_PATH, JSON.stringify(gfgData, null, 2), 'utf8');
      console.log(`✓ Saved GFG Profile to ${GFG_PROFILE_PATH} — Solved: ${gfgSolved}`);
    } else {
      // Read existing and keep it (don't overwrite with 0)
      console.warn("⚠️ GFG total problems solved not found — keeping existing data.");
    }
  } catch (e) {
    console.error("❌ Error fetching GeeksforGeeks data:", e);
  }

  console.log("=== Sync Process Completed ===");
}

run();
