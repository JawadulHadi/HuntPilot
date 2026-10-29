import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { mentions } from "./score.js";

export interface Finding {
  file: string;
  level: "error" | "warning";
  message: string;
}

/** Instruction field limits. Both platforms cap instructions at 8,000 characters. */
export const INSTRUCTION_LIMITS: Record<string, number> = {
  "copilot-studio": 8000,
  "custom-gpt": 8000,
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

export function checkText(file: string, text: string, bannedWords: string[]): Finding[] {
  const findings: Finding[] = [];
  const leftovers = text.match(/\{\{\s*[a-zA-Z0-9_.]+\s*\}\}/g);
  if (leftovers) {
    findings.push({ file, level: "error", message: `Unfilled placeholders: ${[...new Set(leftovers)].join(", ")}` });
  }
  const bannedLine = /banned words?:/i;
  // The line that lists the banned words is the one place they're allowed.
  const body = text.split("\n").filter((l) => !bannedLine.test(l)).join("\n");
  const banned = bannedWords.filter((w) => mentions(body, w));
  if (banned.length > 0) {
    findings.push({ file, level: "warning", message: `Uses banned words: ${banned.join(", ")}` });
  }
  return findings;
}

/** Checks rendered output under outDir: placeholders, banned words and instruction length per platform. */
export function checkOutput(outDir: string, bannedWords: string[]): Finding[] {
  const findings: Finding[] = [];
  for (const path of walk(outDir).filter((p) => p.endsWith(".md"))) {
    const text = readFileSync(path, "utf8");
    const file = relative(outDir, path);
    findings.push(...checkText(file, text, bannedWords));
    const [platform, name] = file.split(/[\\/]/);
    const limit = INSTRUCTION_LIMITS[platform];
    if (name === "instructions.md" && limit && text.length > limit) {
      findings.push({ file, level: "error", message: `Instructions are ${text.length} characters; ${platform} allows ${limit}` });
    }
  }
  return findings;
}
