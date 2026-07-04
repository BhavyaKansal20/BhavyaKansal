import { useEffect, useMemo, useState, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Github, Code2, Calendar, Award, Star, TrendingUp, Zap } from "lucide-react";

type ContributionDay = {
  date: string;
  count: number;
};

const LEETCODE_URL = "https://leetcode.com/u/BhavyaKansal20/";
const GFG_URL = "https://www.geeksforgeeks.org/profile/kansalbhavya20";
const GITHUB_URL = "https://github.com/BhavyaKansal20";
const GOOGLE_DEV_URL = "https://g.dev/kansalbhavya20";

const COLORS = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#ef4444",
};

// --- Icons ---
const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="#ffa116" className="w-5 h-5">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114l5.313-5.694a.458.458 0 0 1 .32-.146.458.458 0 0 1 .32.146l2.127 2.279c.54.58 1.455.61 2.035.069.58-.54.61-1.455.069-2.035l-2.127-2.28A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382H10.617z" />
  </svg>
);

const GfgIcon = () => (
  <svg viewBox="0 0 24 24" fill="#2f8d46" className="w-5 h-5">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.235 15.632l-3.308-3.308 1.258-1.258 2.05 2.05 4.885-4.885 1.258 1.258-6.143 6.143z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Level class for heatmap
const levelClass = (count: number) => {
  if (count >= 12) return "color-scale-4";
  if (count >= 8) return "color-scale-3";
  if (count >= 4) return "color-scale-2";
  if (count >= 1) return "color-scale-1";
  return "color-empty";
};

// Animated counter hook
function useCountUp(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible || target === 0) return;
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, isVisible, duration]);

  return count;
}

// Semi-circular donut chart custom
const SemiCircleChart = ({ easy, medium, hard }: { easy: number; medium: number; hard: number }) => {
  const total = easy + medium + hard || 1;
  const pieData = [
    { name: "Easy", value: easy },
    { name: "Medium", value: medium },
    { name: "Hard", value: hard },
  ].filter(d => d.value > 0);
  if (pieData.length === 0) pieData.push({ name: "Easy", value: 1 });

  return (
    <div className="w-[180px] h-[110px] relative flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={62}
            outerRadius={88}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            cornerRadius={5}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Easy} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-[10px] text-gray-400 font-medium">Solved</span>
      </div>
    </div>
  );
};

