import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { checkOutput, checkText } from "../src/check.js";
import { loadProfile } from "../src/profile.js";
import { fill, loadAgent, PLATFORMS, renderPlatform, stripFrontMatter } from "../src/render.js";

const profile = loadProfile("examples/profile.example.yaml");

describe("fill", () => {
  it("replaces dotted paths and joins lists", () => {
    expect(fill("{{candidate.name}} uses {{candidate.core_stack}}", profile)).toBe(
      `${profile.candidate.name} uses ${profile.candidate.core_stack.join(", ")}`,
    );
  });

  it("leaves unknown tokens for check to report", () => {
    expect(fill("{{candidate.nickname}}", profile)).toBe("{{candidate.nickname}}");
  });
});

describe("render and check", () => {
  const out = mkdtempSync(join(tmpdir(), "huntpilot-"));
  const agent = loadAgent("templates/agent", profile);
  for (const p of PLATFORMS) renderPlatform(agent, p, out);

  it("renders every template with no findings", () => {
    expect(checkOutput(out, profile.writing.banned_words)).toEqual([]);
  });

  it("keeps skill front matter for Copilot Studio only", () => {
    const skill = readFileSync(join(out, "copilot-studio", "skill-job-discovery.md"), "utf8");
    const playbook = readFileSync(join(out, "claude-project", "skills-playbook.md"), "utf8");
    expect(skill.startsWith("---\nname: job-discovery")).toBe(true);
    expect(playbook).not.toContain("name: job-discovery");
  });

  it("strips only the leading front matter", () => {
    expect(stripFrontMatter("---\nname: x\n---\n\n# Body\n---\nmore")).toBe("# Body\n---\nmore");
  });
});

describe("checkText", () => {
  it("flags placeholders and banned words, but not the banned-words list itself", () => {
    const text = "Banned words: leverage\nHi {{candidate.name}}, we leverage AI.";
    const findings = checkText("x.md", text, ["leverage"]);
    expect(findings.map((f) => f.level)).toEqual(["error", "warning"]);
  });
});
