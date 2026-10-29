# Fit scoring

`huntpilot score` gives every job description a 0–100 pre-score, a resume variant and a verdict. It's deterministic: the same job description gets the same answer every time, so you can compare roles side by side. The agent uses the same rubric when it reads a job description in full.

## How the score works

Each rubric area in `scoring.areas` has points, keywords and `need`, the number of keyword matches for full points. Fewer matches earn a share of the points.

```text
area points = points × min(matches / need, 1)
score       = sum of area points
```

Keywords match whole words, ignoring case, so `redis` doesn't match "rediscover".

The example profile uses:

| Area | Points | Need |
| --- | --- | --- |
| Core stack | 30 | 3 |
| Seniority | 20 | 1 |
| AI / LLM | 15 | 2 |
| Supporting stack | 10 | 2 |
| Remote fit | 15 | 1 |
| Company signal | 10 | 2 |

Points must add up to 100. The profile won't load if they don't.

## Verdicts

| Verdict | When |
| --- | --- |
| Skip | Any hard filter matches, or the score is below `thresholds.referral` |
| Referral first | Score between the thresholds, or at least `thresholds.apply` at a company in `target_companies` |
| Apply | Score at least `thresholds.apply`, with no blockers |

## Hard filters

Each filter is a case-insensitive regular expression tested line by line. The first matching line is quoted back, so you can see exactly why a role was skipped. Edit the filters to match your own situation. If you hold US work authorization, delete that filter.

## Variants

The variant with the most keyword matches wins. On a tie, A wins over B, and B wins over C, so your lead variant is the default.