// Custom tooltip for rating chart
const RatingTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1b1f] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-bold">{Math.round(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CodingDashboard = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [githubLoading, setGithubLoading] = useState(true);
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  const [gfgData, setGfgData] = useState<any>(null);
  const [googleData, setGoogleData] = useState<any>(null);

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
        console.error("Error fetching GitHub data:", err);
      } finally {
        setGithubLoading(false);
      }
    };

    const fetchLeetCode = async () => {
      try {
        const res = await fetch(`/leetcode-profile.json?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setLeetcodeData(data);
        }
      } catch (err) {
        console.error("Error fetching LeetCode data:", err);
      }
    };

    const fetchGFG = async () => {
      try {
        const res = await fetch(`/gfg-profile.json?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setGfgData(data);
        }
      } catch (err) {
        console.error("Error fetching GFG data:", err);
      }
    };

    const fetchGoogle = async () => {
      try {
        const res = await fetch(`/google-profile.json?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setGoogleData(data);
        }
      } catch (err) {
        console.error("Error fetching Google Profile data:", err);
      }
    };

    fetchGithub();
    fetchLeetCode();
    fetchGFG();
    fetchGoogle();
  }, []);

  const stats = useMemo(() => {
    const activeDays = contributions.filter((d) => d.count > 0).length;

    let lcSolved = 0, lcEasy = 0, lcMedium = 0, lcHard = 0;
    if (leetcodeData?.matchedUser?.submitStats?.acSubmissionNum) {
      const s = leetcodeData.matchedUser.submitStats.acSubmissionNum;
      lcSolved = s.find((x: any) => x.difficulty === "All")?.count || 0;
      lcEasy   = s.find((x: any) => x.difficulty === "Easy")?.count || 0;
      lcMedium = s.find((x: any) => x.difficulty === "Medium")?.count || 0;
      lcHard   = s.find((x: any) => x.difficulty === "Hard")?.count || 0;
    }

    const gfgSolved = gfgData?.total_problems_solved || 0;
    const totalQuestions = lcSolved + gfgSolved;
    const googleBadges = googleData?.totalBadges || 0;
    const googleExp = googleData?.experience || "Developer";

    // Build rating history for chart
    const ratingHistory: { label: string; rating: number }[] = [];
    if (leetcodeData?.userContestRankingHistory?.length) {
      const attended = leetcodeData.userContestRankingHistory
        .filter((h: any) => h.attended && h.rating)
        .slice(-12); // last 12 contests

      attended.forEach((h: any) => {
        const d = new Date(h.contest.startTime * 1000);
        const label = d.toLocaleString("en-US", { month: "short" });
        ratingHistory.push({ label, rating: Math.round(h.rating) });
      });
    }

    // Fallback demo data if no contest history
    if (ratingHistory.length === 0 && lcSolved > 0) {
      const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
      months.forEach((m, i) => ratingHistory.push({ label: m, rating: 1500 + i * 80 }));
    }

    const currentRating = leetcodeData?.userContestRanking?.rating
      ? Math.round(leetcodeData.userContestRanking.rating)
      : ratingHistory.length > 0 ? ratingHistory[ratingHistory.length - 1].rating : 0;

    const globalRank = leetcodeData?.userContestRanking?.globalRanking || null;

    return {
      activeDays,
      totalQuestions,
      googleBadges,
      googleExp,
      lcEasy,
      lcMedium,
      lcHard,
      lcSolved,
      gfgSolved,
      ratingHistory,
      currentRating,
      globalRank,
    };
  }, [contributions, leetcodeData, gfgData, googleData]);

  // Animated counters
  const animTotal   = useCountUp(stats.totalQuestions, isVisible);
  const animDays    = useCountUp(stats.activeDays, isVisible);
  const animBadges  = useCountUp(stats.googleBadges, isVisible);
  const animRating  = useCountUp(stats.currentRating, isVisible);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const contributionValues = useMemo(
    () => contributions.map((entry) => ({ date: entry.date, count: entry.count })),
    [contributions]
  );

  // Y-axis domain for rating chart
  const ratingMin = stats.ratingHistory.length
    ? Math.max(0, Math.min(...stats.ratingHistory.map(r => r.rating)) - 100)
    : 0;
  const ratingMax = stats.ratingHistory.length
    ? Math.max(...stats.ratingHistory.map(r => r.rating)) + 100
    : 2200;

  return (
    <section id="coding" ref={ref} className="py-24 bg-background relative overflow-hidden">
      <style>{`
        /* Heatmap styles */
        .heatmap-wrap .react-calendar-heatmap { width: 100%; }
        .heatmap-wrap .react-calendar-heatmap .color-empty { fill: #1c1d21; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-1 { fill: #2a3a2a; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-2 { fill: #1d5c1d; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-3 { fill: #26a626; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-4 { fill: #39d353; }
        .heatmap-wrap .react-calendar-heatmap text { fill: rgb(166,173,187); font-size: 10px; }
        .heatmap-wrap .react-calendar-heatmap rect {
          rx: 2; ry: 2;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .heatmap-wrap .react-calendar-heatmap rect:hover {
          transform: scale(1.25);
          filter: brightness(1.4);
        }

        /* Recharts overrides */
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: rgba(255,255,255,0.04);
        }
        .recharts-dot { stroke: none !important; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-14 ${isVisible ? "scroll-animate" : ""}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 font-medium">Stats & Activity</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">Coding Journey</h2>
          <p className="text-gray-400 text-base">Daily consistency · Competitive programming · Open source</p>
        </div>

        {/* Profile Links */}
        <div className={`flex flex-wrap justify-center gap-3 mb-10 ${isVisible ? "scroll-animate" : ""}`}>
          {[
            { href: LEETCODE_URL, icon: <LeetCodeIcon />, label: "LeetCode", sub: "BhavyaKansal20" },
            { href: GFG_URL, icon: <GfgIcon />, label: "GeeksforGeeks", sub: "kansalbhavya20" },
            { href: GITHUB_URL, icon: <Github className="w-5 h-5 text-white" />, label: "GitHub", sub: "BhavyaKansal20" },
            { href: GOOGLE_DEV_URL, icon: <GoogleIcon />, label: "Google Dev", sub: "kansalbhavya20" },
          ].map(({ href, icon, label, sub }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#1a1b1f] border border-white/[0.06] hover:border-white/20 hover:bg-[#25262b] transition-all duration-200 shadow-sm"
            >
              {icon}
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{sub}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 ${isVisible ? "scroll-animate scroll-animate-delay-1" : ""}`}>
          {[
            { label: "Total Solved", value: animTotal, suffix: "", icon: <Code2 className="w-4 h-4 text-blue-400" />, glow: "blue" },
            { label: "Active Days", value: animDays, suffix: "", icon: <Calendar className="w-4 h-4 text-yellow-400" />, glow: "yellow" },
            { label: "Contest Rating", value: animRating, suffix: "", icon: <TrendingUp className="w-4 h-4 text-green-400" />, glow: "green" },
            { label: "Google Badges", value: animBadges, suffix: "", icon: <Award className="w-4 h-4 text-purple-400" />, glow: "purple" },
          ].map(({ label, value, suffix, icon, glow }) => (
            <div
              key={label}
              className="card-ripple relative overflow-hidden bg-[#1a1b1f] rounded-2xl p-5 border border-white/[0.06] hover:border-white/15 transition-all duration-200 group cursor-default"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                style={{ background: glow === "blue" ? "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 70%)" : glow === "yellow" ? "radial-gradient(circle at 50% 0%, rgba(234,179,8,0.08), transparent 70%)" : glow === "green" ? "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.08), transparent 70%)" : "radial-gradient(circle at 50% 0%, rgba(168,85,247,0.08), transparent 70%)" }}
              />
              <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">{label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white tabular-nums">{value}{suffix}</p>
                <div className="opacity-60">{icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row — matching screenshot design */}
        <div className={`grid md:grid-cols-2 gap-4 mb-5 ${isVisible ? "scroll-animate scroll-animate-delay-2" : ""}`}>

          {/* Problem Breakdown — Semi-circle donut */}
          <div className="bg-[#1a1b1f] rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 text-white">
              <span className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              </span>
              Problem Breakdown
            </h3>
            <div className="flex items-center justify-between gap-4">
              {/* Semi-circle chart */}
              <SemiCircleChart easy={stats.lcEasy} medium={stats.lcMedium} hard={stats.lcHard} />

              {/* Legend */}
              <div className="space-y-3 flex-1">
                {[
                  { label: "Easy", value: stats.lcEasy, color: "#22c55e" },
                  { label: "Medium", value: stats.lcMedium, color: "#f59e0b" },
                  { label: "Hard", value: stats.lcHard, color: "#ef4444" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm text-gray-300 font-medium">{label}</span>
                    </div>
                    <span className="text-white font-bold tabular-nums">{value}</span>
                  </div>
                ))}
                {stats.gfgSolved > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[#2f8d46]" />
                        <span className="text-sm text-gray-300 font-medium">GFG</span>
                      </div>
                      <span className="text-white font-bold tabular-nums">{stats.gfgSolved}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rating Progress — Line chart */}
          <div className="bg-[#1a1b1f] rounded-2xl p-6 border border-white/[0.06]">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 text-white">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              Rating Progress
              {stats.currentRating > 0 && (
                <span className="ml-auto text-xs text-gray-400 font-normal">
                  Current: <span className="text-white font-semibold">{stats.currentRating}</span>
                </span>
              )}
            </h3>
            {stats.ratingHistory.length > 0 ? (
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.ratingHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "rgb(166,173,187)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[ratingMin, ratingMax]}
                      tick={{ fill: "rgb(166,173,187)", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickCount={4}
                    />
                    <Tooltip content={<RatingTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#e2e8f0"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#e2e8f0", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#fff", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[140px] flex flex-col items-center justify-center gap-2">
                <Zap className="w-8 h-8 text-gray-600" />
                <p className="text-gray-500 text-sm">No contest data yet</p>
                <a href={LEETCODE_URL} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                  Join a LeetCode contest →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Developer Badges Showcase */}
        <div className={`bg-[#1a1b1f] rounded-2xl p-6 border border-white/[0.06] mb-5 ${isVisible ? "scroll-animate scroll-animate-delay-2" : ""}`}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-5 text-white">
            <Award className="w-4 h-4 text-gray-400" />
            Developer Badges Showcase
            <span className="ml-auto text-xs text-gray-500 font-normal">{stats.googleBadges} total</span>
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 items-center justify-items-center">
            {[
              { src: "/badges/io-2026-registered.png", alt: "Google I/O 2026" },
              { src: "/badges/nvidia-community.png", alt: "Nvidia Community" },
              { src: "/badges/io-2026-registered-circle.png", alt: "Google I/O Circle" },
              { src: "/badges/nvidia-community-circle.png", alt: "Nvidia Circle" },
            ].map(({ src, alt }) => (
              <div key={alt} className="group relative">
                <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-110" />
                <img
                  src={src}
                  alt={alt}
                  className="w-14 h-14 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200 cursor-pointer relative z-10"
                />
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Heatmap */}
        <div className={`bg-[#1a1b1f] rounded-2xl p-6 md:p-8 border border-white/[0.06] ${isVisible ? "scroll-animate scroll-animate-delay-3" : ""}`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
              <Github className="w-4 h-4 text-gray-400" />
              GitHub Contributions
            </h3>
            {stats.activeDays > 0 && (
              <span className="text-xs text-gray-500">
                <span className="text-green-400 font-semibold">{stats.activeDays}</span> active days this year
              </span>
            )}
          </div>
          <div className="heatmap-wrap overflow-x-auto">
            {githubLoading ? (
              <div className="h-[120px] flex items-center justify-center">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-sm bg-gray-700 animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={contributionValues}
                classForValue={(value) => levelClass(value?.count || 0)}
                showWeekdayLabels
                showMonthLabels
                tooltipDataAttrs={(value: any) => ({
                  "data-tip": value?.date
                    ? `${value.date}: ${value.count || 0} contributions`
                    : "No contributions",
                })}
              />
            )}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-xs text-gray-500">Less</span>
            {["#1c1d21", "#2a3a2a", "#1d5c1d", "#26a626", "#39d353"].map((c) => (
              <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
            ))}
            <span className="text-xs text-gray-500">More</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingDashboard;
