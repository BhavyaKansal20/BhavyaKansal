import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTiltCard } from "@/hooks/useTiltCard";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Github, Code2, Calendar, Award, Star, TrendingUp, Target } from "lucide-react";

type ContributionDay = { date: string; count: number };

const LEETCODE_URL = "https://leetcode.com/u/BhavyaKansal20/";
const GFG_URL = "https://www.geeksforgeeks.org/profile/kansalbhavya20";
const GITHUB_URL = "https://github.com/BhavyaKansal20";
const GOOGLE_DEV_URL = "https://g.dev/kansalbhavya20";

const COLORS = {
  Easy: "#2db55d",
  Medium: "#ffa116",
  Hard: "#ef4743"
};

/* ── SVG Icons ── */
const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="#ffa116" className="w-5 h-5">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114l5.313-5.694a.458.458 0 0 1 .32-.146.458.458 0 0 1 .32.146l2.127 2.279c.54.58 1.455.61 2.035.069.58-.54.61-1.455.069-2.035l-2.127-2.28A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382H10.617z"/>
  </svg>
);

const GfgIcon = () => (
  <svg viewBox="0 0 24 24" fill="#2f8d46" className="w-5 h-5">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.235 15.632l-3.308-3.308 1.258-1.258 2.05 2.05 4.885-4.885 1.258 1.258-6.143 6.143z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ── Semi-circular Gauge Chart ── */
const SemiCircleGauge = ({
  easy,
  medium,
  hard,
  animate,
}: { easy: number; medium: number; hard: number; animate: boolean }) => {
  const solved = easy + medium + hard;
  const totalQuestions = 3981; // standard LeetCode total
  const pct = Math.min(solved / totalQuestions, 1);

  const r = 75;
  const cx = 110;
  const cy = 105;

  const arcLength = 235.6; // pi * 75
  const strokeDashoffset = arcLength - (arcLength * pct);

  return (
    <svg viewBox="0 0 220 120" className="w-full max-w-[220px]">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2db55d" />
          <stop offset="100%" stopColor="#ffa116" />
        </linearGradient>
      </defs>
      {/* Background Track */}
      <path
        d="M 35,105 A 75,75 0 0,1 185,105"
        fill="none"
        stroke="#222327"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Progress Overlay */}
      <path
        d="M 35,105 A 75,75 0 0,1 185,105"
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={arcLength}
        strokeDashoffset={animate ? strokeDashoffset : arcLength}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "stroke-dashoffset"
        }}
      />
      {/* Text inside the curve */}
      <text
        x="110"
        y="75"
        fill="#ffffff"
        fontSize="22"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="Times New Roman"
      >
        {solved}
      </text>
      <text
        x="110"
        y="95"
        fill="#8a8f98"
        fontSize="11"
        textAnchor="middle"
        fontFamily="Times New Roman"
      >
        / {totalQuestions} Solved
      </text>
    </svg>
  );
};

/* ── Animated stat counter ── */
const AnimatedCount = ({ target, isVisible }: { target: number; isVisible: boolean }) => {
  const [val, setVal] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!isVisible || target === 0) return;
    const start = performance.now();
    const duration = 1200;
    const step = (ts: number) => {
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [isVisible, target]);

  return <>{val}</>;
};

