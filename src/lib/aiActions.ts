/**
 * aiActions — lets AAGNI AI *do* things, not just talk.
 *
 * The model may append a single action block at the very end of its reply:
 *   <<ACTIONS>> goto:projects, open_resume <</ACTIONS>>
 *
 * We strip that block from the visible text and execute each verb below.
 * Supported verbs:
 *   goto:<section>        scroll to #about|#timeline|#projects|#coding|#faq|#contact|#hero
 *   open_resume           open the résumé PDF in a new tab
 *   open:<url>            open an external URL
 *   email[:primary|secondary]   compose an email
 *   github | linkedin | leetcode | gfg | google   open that profile
 *   theme:<dark|light|toggle>   switch colour theme
 */

export const PROFILE_LINKS = {
  github: "https://github.com/BhavyaKansal20",
  linkedin: "https://linkedin.com/in/bhavyakansal20",
  leetcode: "https://leetcode.com/u/BhavyaKansal20/",
  gfg: "https://www.geeksforgeeks.org/profile/kansalbhavya20",
  google: "https://g.dev/kansalbhavya20",
  resume: "/Bhavya-Kansal-Resume.pdf",
  emailPrimary: "kansalbhavya27@gmail.com",
  emailSecondary: "kansalbhavya20@icloud.com",
} as const;

export interface ActionContext {
  setTheme?: (t: string) => void;
}

export function extractActions(raw: string): { text: string; actions: string[] } {
  if (!raw) return { text: "", actions: [] };
  const match = raw.match(/<<\s*ACTIONS\s*>>([\s\S]*?)<<\s*\/\s*ACTIONS\s*>>/i);
  if (!match) return { text: raw.trim(), actions: [] };
  const actions = match[1]
    .split(/[,\n]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 4);
  const text = raw.replace(match[0], "").trim();
  return { text, actions };
}

const openTab = (url: string) => {
  if (typeof window !== "undefined") window.open(url, url.startsWith("/") || url.startsWith("mailto") ? "_self" : "_blank");
};

const scrollTo = (id: string) => {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
};

/** Executes one action verb; returns a short human label if something happened. */
export function runAction(action: string, ctx: ActionContext = {}): string | null {
  const a = action.trim().toLowerCase();

  if (a.startsWith("goto:")) {
    const id = a.slice(5).replace(/^#/, "");
    return scrollTo(id) ? `Jumped to ${id}` : null;
  }
  if (a === "open_resume" || a === "resume") {
    openTab(PROFILE_LINKS.resume);
    return "Opened résumé";
  }
  if (a.startsWith("open:")) {
    const url = action.slice(action.indexOf(":") + 1).trim();
    if (/^https?:\/\//i.test(url)) {
      openTab(url);
      return "Opened link";
    }
    return null;
  }
  if (a === "github" || a === "linkedin" || a === "leetcode" || a === "gfg" || a === "google") {
    openTab(PROFILE_LINKS[a as keyof typeof PROFILE_LINKS] as string);
    return `Opened ${a}`;
  }
  if (a.startsWith("email")) {
    const which = a.includes("secondary") ? PROFILE_LINKS.emailSecondary : PROFILE_LINKS.emailPrimary;
    openTab(`mailto:${which}`);
    return "Opened email";
  }
  if (a.startsWith("theme:")) {
    const mode = a.slice(6);
    if (ctx.setTheme) {
      if (mode === "toggle") {
        const isDark = document.documentElement.classList.contains("dark");
        ctx.setTheme(isDark ? "light" : "dark");
      } else if (mode === "dark" || mode === "light") {
        ctx.setTheme(mode);
      }
      return `Switched theme`;
    }
  }
  return null;
}

export function runActions(actions: string[], ctx: ActionContext = {}): string[] {
  return actions.map((a) => runAction(a, ctx)).filter((x): x is string => Boolean(x));
}
