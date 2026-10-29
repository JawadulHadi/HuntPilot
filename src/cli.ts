#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { checkOutput } from "./check.js";
import { casesToChecklist, loadCases } from "./evals.js";
import { loadProfile } from "./profile.js";
import { loadAgent, PLATFORMS, renderPlatform, type Platform } from "./render.js";
import { formatResult, scoreJob } from "./score.js";
import { buildTracker } from "./tracker.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const HELP = `HuntPilot: a referral-first job search copilot

Usage: huntpilot <command> [options]

Commands:
  render   Fill the agent templates with your profile, one folder per platform
  check    Check rendered files for unfilled placeholders, banned words and length limits
  score    Pre-score a job description file against your profile
  tracker  Create the Excel tracker (table "Applications", key column "ID")
  evals    Write the test checklist for your profile

Options:
  -p, --profile <file>   Profile YAML (default: profile.yaml, else examples/profile.example.yaml)
  -o, --out <dir>        Output folder (default: out)
  --platform <name>      ${PLATFORMS.join(" | ")} (render only; default: all)
  --json                 Print the score as JSON (score only)
  -h, --help             Show this help
`;

function defaultProfile(): string {
  try {
    readFileSync("profile.yaml");
    return "profile.yaml";
  } catch {
    return join(ROOT, "examples", "profile.example.yaml");
  }
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      profile: { type: "string", short: "p" },
      out: { type: "string", short: "o", default: "out" },
      platform: { type: "string" },
      json: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  const [command, arg] = positionals;
  if (values.help || !command) {
    console.log(HELP);
    return 0;
  }

  const profilePath = values.profile ?? defaultProfile();
  const out = values.out!;

  switch (command) {
    case "render": {
      const profile = loadProfile(profilePath);
      const agent = loadAgent(join(ROOT, "templates", "agent"), profile);
      const platforms = values.platform ? [values.platform as Platform] : PLATFORMS;
      for (const p of platforms) {
        if (!PLATFORMS.includes(p)) throw new Error(`Unknown platform "${p}"`);
        for (const file of renderPlatform(agent, p, out)) console.log(`wrote ${file}`);
      }
      return 0;
    }
    case "check": {
      const profile = loadProfile(profilePath);
      const findings = checkOutput(out, profile.writing.banned_words);
      for (const f of findings) console.log(`${f.level.toUpperCase()} ${f.file}: ${f.message}`);
      const errors = findings.filter((f) => f.level === "error").length;
      console.log(errors ? `${errors} error(s)` : "All checks passed");
      return errors ? 1 : 0;
    }
    case "score": {
      if (!arg) throw new Error("Give a job description file: huntpilot score jd.txt");
      const result = scoreJob(readFileSync(arg, "utf8"), loadProfile(profilePath));
      console.log(values.json ? JSON.stringify(result, null, 2) : formatResult(result));
      return 0;
    }
    case "tracker": {
      mkdirSync(out, { recursive: true });
      const file = join(out, "JobTracker.xlsx");
      await buildTracker(file);
      console.log(`wrote ${file}`);
      return 0;
    }
    case "evals": {
      const profile = loadProfile(profilePath);
      mkdirSync(out, { recursive: true });
      const file = join(out, "test-run.md");
      writeFileSync(file, casesToChecklist(loadCases(join(ROOT, "evals", "cases.yaml")), profile));
      console.log(`wrote ${file}`);
      return 0;
    }
    default:
      console.error(`Unknown command "${command}"\n`);
      console.log(HELP);
      return 1;
  }
}

main().then(
  (code) => process.exit(code),
  (err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  },
);
