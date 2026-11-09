import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadProfile } from "../src/profile.js";
import { formatResult, scoreJob } from "../src/score.js";

const readme = readFileSync("README.md", "utf8");

function section(title: string): string {
  const heading = `## ${title}\n`;
  expect(readme, `Missing README section: ${title}`).toContain(heading);
  return readme.split(heading)[1].split(/\n## /)[0];
}

describe("README formatting regressions", () => {
  it("keeps the feature table valid with two nonempty cells per row", () => {
    const rows = section("What it does").trim().split(/\r?\n/);
    const cells = rows.map((row) => {
      expect(row).toMatch(/^\|.*\|$/);
      return row.slice(1, -1).split("|").map((cell) => cell.trim());
    });

    expect(cells[0]).toEqual(["Mode", "What you get"]);
    expect(cells[1]).toHaveLength(2);
    for (const separator of cells[1]) expect(separator).toMatch(/^:?-{3,}:?$/);
    expect(cells.slice(2).map(([mode]) => mode)).toEqual([
      "Find jobs", "Analyse a JD", "Hard filters", "Tailor",
      "Referral first", "Write", "Interview prep", "Tracker",
    ]);
    for (const row of cells.slice(2)) {
      expect(row).toHaveLength(2);
      for (const cell of row) expect(cell).not.toBe("");
    }
  });

  it("preserves the documented scoring output and quoted hard-filter blocker", () => {
    const example = section("Scoring a job description").match(
      /```text\n\$ npm run score -- ([^\n]+)\n([\s\S]*?)\n```/,
    );
    expect(example).not.toBeNull();
    const profile = loadProfile("examples/profile.example.yaml");
    const result = scoreJob(readFileSync(example![1], "utf8"), profile);
    expect(example![2]).toBe(formatResult(result));
    // The explanatory paragraph promises that a hard filter overrides an Apply score.
    expect(result.score).toBeGreaterThanOrEqual(profile.scoring.thresholds.apply);
    expect(result.blockers.length).toBeGreaterThan(0);
    expect(result.verdict).toBe("Skip");
  });

  it.each([
    ["Scoring a job description", "docs/fit-scoring.md"],
    ["Safety rules built in", "docs/publishing.md"],
    ["License", "LICENSE"],
  ])("keeps the local reference in %s reachable", (heading, target) => {
    expect(section(heading)).toContain(`](${target})`);
    expect(statSync(target).isFile()).toBe(true);
  });

  it("keeps every documented repository directory on its own line", () => {
    const layout = section("Repository layout").match(/```text\n([\s\S]*?)\n```/);
    expect(layout).not.toBeNull();
    const rows = layout![1].split(/\r?\n/);
    expect(rows.map((row) => row.trim().split(/\s+/)[0])).toEqual([
      "templates/agent/", "examples/", "evals/", "src/", "tests/", "docs/",
    ]);
    for (const row of rows) {
      const entry = row.match(/^(\S+\/)\s+\S.*$/);
      expect(entry, `Missing directory description: ${row}`).not.toBeNull();
      expect(statSync(entry![1]).isDirectory()).toBe(true);
    }
    expect(layout![1]).toContain("{{profile.tokens}}");
  });

  it("keeps the license outside the centered footer and balances its HTML wrapper", () => {
    const license = section("License");
    const footer = license.match(/<div\s+align="center">([\s\S]*?)<\/div>/);
    expect(footer).not.toBeNull();
    expect(license.indexOf("](LICENSE)")).toBeLessThan(license.indexOf("<div"));
    expect(license.match(/<div\b/g)).toHaveLength(1);
    expect(license.match(/<\/div>/g)).toHaveLength(1);
    expect(footer![1]).toContain("[![Portfolio]");
  });
});
