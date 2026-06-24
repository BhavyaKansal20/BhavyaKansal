import { useEffect, useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Github, Code2, Calendar, Award, Star } from "lucide-react";

type ContributionDay = {
  date: string;
  count: number;
};

const LEETCODE_URL = "https://leetcode.com/u/BhavyaKansal20/";
const GFG_URL = "https://www.geeksforgeeks.org/profile/kansalbhavya20";
const GITHUB_URL = "https://github.com/BhavyaKansal20";
const GOOGLE_DEV_URL = "https://g.dev/kansalbhavya20";

// Recharts colors
const COLORS = {
  Easy: "#22c55e", // green-500
  Medium: "#f59e0b", // amber-500
  Hard: "#ef4444" // red-500
};

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
  const [googleData, setGoogleData] = useState<any>(null);

  useEffect(() => {
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

    let lcSolved = 0;
    let lcEasy = 0;
    let lcMedium = 0;
    let lcHard = 0;

    if (leetcodeData?.matchedUser?.submitStats?.acSubmissionNum) {
      const stats = leetcodeData.matchedUser.submitStats.acSubmissionNum;
      lcSolved = stats.find((s: any) => s.difficulty === "All")?.count || 0;
      lcEasy = stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
      lcMedium = stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
      lcHard = stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
    }

    const gfgSolved = gfgData?.total_problems_solved || 0;
    const totalQuestions = lcSolved + gfgSolved;

    const pieData = [
      { name: "Easy", value: lcEasy },
      { name: "Medium", value: lcMedium },
      { name: "Hard", value: lcHard }
    ].filter(d => d.value > 0);

    if (pieData.length === 0) pieData.push({ name: "Easy", value: 1 });

    const googleBadges = googleData?.totalBadges || 0;
    const googleExp = googleData?.experience || "Developer";

    return {
      activeDays,
      totalQuestions,
      googleBadges,
      googleExp,
      pieData,
      lcEasy,
      lcMedium,
      lcHard
    };
  }, [contributions, leetcodeData, gfgData, googleData]);

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
        .heatmap-wrap .react-calendar-heatmap .color-empty { fill: #202022; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-1 { fill: #39393d; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-2 { fill: #525259; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-3 { fill: #8a8a93; }
        .heatmap-wrap .react-calendar-heatmap .color-scale-4 { fill: #e1e1e6; }
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
          <a href={LEETCODE_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1f23] border border-white/5 hover:bg-[#2a2b30] transition-colors">
            <LeetCodeIcon />
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-white">LeetCode</div>
              <div className="text-xs text-gray-400">BhavyaKansal20</div>
            </div>
          </a>
          <a href={GFG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1f23] border border-white/5 hover:bg-[#2a2b30] transition-colors">
            <GfgIcon />
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-white">GeeksforGeeks</div>
              <div className="text-xs text-gray-400">kansalbhavya20</div>
            </div>
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1f23] border border-white/5 hover:bg-[#2a2b30] transition-colors">
            <Github className="w-5 h-5 text-white" />
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-white">GitHub</div>
              <div className="text-xs text-gray-400">BhavyaKansal20</div>
            </div>
          </a>
          <a href={GOOGLE_DEV_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1f23] border border-white/5 hover:bg-[#2a2b30] transition-colors">
            <GoogleIcon />
            <div className="text-left leading-tight">
              <div className="text-sm font-semibold text-white">Google Developer</div>
              <div className="text-xs text-gray-400">kansalbhavya20</div>
            </div>
          </a>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ${isVisible ? "scroll-animate scroll-animate-delay-1" : ""}`}>
          <div className="bg-[#1e1f23] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Total Questions Solved</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
              <Code2 className="w-5 h-5 text-blue-500 mb-1 opacity-70" />
            </div>
          </div>
          <div className="bg-[#1e1f23] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Total Active Days</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.activeDays}</p>
              <Calendar className="w-5 h-5 text-yellow-500 mb-1 opacity-70" />
            </div>
          </div>
          <div className="bg-[#1e1f23] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Developer Level</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xl font-bold text-white truncate max-w-[80%]">{stats.googleExp}</p>
              <Star className="w-5 h-5 text-emerald-500 mb-1 opacity-70 shrink-0" />
            </div>
          </div>
          <div className="bg-[#1e1f23] rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
            <p className="text-xs text-gray-400 font-medium mb-1">Google Badges</p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-3xl font-bold text-white">{stats.googleBadges}</p>
              <Award className="w-5 h-5 text-blue-400 mb-1 opacity-70" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={`grid md:grid-cols-2 gap-6 mb-6 ${isVisible ? "scroll-animate scroll-animate-delay-2" : ""}`}>
          <div className="bg-[#1e1f23] rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
              <Code2 className="w-5 h-5 text-gray-400" /> Problem Breakdown
            </h3>
            <div className="flex items-center justify-between">
              <div className="w-[200px] h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Easy} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mr-4">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    <span className="text-sm font-medium text-gray-300">Easy</span>
                  </div>
                  <span className="text-white font-bold">{stats.lcEasy}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                    <span className="text-sm font-medium text-gray-300">Medium</span>
                  </div>
                  <span className="text-white font-bold">{stats.lcMedium}</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                    <span className="text-sm font-medium text-gray-300">Hard</span>
                  </div>
                  <span className="text-white font-bold">{stats.lcHard}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e1f23] rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-white">
              <Award className="w-5 h-5 text-gray-400" /> Developer Badges Showcase
            </h3>
            <div className="grid grid-cols-4 gap-4 h-[120px] items-center justify-items-center">
              <div className="group relative">
                <img src="/badges/io-2026-registered.png" alt="Google I/O" className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <div className="group relative">
                <img src="/badges/nvidia-community.png" alt="Nvidia" className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <div className="group relative">
                <img src="/badges/io-2026-registered-circle.png" alt="Google I/O Circle" className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform cursor-pointer" />
              </div>
              <div className="group relative">
                <img src="/badges/nvidia-community-circle.png" alt="Nvidia Circle" className="w-16 h-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Heatmap */}
        <div className={`bg-[#1e1f23] rounded-3xl p-6 md:p-8 border border-white/5 ${isVisible ? "scroll-animate scroll-animate-delay-3" : ""}`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-xl font-bold flex items-center gap-3 text-white">
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
