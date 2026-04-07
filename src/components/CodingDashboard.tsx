import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Github, Linkedin, Youtube, Activity, Flame, Mail, ExternalLink, BadgeCheck, Code2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type ContributionDay = {
  date: string;
  count: number;
};

type ContributionPayload = {
  date?: string;
  count?: number;
  contributionCount?: number;
};

type GitHubContributionApiPayload = {
  contributions?: ContributionPayload[] | ContributionPayload[][];
  data?: ContributionPayload[];
};

type GoogleBadge = {
  name: string;
  date: string;
  icon: string;
};

type GoogleDevProfile = {
  headline: string;
  location: string;
  experience: string;
  totalBadges: number;
  favoriteBadges: GoogleBadge[];
  activeThisYear: number;
};

const GOOGLE_PROFILE_URL = "https://g.dev/BhavyaKansal20";
const GITHUB_PRIMARY_API = "https://github-contributions.vercel.app/api/v1";
const GITHUB_FALLBACK_API = "https://github-contributions-api.deno.dev";
const LIVE_API_BASE_URL = (import.meta.env.VITE_LIVE_API_BASE_URL || "").replace(/\/$/, "");

const curatedGoogleBadges: GoogleBadge[] = [
  {
    name: "Gemini Enterprise Agent Ready",
    date: "7 Apr 2026",
    icon: "https://developers.google.com/static/focus/images/gemini-icon-2025.png",
  },
  {
    name: "Google Developer Group member",
    date: "9 Nov 2025",
    icon: "https://developers.google.com/static/site-assets/logo-google-g.svg",
  },
  {
    name: "Google Cloud & NVIDIA community member",
    date: "7 Apr 2026",
    icon: "/badges/nvidia-community.png",
  },
  {
    name: "I/O 2026 - Registered",
    date: "7 Apr 2026",
    icon: "/badges/io-2026-registered.png",
  },
  {
    name: "Google Developer Program premium tier",
    date: "31 Jan 2026",
    icon: "https://developers.google.com/static/focus/images/antigravity-icon.png",
  },
];

const curatedGoogleProfile: GoogleDevProfile = {
  headline: "Google Developer Program Member",
  location: "Patiala, Punjab, India",
  experience: "Early Career (0 - 5 years)",
  totalBadges: 12,
  favoriteBadges: curatedGoogleBadges,
  activeThisYear: 16,
};

const GoogleGIcon = ({ className = "" }: { className?: string }) => (
  <img
    src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
    alt="Google"
    className={className}
    loading="lazy"
    decoding="async"
  />
);

