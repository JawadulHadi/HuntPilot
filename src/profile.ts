import { readFileSync } from "node:fs";
import { parse } from "yaml";

export interface Variant {
  name: string;
  focus: string;
  keywords: string[];
}

export interface RubricArea {
  label: string;
  points: number;
  keywords: string[];
  /** Matches needed for full points. Fewer matches earn a proportional share. */
  need: number;
}

export interface HardFilter {
  name: string;
  /** Case-insensitive regular expression tested against the job description. */
  pattern: string;
}

export interface Profile {
  candidate: {
    name: string;
    title: string;
    years: number;
    core_stack: string[];
    timezone: string;
    working_hours: string;
    home_country: string;
    current_role: { employer: string; start: string };
    headline_metric: string;
    other_metrics: string[];
    case_study: { title: string; url: string };
    /** Optional extra public pages, written as "Label: URL". */
    links?: string[];
  };
  targeting: {
    roles: string[];
    region: string;
    variants: { A: Variant; B: Variant; C: Variant };
    target_companies: string[];
  };
  scoring: {
    areas: RubricArea[];
    hard_filters: HardFilter[];
    thresholds: { apply: number; referral: number };
  };
  tracker: { path: string; table: string };
  writing: {
    banned_words: string[];
    cover_letter_max_words: number;
    outreach_max_words: number;
  };
}

const REQUIRED_PATHS = [
  "candidate.name",
  "candidate.title",
  "candidate.years",
  "candidate.core_stack",
  "candidate.timezone",
  "candidate.headline_metric",
  "candidate.current_role.employer",
  "targeting.roles",
  "targeting.region",
  "targeting.variants.A.name",
  "targeting.variants.B.name",
  "targeting.variants.C.name",
  "scoring.areas",
  "scoring.thresholds.apply",
  "scoring.thresholds.referral",
  "tracker.path",
  "tracker.table",
];

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in (node as Record<string, unknown>)) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function validateProfile(raw: unknown): Profile {
  const missing = REQUIRED_PATHS.filter((p) => {
    const value = getPath(raw, p);
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
  });
  if (missing.length > 0) {
    throw new Error(`Profile is missing: ${missing.join(", ")}`);
  }
  const profile = raw as Profile;
  const { apply, referral } = profile.scoring.thresholds;
  if (referral > apply) {
    throw new Error("scoring.thresholds.referral must be at or below scoring.thresholds.apply");
  }
  const total = profile.scoring.areas.reduce((sum, a) => sum + a.points, 0);
  if (total !== 100) {
    throw new Error(`scoring.areas points must add up to 100 (they add up to ${total})`);
  }
  profile.scoring.hard_filters ??= [];
  profile.targeting.target_companies ??= [];
  profile.candidate.links ??= [];
  return profile;
}

export function loadProfile(file: string): Profile {
  return validateProfile(parse(readFileSync(file, "utf8")));
}
