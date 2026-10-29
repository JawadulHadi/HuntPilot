import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getPath, type Profile } from "./profile.js";

export type Platform = "copilot-studio" | "claude-project" | "custom-gpt";
export const PLATFORMS: Platform[] = ["copilot-studio", "claude-project", "custom-gpt"];

const TOKEN = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

function asText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.length ? value.map(String).join(", ") : "none listed";
  return String(value);
}

/** Replaces {{dotted.path}} tokens with profile values. Unknown tokens are left in place for `check` to report. */
export function fill(template: string, profile: Profile): string {
  return template.replace(TOKEN, (token, path: string) => asText(getPath(profile, path)) ?? token);
}

export interface AgentFiles {
  instructions: string;
  skills: { name: string; body: string }[];
  prompts: string;
}

export function loadAgent(templateDir: string, profile: Profile): AgentFiles {
  const read = (rel: string) => fill(readFileSync(join(templateDir, rel), "utf8"), profile);
  const skillDir = join(templateDir, "skills");
  const skills = readdirSync(skillDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ name: f.replace(/\.md$/, ""), body: read(join("skills", f)) }));
  return { instructions: read("instructions.md"), skills, prompts: read("prompts.md") };
}

/** Drops the YAML front matter, for platforms that take skills as plain knowledge text. */
export function stripFrontMatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---\n+/, "");
}

export function renderPlatform(agent: AgentFiles, platform: Platform, outDir: string): string[] {
  const dir = join(outDir, platform);
  mkdirSync(dir, { recursive: true });
  const written: string[] = [];
  const write = (name: string, body: string) => {
    writeFileSync(join(dir, name), body.endsWith("\n") ? body : `${body}\n`);
    written.push(join(dir, name));
  };

  write("instructions.md", agent.instructions);
  write("suggested-prompts.md", agent.prompts);

  if (platform === "copilot-studio") {
    // Copilot Studio skills keep their front matter: name and description decide when they trigger.
    for (const s of agent.skills) write(`skill-${s.name}.md`, s.body);
  } else {
    // Claude Projects and custom GPTs read skills as one knowledge file.
    const playbook = agent.skills
      .map((s) => stripFrontMatter(s.body).trim())
      .join("\n\n---\n\n");
    write("skills-playbook.md", playbook);
  }
  return written;
}
