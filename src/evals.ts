import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { fill } from "./render.js";
import type { Profile } from "./profile.js";

export interface EvalCase {
  id: string;
  area: string;
  critical: boolean;
  prompt: string;
  pass_when: string;
}

export function loadCases(file: string): EvalCase[] {
  const data = parse(readFileSync(file, "utf8")) as { cases: EvalCase[] };
  return data.cases;
}

/** A markdown checklist to run by hand against the deployed agent, with the profile filled in. */
export function casesToChecklist(cases: EvalCase[], profile: Profile): string {
  const rows = cases.map(
    (c) => `| [ ] | ${c.id} | ${c.critical ? "Yes" : ""} | ${fill(c.prompt, profile)} | ${fill(c.pass_when, profile)} |`,
  );
  return [
    "# HuntPilot test run",
    "",
    "Run each prompt in the deployed agent. Tick the box when the answer meets the pass rule.",
    "Go live only when every critical case passes and no more than 2 others fail.",
    "",
    "| Pass | ID | Critical | Prompt | Passes when |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}