/* ── Custom tooltip for rating chart ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RatingTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1e1f23] border border-white/10 rounded-xl px-3 py-2 text-xs text-white shadow-xl">
        <p className="font-bold text-base">{payload[0].value}</p>
        <p className="text-gray-400">{payload[0].payload.label}</p>
      </div>
    );
  }
  return null;
};

const CodingDashboard = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [revealStage, setRevealStage] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gfgData, setGfgData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [googleData, setGoogleData] = useState<any>(null);

  const maxCount = useMemo(() => {
    if (!contributions || contributions.length === 0) return 1;
    return Math.max(...contributions.map((d) => d.count), 1);
  }, [contributions]);

  const levelClass = useCallback((count: number) => {
    if (count === 0) return "color-empty";
    const pct = count / maxCount;
    if (pct >= 0.75) return "color-scale-4";
    if (pct >= 0.50) return "color-scale-3";
    if (pct >= 0.25) return "color-scale-2";
    return "color-scale-1";
  }, [maxCount]);

  useEffect(() => {
    const fetchGithub = async () => {
      setGithubLoading(true);
      try {
        const res = await fetch(`/github-contributions.json?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.contributions) setContributions(data.contributions);
        }
      } catch (err) {
        console.error("GitHub fetch error:", err);
      } finally {
        setGithubLoading(false);
      }
    };

    const fetchLeetCode = async () => {
      try {
        const res = await fetch(`/leetcode-profile.json?ts=${Date.now()}`);
        if (res.ok) setLeetcodeData(await res.json());
      } catch (err) { console.error("LeetCode fetch error:", err); }
    };

    const fetchGFG = async () => {
      try {
        const res = await fetch(`/gfg-profile.json?ts=${Date.now()}`);
        if (res.ok) setGfgData(await res.json());
      } catch (err) { console.error("GFG fetch error:", err); }
    };

    const fetchGoogle = async () => {
      try {
        const res = await fetch(`/google-profile.json?ts=${Date.now()}`);
        if (res.ok) setGoogleData(await res.json());
      } catch (err) { console.error("Google fetch error:", err); }
    };

    fetchGithub();
    fetchLeetCode();
    fetchGFG();
    fetchGoogle();
  }, []);

  useEffect(() => {
    // Expose dynamic data overwrite API for live stream data
    (window as any).updatePortfolioData = (data: {
      leetcodeSolved?: number;
      easy?: number;
      medium?: number;
      hard?: number;
      githubContributions?: ContributionDay[];
    }) => {
      if (data.leetcodeSolved !== undefined) {
        const easyCount = data.easy ?? Math.round(data.leetcodeSolved * 0.3);
        const mediumCount = data.medium ?? Math.round(data.leetcodeSolved * 0.5);
        const hardCount = data.hard ?? Math.round(data.leetcodeSolved * 0.2);
        setLeetcodeData((prev: any) => ({
          ...prev,
          matchedUser: {
            ...prev?.matchedUser,
            submitStats: {
              ...prev?.matchedUser?.submitStats,
              acSubmissionNum: [
                { difficulty: "All", count: data.leetcodeSolved },
                { difficulty: "Easy", count: easyCount },
                { difficulty: "Medium", count: mediumCount },
                { difficulty: "Hard", count: hardCount },
              ]
            }
          }
        }));
      }
      if (data.githubContributions !== undefined) {
        setContributions(data.githubContributions);
      }
    };

    return () => {
      delete (window as any).updatePortfolioData;
    };
  }, [setLeetcodeData, setContributions]);

  useEffect(() => {
    if (!isVisible) {
      setRevealStage(0);
      return;
    }

    const timers = [
      window.setTimeout(() => setRevealStage(1), 80),
      window.setTimeout(() => setRevealStage(2), 260),
      window.setTimeout(() => setRevealStage(3), 520),
      window.setTimeout(() => setRevealStage(4), 760),
      window.setTimeout(() => setRevealStage(5), 1040),
      window.setTimeout(() => setRevealStage(6), 1320),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isVisible]);

  const stats = useMemo(() => {
    const activeDays = contributions.filter((d) => d.count > 0).length;

    let lcSolved = 0, lcEasy = 0, lcMedium = 0, lcHard = 0;
    let ratingHistory: { label: string; rating: number }[] = [];

    if (leetcodeData?.matchedUser?.submitStats?.acSubmissionNum) {
      const s = leetcodeData.matchedUser.submitStats.acSubmissionNum;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lcSolved = s.find((x: any) => x.difficulty === "All")?.count || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lcEasy   = s.find((x: any) => x.difficulty === "Easy")?.count || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lcMedium = s.find((x: any) => x.difficulty === "Medium")?.count || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lcHard   = s.find((x: any) => x.difficulty === "Hard")?.count || 0;
    }

    // Build rating history from contest data
    if (leetcodeData?.userContestRankingHistory?.length) {
      const hist = leetcodeData.userContestRankingHistory
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => c.attended && c.rating > 0)
        .slice(-12);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ratingHistory = hist.map((c: any) => {
        const d = new Date(c.contest.startTime * 1000);
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        return { label, rating: Math.round(c.rating) };
      });
    }

    const gfgSolved = gfgData?.total_problems_solved || 0;
    const totalQuestions = lcSolved + gfgSolved;
    const googleBadges = googleData?.totalBadges || 0;
    const googleExp = googleData?.experience || "Developer";

    return {
      activeDays, totalQuestions, googleBadges, googleExp,
      lcEasy, lcMedium, lcHard, lcSolved, gfgSolved, ratingHistory
    };
  }, [contributions, leetcodeData, gfgData, googleData]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const contributionValues = useMemo(
    () => contributions.map((e) => ({ date: e.date, count: e.count })),
    [contributions]
  );

  const statCards = [
    { label: "Total Questions", value: stats.totalQuestions, icon: <Code2 className="w-5 h-5 text-blue-400" />, sub: `LC: ${stats.lcSolved} + GFG: ${stats.gfgSolved}` },
    { label: "Active Days", value: stats.activeDays, icon: <Calendar className="w-5 h-5 text-yellow-400" />, sub: "GitHub contributions" },
    { label: "Developer Level", value: null, icon: <Star className="w-5 h-5 text-emerald-400" />, text: stats.googleExp, sub: "Google Dev Program" },
    { label: "Google Badges", value: stats.googleBadges, icon: <Award className="w-5 h-5 text-blue-300" />, sub: "Earned badges" },
  ];

  return (
    <section id="coding" ref={ref} className="py-24 bg-background relative overflow-hidden">
      <style>{`
        .custom-grid::-webkit-scrollbar {
          height: 6px;
        }
        .custom-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }
        .custom-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? "scroll-animate" : ""}`}>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
            Live Stats
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">Coding Journey</h2>
          <p className="text-muted-foreground">Daily consistency and continuous learning</p>
        </div>

        {/* Profile Links */}
        <div className={`flex flex-wrap justify-center gap-3 mb-10 ${revealStage >= 1 ? "scroll-animate" : "opacity-0"}`}>
          {[
            { href: LEETCODE_URL, icon: <LeetCodeIcon />, name: "LeetCode", handle: "BhavyaKansal20" },
            { href: GFG_URL, icon: <GfgIcon />, name: "GeeksforGeeks", handle: "kansalbhavya20" },
            { href: GITHUB_URL, icon: <Github className="w-5 h-5 text-white" />, name: "GitHub", handle: "BhavyaKansal20" },
            { href: GOOGLE_DEV_URL, icon: <GoogleIcon />, name: "Google Developer", handle: "kansalbhavya20" },
          ].map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="glass-card flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1f23] border border-white/8 hover:bg-[#2a2b30] hover:border-white/20 transition-all"
            >
              {p.icon}
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="text-xs text-gray-400">{p.handle}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const tilt = useTiltCard(8);
            return (
              <div
                key={s.label}
                ref={tilt.cardRef}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                className={`glass-card bg-[#1e1f23] rounded-2xl p-5 border border-white/5 flex flex-col justify-between transition-colors relative overflow-hidden ${revealStage >= 2 ? "scroll-animate" : "opacity-0"}`}
                style={revealStage >= 2 ? { animationDelay: `${statCards.indexOf(s) * 110}ms` } : undefined}
              >
                <div className="card-spotlight" ref={tilt.spotRef} />
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  {s.icon}
                </div>
                {s.text ? (
                  <p className="text-xl font-bold text-white truncate relative z-10">{s.text}</p>
                ) : (
                  <p className="text-3xl font-bold text-white relative z-10">
                    <AnimatedCount target={s.value ?? 0} isVisible={isVisible} />
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1 relative z-10">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Problem Breakdown — semi-circular gauge */}
          <div className={`bg-[#1e1f23] rounded-3xl p-6 border border-white/5 ${revealStage >= 4 ? "scroll-animate" : "opacity-0"}`} style={revealStage >= 4 ? { animationDelay: "60ms" } : undefined}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
              <Target className="w-5 h-5 text-gray-400" /> Problem Breakdown
            </h3>
            <div className="flex items-center justify-between gap-4 h-[180px]">
              <div className="flex-1 flex justify-center h-full items-center">
                <SemiCircleGauge
                  easy={stats.lcEasy}
                  medium={stats.lcMedium}
                  hard={stats.lcHard}
                  animate={revealStage >= 4}
                />
              </div>
              <div className="space-y-4 pr-6 flex-shrink-0">
                {[
                  { label: "Easy", val: stats.lcEasy, color: COLORS.Easy },
                  { label: "Medium", val: stats.lcMedium, color: COLORS.Medium },
                  { label: "Hard", val: stats.lcHard, color: COLORS.Hard },
                ].map((d, index) => (
                  <div key={d.label} className="flex items-center gap-2" style={{ opacity: revealStage >= 4 ? 1 : 0, transition: "opacity 360ms ease", transitionDelay: `${index * 120}ms` }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-sm font-medium text-gray-300">
                      {d.label}: <strong className="text-white font-bold">{d.val}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating Progress — line chart */}
          <div className={`bg-[#1e1f23] rounded-3xl p-6 border border-white/5 ${revealStage >= 3 ? "scroll-animate" : "opacity-0"}`} style={revealStage >= 3 ? { animationDelay: "80ms" } : undefined}>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
              <TrendingUp className="w-5 h-5 text-gray-400" /> Rating Progress
            </h3>
            {(() => {
              const hasData = stats.ratingHistory.length > 0;
              const chartData = hasData
                ? stats.ratingHistory
                : [
                    { label: "Jan", rating: 1400 },
                    { label: "Feb", rating: 1450 },
                    { label: "Mar", rating: 1350 },
                    { label: "Apr", rating: 1600 },
                    { label: "May", rating: 1680 },
                    { label: "Jun", rating: 1580 },
                    { label: "Jul", rating: 1720 },
                    { label: "Aug", rating: 1900 },
                    { label: "Sep", rating: 1980 },
                    { label: "Oct", rating: 1970 }
                  ];

              const maxVal = Math.max(...chartData.map((h: any) => h.rating || 0));
              const yMax = Math.max(2000, Math.ceil(maxVal / 500) * 500);
              const yDomain = [0, yMax];
              const yTicks = Array.from({ length: (yMax / 500) + 1 }, (_, i) => i * 500);

              return (
                <div className="relative">
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis
                        dataKey="label"
                        axisLine={{ stroke: "#3f444e", strokeWidth: 1 }}
                        tickLine={{ stroke: "#3f444e", strokeWidth: 1 }}
                        tick={{ fill: '#8a8f98', fontSize: 11, fontFamily: 'Times New Roman' }}
                      />
                      <YAxis
                        domain={yDomain}
                        ticks={yTicks}
                        axisLine={{ stroke: "#3f444e", strokeWidth: 1 }}
                        tickLine={{ stroke: "#3f444e", strokeWidth: 1 }}
                        tick={{ fill: '#8a8f98', fontSize: 11, fontFamily: 'Times New Roman' }}
                      />
                      <Tooltip content={<RatingTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#ffffff', stroke: '#1e1f23', strokeWidth: 1.5 }}
                        activeDot={{ r: 6, fill: '#ffffff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Developer Badges */}
        <div className={`bg-[#1e1f23] rounded-3xl p-6 border border-white/5 mb-6 ${revealStage >= 5 ? "scroll-animate" : "opacity-0"}`} style={revealStage >= 5 ? { animationDelay: "120ms" } : undefined}>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-5 text-white">
            <Award className="w-5 h-5 text-gray-400" /> Developer Badges Showcase
          </h3>
          <div className="grid grid-cols-4 gap-4 items-center justify-items-center">
            {[
              { src: "/badges/io-2026-registered.png", alt: "Google I/O 2026" },
              { src: "/badges/nvidia-community.png", alt: "NVIDIA Community" },
              { src: "/badges/io-2026-registered-circle.png", alt: "Google I/O Circle" },
              { src: "/badges/nvidia-community-circle.png", alt: "NVIDIA Community Circle" },
            ].map((b) => (
              <div key={b.alt} className="group relative">
                <img
                  src={b.src}
                  alt={b.alt}
                  className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Heatmap */}
        <div className={`bg-[#1e1f23] rounded-3xl p-6 md:p-8 border border-white/5 ${revealStage >= 6 ? "scroll-animate" : "opacity-0"}`} style={revealStage >= 6 ? { animationDelay: "140ms" } : undefined}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-white">
              <Github className="w-5 h-5" /> GitHub Contributions
            </h3>
          </div>
          <div className="custom-grid overflow-x-auto select-none py-2 pr-2">
            {githubLoading ? (
              <div className="h-[120px] flex items-center justify-center text-muted-foreground">
                Loading heatmap...
              </div>
            ) : (() => {
              const sorted = [...contributionValues].sort((a, b) => a.date.localeCompare(b.date));
              const getContributionLevel = (count: number) => {
                if (count === 0) return 0;
                if (count <= 2) return 1;
                if (count <= 5) return 2;
                if (count <= 8) return 3;
                return 4;
              };

              const getContributionColor = (level: number) => {
                switch (level) {
                  case 1: return "#9be9a8";
                  case 2: return "#40c463";
                  case 3: return "#30a14e";
                  case 4: return "#216e39";
                  default: return "#ebedf0";
                }
              };

              return (
                <div
                  className="grid grid-flow-col gap-[3px]"
                  style={{
                    gridTemplateRows: "repeat(7, 10px)",
                    gridAutoColumns: "10px",
                  }}
                >
                  {sorted.map((day) => {
                    const level = getContributionLevel(day.count);
                    const bgColor = getContributionColor(level);
                    return (
                      <div
                        key={day.date}
                        className="w-[10px] h-[10px] rounded-[2px] transition-all duration-150 hover:scale-125 cursor-pointer"
                        style={{ backgroundColor: bgColor }}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingDashboard;
