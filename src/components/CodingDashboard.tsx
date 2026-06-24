import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Github, Code2, Calendar, TrendingUp, Trophy, ArrowUpRight } from "lucide-react";

type ContributionDay = {
  date: string;
  count: number;
};

const GITHUB_USER = "BhavyaKansal20";
const LEETCODE_URL = "https://leetcode.com/u/BhavyaKansal20/";
const GFG_URL = "https://www.geeksforgeeks.org/profile/kansalbhavya20";
const GITHUB_URL = "https://github.com/BhavyaKansal20";

// Recharts colors
const COLORS = {
  Easy: "#00b8a3", // Leetcode Easy
  Medium: "#ffc01e", // Leetcode Medium
  Hard: "#ef4743" // Leetcode Hard
};

const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114l5.313-5.694a.458.458 0 0 1 .32-.146.458.458 0 0 1 .32.146l2.127 2.279c.54.58 1.455.61 2.035.069.58-.54.61-1.455.069-2.035l-2.127-2.28A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382H10.617z"/>
  </svg>
);

const GfgIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.235 15.632l-3.308-3.308 1.258-1.258 2.05 2.05 4.885-4.885 1.258 1.258-6.143 6.143z"/>
  </svg>
);

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
  const [githubLoading, setGithubLoading] = useState(true);
  
  const [leetcodeData, setLeetcodeData] = useState<any>(null);
  const [gfgData, setGfgData] = useState<any>(null);

  useEffect(() => {
    // Fetch GitHub Contributions
    const fetchGithub = async () => {
      setGithubLoading(true);
      try {
        const res = await fetch(`/github-contributions.json?ts=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.contributions) {
            setContributions(data.contributions);
          }
        }
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
      } finally {
        setGithubLoading(false);
      }
    };

    // Fetch LeetCode Data
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

    // Fetch GFG Data
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

    fetchGithub();
    fetchLeetCode();
    fetchGFG();
  }, []);

  // Compute metrics
  const stats = useMemo(() => {
    // Days Active (from GitHub)
    const activeDays = contributions.filter((d) => d.count > 0).length;

    // LeetCode Solved
    let lcSolved = 0;
    let lcEasy = 0;
    let lcMedium = 0;
    let lcHard = 0;
    let contestRating = 0;
    let contestBadge = "None";

    if (leetcodeData?.matchedUser?.submitStats?.acSubmissionNum) {
      const stats = leetcodeData.matchedUser.submitStats.acSubmissionNum;
      lcSolved = stats.find((s: any) => s.difficulty === "All")?.count || 0;
      lcEasy = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
      lcMedium = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
      lcHard = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
    }

    if (leetcodeData?.userContestRanking) {
      contestRating = Math.round(leetcodeData.userContestRanking.rating || 0);
      contestBadge = leetcodeData.userContestRanking.badge?.name || "None";
    }

    // GFG Solved
    const gfgSolved = gfgData?.total_problems_solved || 0;

    const totalQuestions = lcSolved + gfgSolved;

    // Pie Chart Data
    const pieData = [
      { name: "Easy", value: lcEasy },
      { name: "Medium", value: lcMedium },
      { name: "Hard", value: lcHard }
    ].filter(d => d.value > 0);

    // Default pie data if empty
    if (pieData.length === 0) pieData.push({ name: "Easy", value: 1 });

    // Line Chart Data
    let ratingHistory: any[] = [];
    if (leetcodeData?.userContestRankingHistory) {
      const history = leetcodeData.userContestRankingHistory.filter((h: any) => h.attended);
      ratingHistory = history.map((h: any) => ({
        name: new Date(h.contest.startTime * 1000).toLocaleDateString("en-US", { month: "short" }),
        rating: Math.round(h.rating)
      }));
    }

    // Default rating data if empty to show the graph beautifully
    if (ratingHistory.length === 0) {
      ratingHistory = [
        { name: "Jan", rating: 1500 },
        { name: "Feb", rating: 1500 }
      ];
    }

    return {
      activeDays,
      totalQuestions,
      contestRating,
      contestBadge,
      pieData,
      ratingHistory,
      lcEasy,
      lcMedium,
      lcHard
    };
  }, [contributions, leetcodeData, gfgData]);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const contributionValues = useMemo(
    () => contributions.map((entry) => ({ date: entry.date, count: entry.count })),
    [contributions]
  );

  return (
    <section id="coding" ref={ref} className="py-24 bg-background relative overflow-hidden">
      <style>{`
        .heatmap-wrap .react-calendar-heatmap { width: 100%; }
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

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center mb-12 ${isVisible ? "scroll-animate" : ""}`}>
          <h2 className="text-4xl font-bold mb-3">Coding Journey</h2>
          <p className="text-muted-foreground">Daily consistency and continuous learning</p>
        </div>

        {/* Profile Links */}
        <div className={`flex flex-wrap justify-center gap-4 mb-10 ${isVisible ? "scroll-animate" : ""}`}>
          <a href={LEETCODE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202020] border border-white/5 hover:bg-[#2a2a2a] transition-colors">
            <LeetCodeIcon />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">LeetCode</div>
              <div className="text-sm font-medium">BhavyaKansal20</div>
            </div>
          </a>
          <a href={GFG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202020] border border-white/5 hover:bg-[#2a2a2a] transition-colors">
            <GfgIcon />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-green-500 font-semibold uppercase tracking-wider">GeeksforGeeks</div>
              <div className="text-sm font-medium">kansalbhavya20</div>
            </div>
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#202020] border border-white/5 hover:bg-[#2a2a2a] transition-colors">
            <Github className="w-5 h-5" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">GitHub</div>
              <div className="text-sm font-medium">BhavyaKansal20</div>
            </div>
          </a>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ${isVisible ? "scroll-animate scroll-animate-delay-1" : ""}`}>
          <div className="bg-[#1f2023] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Total Questions Solved</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
              <Code2 className="w-5 h-5 text-blue-500 mb-1" />
            </div>
          </div>
          <div className="bg-[#1f2023] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Total Active Days</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.activeDays}</p>
              <Calendar className="w-5 h-5 text-yellow-500 mb-1" />
            </div>
          </div>
          <div className="bg-[#1f2023] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Contest Badge</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-2xl font-bold text-white">{stats.contestBadge}</p>
              <Trophy className="w-5 h-5 text-green-500 mb-1" />
            </div>
          </div>
          <div className="bg-[#1f2023] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Contest Rating</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.contestRating}</p>
              <TrendingUp className="w-5 h-5 text-green-400 mb-1" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={`grid md:grid-cols-2 gap-6 mb-6 ${isVisible ? "scroll-animate scroll-animate-delay-2" : ""}`}>
          <div className="bg-[#1f2023] rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Code2 className="w-5 h-5" /> Problem Breakdown
            </h3>
            <div className="flex items-center">
              <div className="w-[180px] h-[180px] -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Easy} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-auto space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#00b8a3]" />
                  <span className="text-sm font-medium text-gray-300">Easy: <span className="text-white ml-1">{stats.lcEasy}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ffc01e]" />
                  <span className="text-sm font-medium text-gray-300">Medium: <span className="text-white ml-1">{stats.lcMedium}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#ef4743]" />
                  <span className="text-sm font-medium text-gray-300">Hard: <span className="text-white ml-1">{stats.lcHard}</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1f2023] rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" /> Rating Progress
            </h3>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.ratingHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{fill: '#666', fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{fill: '#666', fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2023', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="rating" stroke="#fff" strokeWidth={2} dot={{ fill: '#fff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* GitHub Heatmap */}
        <div className={`bg-[#1f2023] rounded-3xl p-6 md:p-8 border border-white/5 ${isVisible ? "scroll-animate scroll-animate-delay-3" : ""}`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Github className="w-5 h-5" /> GitHub Contributions
            </h3>
          </div>
          <div className="heatmap-wrap overflow-x-auto">
            {githubLoading ? (
              <div className="h-[120px] flex items-center justify-center text-muted-foreground">Loading heatmap...</div>
            ) : (
              <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={contributionValues}
                classForValue={(value) => levelClass(value?.count || 0)}
                showWeekdayLabels
                showMonthLabels
                tooltipDataAttrs={(value: any) => ({
                  "data-tip": value?.date ? `${value.date}: ${value.count || 0} contributions` : "No contributions",
                })}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingDashboard;
