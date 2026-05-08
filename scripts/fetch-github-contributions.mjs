#!/usr/bin/env node
import fs from "fs";
import https from "https";

const user = process.argv[2] || process.env.VITE_GITHUB_USERNAME || "BhavyaKansal20";
const from = new Date();
from.setFullYear(from.getFullYear() - 1);
const to = new Date();

const url = `https://github.com/users/${user}/contributions?from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`;

https
  .get(url, (res) => {
    let html = "";
    res.on("data", (chunk) => {
      html += chunk;
    });

    res.on("end", () => {
      const idToDate = new Map();

      for (const m of html.matchAll(/<td[^>]*class=\"ContributionCalendar-day\"[^>]*>/g)) {
        const tag = m[0];
        const id = (tag.match(/id=\"([^\"]+)\"/) || [])[1];
        const date = (tag.match(/data-date=\"(\d{4}-\d{2}-\d{2})\"/) || [])[1];
        if (id && date) idToDate.set(id, date);
      }

      const countById = new Map();
      for (const m of html.matchAll(/<tool-tip[^>]*for=\"([^\"]+)\"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
        const id = m[1];
        const text = m[2].replace(/<[^>]*>/g, "").trim();
        let count = 0;
        const c = text.match(/(\d+) contribution/);
        if (c) count = Number(c[1]);
        countById.set(id, count);
      }

      const contributions = [];
      for (const [id, date] of idToDate.entries()) {
        contributions.push({ date, count: countById.get(id) ?? 0 });
      }
      contributions.sort((a, b) => a.date.localeCompare(b.date));

      const out = {
        source: "github-profile",
        username: user,
        fetchedAt: new Date().toISOString(),
        days: contributions.length,
        total: contributions.reduce((sum, x) => sum + x.count, 0),
        contributions,
      };

      fs.writeFileSync("public/github-contributions.json", JSON.stringify(out, null, 2));
      console.log(`Saved ${contributions.length} days (total ${out.total}) for ${user}`);
    });
  })
  .on("error", (e) => {
    console.error("Failed to fetch GitHub contributions:", e);
    process.exit(1);
  });
