import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Github, Linkedin, Youtube, Sparkles, Activity, Flame, Mail, ExternalLink } from "lucide-react";
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

  const GITHUB_USER = import.meta.env.VITE_GITHUB_USERNAME || "BhavyaKansal20";

  useEffect(() => {
    const run = async () => {
      try {
        // Prefer locally generated profile data (stable and fast), then fallback to API.
        const localRes = await fetch("/github-contributions.json", { cache: "no-store" });
        let data: { contributions?: ContributionPayload[] | ContributionPayload[][]; data?: ContributionPayload[] };

        if (localRes.ok) {
          data = await localRes.json();
        } else {
          const res = await fetch(`https://github-contributions-api.deno.dev/${GITHUB_USER}.json`);
          if (!res.ok) throw new Error("GitHub contributions fetch failed");
          data = await res.json();
        }

        const raw = Array.isArray(data.contributions)
          ? data.contributions.flat()
          : Array.isArray(data.data)
            ? data.data
            : [];

        const normalized = (raw as ContributionPayload[]).map((d) => ({
          date: d.date || "",
          count: Number(d.count ?? d.contributionCount ?? 0),
        })).filter((entry) => Boolean(entry.date));
        setContributions(normalized);
      } catch {
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [GITHUB_USER]);

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
        .heatmap-wrap .react-calendar-heatmap .color-empty { fill: rgba(148,163,184,0.14); }
        .heatmap-wrap .react-calendar-heatmap .color-scale-1 { fill: rgba(56,189,248,0.32); }
        .heatmap-wrap .react-calendar-heatmap .color-scale-2 { fill: rgba(34,197,94,0.40); }
        .heatmap-wrap .react-calendar-heatmap .color-scale-3 { fill: rgba(168,85,247,0.48); }
        .heatmap-wrap .react-calendar-heatmap .color-scale-4 { fill: rgba(249,115,22,0.62); }
        .heatmap-wrap .react-calendar-heatmap text { fill: rgb(148,163,184); font-size: 9px; }
        .heatmap-wrap .react-calendar-heatmap rect {
          rx: 3;
          ry: 3;
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
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Developer Presence</p>
          <h2 className="text-5xl font-bold">GitHub & Social Activity</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            A clean snapshot of your public developer activity and profile presence, focused on GitHub and your social channels.
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
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Active contribution days in last year
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
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-400/20 border border-border/50" />No activity</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-sky-400/35 border border-border/50" />Low</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-400/40 border border-border/50" />Moderate</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-violet-400/45 border border-border/50" />High</span>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-400/55 border border-border/50" />Peak</span>
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
