import fs from 'fs';
import path from 'path';

const GITHUB_USER = 'BhavyaKansal20';
const PROJECTS_JSON_PATH = 'src/data/projects.json';
const GITHUB_CONTRIBUTIONS_PATH = 'public/github-contributions.json';
const GOOGLE_PROFILE_PATH = 'public/google-profile.json';

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
    // Let's use Token if available to bypass rate limits
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
          // Find matching project
          const matchingProject = projects.find(p => {
            if (!p.githubUrl) return false;
            const cleanUrl = p.githubUrl.toLowerCase().replace(/\.git$/, '');
            const cleanRepoUrl = repo.clone_url.toLowerCase().replace(/\.git$/, '');
            return cleanUrl === cleanRepoUrl || cleanUrl.endsWith(`/${repo.name.toLowerCase()}`);
          });

          if (matchingProject) {
            // Update stars and forks metrics if they exist
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

              // Add stars/forks if not present in the metrics array
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

            // Sync languages to techStack if needed
            if (repo.language && !matchingProject.techStack.includes(repo.language)) {
              matchingProject.techStack.push(repo.language);
              projectsModified = true;
            }
          } else {
            // New repository found! Auto-add to "Other Projects"
            // Skip the main portfolio website repo itself to avoid recursion
            if (repo.name.toLowerCase() === 'bhavyakansal' || repo.name.toLowerCase() === 'portfolio-website') {
              continue;
            }

            console.log(`+ Auto-adding new repository: ${repo.name}`);
            const newProject = {
              id: repo.name.toLowerCase(),
              title: repo.name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              description: repo.description || "Open source repository auto-indexed from GitHub.",
              fullDescription: repo.description || "Open source repository auto-indexed from GitHub.",
              image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=80",
              images: ["https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=80"],
              tags: [repo.language].filter(Boolean),
              techStack: [repo.language].filter(Boolean),
              category: "Other Projects",
              featured: false,
              githubUrl: repo.html_url,
              features: ["Auto-indexed from GitHub", `Last updated: ${new Date(repo.updated_at).toLocaleDateString()}`],
              challenges: ["Automated synchronization from GitHub Profile"],
              metrics: [
                { value: String(repo.stargazers_count), label: "GitHub Stars" },
                { value: String(repo.forks_count), label: "Forks" }
              ],
              implementation: {
                approach: "Automatic portfolio syncing via custom GitHub Actions workflow.",
                technologies: [
                  { name: repo.language || "Unknown", reason: "Detected primary repository language." }
                ]
              },
              documentation: {
                overview: repo.description || "Public codebase open source contribution."
              }
            };

            projects.push(newProject);
            projectsModified = true;
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

  console.log("=== Sync Process Completed ===");
}

run();
