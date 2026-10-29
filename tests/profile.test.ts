import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { validateProfile } from "../src/profile.js";

const example = () => parse(readFileSync("examples/profile.example.yaml", "utf8"));

describe("validateProfile", () => {
  it("accepts the example profile", () => {
    expect(() => validateProfile(example())).not.toThrow();
  });

  it("names every missing field", () => {
    const raw = example();
    delete raw.candidate.name;
    raw.targeting.roles = [];
    expect(() => validateProfile(raw)).toThrow(/candidate\.name, targeting\.roles/);
  });

  it("rejects rubric points that don't add up to 100", () => {
    const raw = example();
    raw.scoring.areas[0].points = 10;
    expect(() => validateProfile(raw)).toThrow(/add up to 100/);
  });

  it("rejects a referral threshold above the apply threshold", () => {
    const raw = example();
    raw.scoring.thresholds.referral = 90;
    expect(() => validateProfile(raw)).toThrow(/referral/);
  });
});