const parseGoogleProfile = (raw: string): GoogleDevProfile => {
  try {
    const lines = raw.split("\n").map((line) => line.trim());

    const nextNonEmpty = (start: number) => {
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

    const parseBadgesBetween = (startIdx: number, endIdx: number) => {
      if (startIdx === -1) return [] as GoogleBadge[];
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
};

const levelClass = (count: number) => {
  if (count >= 12) return "color-scale-4";
  if (count >= 8) return "color-scale-3";
  if (count >= 4) return "color-scale-2";
  if (count >= 1) return "color-scale-1";
  return "color-empty";
};

const CodingDashboard = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [googleProfile, setGoogleProfile] = useState<GoogleDevProfile | null>(null);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [googleLastSynced, setGoogleLastSynced] = useState<string>("");

  const GITHUB_USER = import.meta.env.VITE_GITHUB_USERNAME || "BhavyaKansal20";

  useEffect(() => {
    const normalizeContributionPayload = (payload: GitHubContributionApiPayload) => {
      const raw = Array.isArray(payload.contributions)
        ? (Array.isArray(payload.contributions[0])
            ? (payload.contributions as ContributionPayload[][]).flat()
            : payload.contributions as ContributionPayload[])
        : Array.isArray(payload.data)
          ? payload.data
          : [];

      return raw
        .map((d) => ({
          date: d.date || "",
          count: Number(d.count ?? d.contributionCount ?? 0),
        }))
        .filter((entry) => Boolean(entry.date));
    };

    const run = async () => {
      setLoading(true);
      try {
        const sources = [
          LIVE_API_BASE_URL
            ? `${LIVE_API_BASE_URL}/api/github-contributions?user=${encodeURIComponent(GITHUB_USER)}`
            : "",
          `${GITHUB_PRIMARY_API}/${GITHUB_USER}`,
          `${GITHUB_FALLBACK_API}/${GITHUB_USER}.json`,
          "/github-contributions.json",
        ].filter(Boolean);

        let liveData: ContributionDay[] = [];

        for (const source of sources) {
          try {
            const res = await fetch(`${source}${source.includes("?") ? "&" : "?"}ts=${Date.now()}`, {
              cache: "no-store",
            });
            if (!res.ok) continue;
            const json = await res.json();
            const normalized = normalizeContributionPayload(json as GitHubContributionApiPayload);
            if (normalized.length > 0) {
              liveData = normalized;
              break;
            }
          } catch {
            // Try next source
          }
        }

        if (liveData.length > 0) {
          setContributions(liveData);
          console.log("[GitHub] Live contributions synced:", liveData.length);
        }
      } catch (error) {
        console.error("[GitHub] Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    run();
    // Live sync every 60 seconds
    const interval = setInterval(run, 60000);
    return () => clearInterval(interval);
  }, [GITHUB_USER]);

  useEffect(() => {
    const run = async () => {
      setGoogleLoading(true);
      try {
        const backendSources = [
          LIVE_API_BASE_URL
            ? `${LIVE_API_BASE_URL}/api/google-profile?ts=${Date.now()}`
            : "",
          "/api/google-profile",
        ].filter(Boolean);

        let parsedProfile: GoogleDevProfile | null = null;

        for (const source of backendSources) {
          try {
            const res = await fetch(`${source}${source.includes("?") ? "&" : "?"}ts=${Date.now()}`, { cache: "no-store" });
            if (!res.ok) continue;
            const profile = await res.json();
            if (profile && (profile.totalBadges > 0 || profile.favoriteBadges?.length > 0)) {
              parsedProfile = profile;
              break;
            }
          } catch {
            // Try next source
          }
        }

        const sources = [
          `https://r.jina.ai/http://g.dev/BhavyaKansal20?ts=${Date.now()}`,
          `https://r.jina.ai/http://developers.google.com/profile/u/BhavyaKansal20?hl=en&ts=${Date.now()}`,
        ];

        if (parsedProfile) {
          setGoogleProfile({
            ...curatedGoogleProfile,
            ...parsedProfile,
            favoriteBadges: curatedGoogleBadges,
            totalBadges: 12,
            activeThisYear: 16,
          });
          setGoogleLastSynced(new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
          setGoogleLoading(false);
          return;
        }

        for (const source of sources) {
          try {
            const res = await fetch(source, { cache: "no-store" });
            if (!res.ok) continue;
            const text = await res.text();
            const parsed = parseGoogleProfile(text);
            if (parsed.totalBadges > 0 || parsed.favoriteBadges.length > 0) {
              parsedProfile = parsed;
              break;
            }
          } catch {
            // Try next source
          }
        }

        if (parsedProfile) {
          setGoogleProfile({
            ...curatedGoogleProfile,
            ...parsedProfile,
            favoriteBadges: curatedGoogleBadges,
            totalBadges: 12,
            activeThisYear: 16,
          });
          setGoogleLastSynced(new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
          console.log("[GoogleProfile] Live sync result:", {
            totalBadges: parsedProfile.totalBadges,
            favorites: parsedProfile.favoriteBadges?.length || 0,
          });
        } else {
          setGoogleProfile(curatedGoogleProfile);
          setGoogleLastSynced(new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
        }
      } catch (error) {
        console.error("[GoogleProfile] Fetch error:", error);
        setGoogleProfile(curatedGoogleProfile);
        setGoogleLastSynced(new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
      } finally {
        setGoogleLoading(false);
      }
    };

    run();
    // Live sync every 60 seconds
    const interval = setInterval(run, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const daysActive = contributions.filter((d) => d.count > 0).length;
    const totalContribs = contributions.reduce((acc, d) => acc + d.count, 0);
    const bestWeek = contributions.reduce((best, day) => (day.count > best ? day.count : best), 0);
    const strongestDay = contributions.reduce(
      (best, day) => (day.count > best.count ? day : best),
      { date: "", count: 0 }
    );

    const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      if (sorted[i].count > 0) {
        currentStreak += 1;
      } else if (currentStreak > 0) {
        break;
      }
    }

    return {
      daysActive,
      totalContribs,
      strongestDay,
      bestWeek,
      currentStreak,
    };
  }, [contributions]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const contributionValues = useMemo(
    () => contributions.map((entry) => ({ date: entry.date, count: entry.count })),
    [contributions]
  );

  const profileCards = [
    {
      label: "GitHub",
      href: "https://github.com/BhavyaKansal20",
      handle: "@BhavyaKansal20",
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/kansal0920",
      handle: "kansal0920",
      icon: Linkedin,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@Kansal-ai",
      handle: "@Kansal-ai",
      icon: Youtube,
    },
    {
      label: "Google Dev",
      href: GOOGLE_PROFILE_URL,
      handle: "g.dev/BhavyaKansal20",
      icon: GoogleGIcon,
    },
    {
      label: "Email",
      href: "mailto:kansalbhavya27@gmail.com",
      handle: "kansalbhavya27@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <section id="coding" ref={ref} className="py-24 bg-background relative overflow-hidden">
      <style>{`
        .heatmap-wrap .react-calendar-heatmap {
          width: 100%;
        }
        .heatmap-wrap .react-calendar-heatmap .color-empty { fill: #161b22; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-1 { fill: #0e4429; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-2 { fill: #006d32; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-3 { fill: #26a641; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-4 { fill: #39d353; }
        .heatmap-wrap .react-calendar-heatmap text { fill: rgb(166,173,187); font-size: 10px; }
        .heatmap-wrap .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
          transition: transform 0.2s ease, filter 0.2s ease;
          shape-rendering: geometricPrecision;
        }
        .heatmap-wrap .react-calendar-heatmap rect:hover {
          transform: scale(1.08);
          filter: brightness(1.25);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-12 ${isVisible ? "scroll-animate" : ""}`}>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Coding Journey</p>
          <h2 className="text-5xl font-bold inline-flex items-center gap-3">
            <Code2 className="w-10 h-10" /> Contributions & Developer Activity
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            A live snapshot of your GitHub contribution graph and Google Developer profile badges, activity, and ecosystem presence.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.45fr_0.95fr] gap-6 items-start">
          <div className={`space-y-6 ${isVisible ? "scroll-animate" : ""}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-border/70">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Total Contributions</p>
                <p className="text-3xl font-bold">{loading ? "..." : stats.totalContribs}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="w-3.5 h-3.5" /> Public GitHub contribution count
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-border/70">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Days Active</p>
                <p className="text-3xl font-bold">{loading ? "..." : stats.daysActive}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Active contribution days in this month
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-border/70">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Best Day</p>
                <p className="text-3xl font-bold">{loading ? "..." : stats.strongestDay.count}</p>
                <p className="mt-3 text-xs text-muted-foreground truncate">
                  {stats.strongestDay.date || "No contribution data yet"}
                </p>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-border/70">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Current Streak</p>
                <p className="text-3xl font-bold">{loading ? "..." : stats.currentStreak}</p>
                <p className="mt-3 text-xs text-muted-foreground">Consecutive active days</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 md:p-8 border border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">GitHub Activity</p>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Github className="w-6 h-6" /> Contribution Heatmap
                  </h3>
                </div>
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 bg-background/70 text-sm hover:bg-secondary transition"
                >
                  View GitHub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="heatmap-wrap relative z-10 rounded-2xl border border-border/80 bg-background/60 p-4 md:p-5 overflow-x-auto">
                <CalendarHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  values={contributionValues}
                  classForValue={(value) => levelClass(value?.count || 0)}
                  showWeekdayLabels
                  showMonthLabels
                  tooltipDataAttrs={(value) => ({
                    "data-tip": value?.date
                      ? `${value.date}: ${value.count || 0} contributions`
                      : "No contributions",
                  })}
                />
              </div>

              <div className="relative z-10 mt-5 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-border/50" style={{ backgroundColor: "#161b22" }} />No activity</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-border/50" style={{ backgroundColor: "#0e4429" }} />Low</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-border/50" style={{ backgroundColor: "#006d32" }} />Moderate</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-border/50" style={{ backgroundColor: "#26a641" }} />High</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded border border-border/50" style={{ backgroundColor: "#39d353" }} />Peak</span>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground inline-flex items-center gap-2">
                    <GoogleGIcon className="w-4 h-4" /> Google Developer Profile
                  </p>
                  <a
                    href={GOOGLE_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    View Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {googleLoading && (
                  <p className="text-sm text-muted-foreground">Loading live profile data...</p>
                )}

                {!googleLoading && googleProfile && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-medium">{googleProfile.headline}</p>
                      <p className="text-xs text-muted-foreground mt-1">{googleProfile.location} • {googleProfile.experience}</p>
                      {googleLastSynced && (
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
                          Last synced {googleLastSynced}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border/70 px-3 py-2 bg-background/60">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total Badges</p>
                        <p className="text-xl font-bold mt-1 inline-flex items-center gap-2">
                          <BadgeCheck className="w-4 h-4" /> {googleProfile.totalBadges}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/70 px-3 py-2 bg-background/60">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active This Month</p>
                        <p className="text-xl font-bold mt-1">{googleProfile.activeThisYear}</p>
                      </div>
                    </div>

                    {googleProfile.favoriteBadges.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Featured Badges</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
                          {googleProfile.favoriteBadges.map((badge, idx) => (
                            <div
                              key={`${badge.icon}-${idx}`}
                              className="rounded-3xl border border-border/70 bg-background/55 min-h-[168px] p-4 flex flex-col items-center justify-center text-center gap-3"
                              title={badge.name}
                            >
                              <div className="h-20 w-20 rounded-full bg-background/70 border border-border/60 flex items-center justify-center overflow-hidden shadow-sm">
                                <img src={badge.icon} alt={badge.name} className="w-16 h-16 object-contain" loading="lazy" decoding="async" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs font-medium leading-snug line-clamp-3">{badge.name}</p>
                                <p className="text-[11px] text-muted-foreground">{badge.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!googleLoading && !googleProfile && (
                  <div className="rounded-xl border border-border/70 px-3 py-3 bg-background/60">
                    <p className="text-sm text-muted-foreground mb-2">Unable to fetch live badge data right now.</p>
                    <a
                      href={GOOGLE_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Open Google Developer Profile <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`space-y-6 ${isVisible ? "scroll-animate scroll-animate-delay-2" : ""}`}>
            <div className="glass-card rounded-3xl p-6 border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">Profile Snapshot</p>
                <h3 className="text-2xl font-bold mb-3">Bhavya Kansal</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Founder-led work on multimodal AI systems, applied machine learning, and deployable deep-tech products.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-4">Connect</p>
                <div className="space-y-3">
                  {profileCards.map((profile) => {
                    const Icon = profile.icon;
                    return (
                      <a
                        key={profile.label}
                        href={profile.href}
                        target={profile.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={profile.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        className="group flex items-center justify-between rounded-xl border border-border/70 px-4 py-3 hover:bg-secondary transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-background border border-border/70 inline-flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{profile.label}</p>
                            <p className="text-xs text-muted-foreground">{profile.handle}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-4">Quick Links</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/BhavyaKansal20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kansal0920"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a
                    href="https://www.youtube.com/@Kansal-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-secondary transition"
                  >
                    <Youtube className="w-4 h-4" /> YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingDashboard;
