import type { Profile, RubricArea } from "./profile.js";

export type Verdict = "Apply" | "Referral first" | "Skip";

export interface AreaScore {
  label: string;
  points: number;
  max: number;
  matched: string[];
}

export interface FitResult {
  score: number;
  verdict: Verdict;
  variant: "A" | "B" | "C";
  areas: AreaScore[];
  blockers: { filter: string; line: string }[];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word, case-insensitive keyword match. "Node.js" and "C#" style tokens are matched literally. */
export function mentions(text: string, keyword: string): boolean {
  const re = new RegExp(`(^|[^a-z0-9])${escape(keyword.toLowerCase())}($|[^a-z0-9])`, "i");
  return re.test(text.toLowerCase());
}

function scoreArea(text: string, area: RubricArea): AreaScore {
  const matched = area.keywords.filter((k) => mentions(text, k));
  const share = Math.min(matched.length / Math.max(area.need, 1), 1);
  return { label: area.label, points: Math.round(area.points * share), max: area.points, matched };
}

function findBlockers(text: string, profile: Profile): FitResult["blockers"] {
  const lines = text.split(/\r?\n/);
  const blockers: FitResult["blockers"] = [];
  for (const filter of profile.scoring.hard_filters) {
    const re = new RegExp(filter.pattern, "i");
    const line = lines.find((l) => re.test(l));
    if (line) blockers.push({ filter: filter.name, line: line.trim() });
  }
  return blockers;
}

function pickVariant(text: string, profile: Profile): "A" | "B" | "C" {
  const { variants } = profile.targeting;
  const ranked = (["A", "B", "C"] as const)
    .map((key) => ({ key, hits: variants[key].keywords.filter((k) => mentions(text, k)).length }))
    .sort((x, y) => y.hits - x.hits);
  // Ties keep the A, B, C order, so the lead variant wins when nothing stands out.
  return ranked[0].key;
}

function companyIsTarget(text: string, profile: Profile): boolean {
  return profile.targeting.target_companies.some((c) => mentions(text, c));
}

/**
 * A deterministic pre-score for a job description. The agent does the real reading;
 * this gives the same answer every time, so you can compare roles and catch blockers fast.
 */
export function scoreJob(text: string, profile: Profile): FitResult {
  const areas = profile.scoring.areas.map((a) => scoreArea(text, a));
  const score = areas.reduce((sum, a) => sum + a.points, 0);
  const blockers = findBlockers(text, profile);
  const { apply, referral } = profile.scoring.thresholds;

  let verdict: Verdict;
  if (blockers.length > 0 || score < referral) verdict = "Skip";
  else if (score >= apply && !companyIsTarget(text, profile)) verdict = "Apply";
  else verdict = "Referral first";

  return { score, verdict, variant: pickVariant(text, profile), areas, blockers };
}

export function formatResult(result: FitResult): string {
  const rows = result.areas.map(
    (a) => `| ${a.label} | ${a.points}/${a.max} | ${a.matched.join(", ") || "none"} |`,
  );
  const blockers = result.blockers.length
    ? result.blockers.map((b) => `- ${b.filter}: "${b.line}"`).join("\n")
    : "- none";
  return [
    `Score: ${result.score}/100   Verdict: ${result.verdict}   Variant: ${result.variant}`,
    "",
    "| Area | Points | Matched |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "Blockers:",
    blockers,
  ].join("\n");
}
