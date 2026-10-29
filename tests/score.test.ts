import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadProfile } from "../src/profile.js";
import { mentions, scoreJob } from "../src/score.js";

const profile = loadProfile("examples/profile.example.yaml");
const jd = (name: string) => readFileSync(`tests/fixtures/${name}`, "utf8");

describe("mentions", () => {
  it("matches whole words only", () => {
    expect(mentions("We use Redis daily", "redis")).toBe(true);
    expect(mentions("rediscover your career", "redis")).toBe(false);
  });

  it("matches keywords with punctuation", () => {
    expect(mentions("Built on Node.js", "node.js")).toBe(true);
  });
});

describe("scoreJob", () => {
  it("rates a strong match as Apply", () => {
    const result = scoreJob(jd("jd-strong.txt"), profile);
    expect(result.score).toBeGreaterThanOrEqual(profile.scoring.thresholds.apply);
    expect(result.verdict).toBe("Apply");
    expect(result.blockers).toEqual([]);
  });

  it("skips a role with a work-authorization blocker and quotes the line", () => {
    const result = scoreJob(jd("jd-us-only.txt"), profile);
    expect(result.verdict).toBe("Skip");
    expect(result.blockers[0].filter).toBe("Requires US work authorization");
    expect(result.blockers[0].line).toContain("authorized to work in the United States");
  });

  it("skips a weak match", () => {
    const result = scoreJob(jd("jd-weak.txt"), profile);
    expect(result.score).toBeLessThan(profile.scoring.thresholds.referral);
    expect(result.verdict).toBe("Skip");
  });

  it("sends a strong match at a target company through a referral first", () => {
    const withTarget = { ...profile, targeting: { ...profile.targeting, target_companies: ["Acme"] } };
    expect(scoreJob(jd("jd-strong.txt"), withTarget).verdict).toBe("Referral first");
  });

  it("picks the AI variant when the JD is about LLMs", () => {
    const text = "AI Engineer: build RAG pipelines, embeddings and LLM agents with evals.";
    expect(scoreJob(text, profile).variant).toBe("B");
  });
});
