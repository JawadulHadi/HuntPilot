---
name: job-application-workflow
description: Analyze a job description, score fit, pick the resume variant, and draft tailored resume bullets, cover letters or interview prep using only knowledge-file facts. Use when the user pastes a JD or job link, names a company, or asks for application or interview help.
---

# Job Application Workflow

## Steps

1. Identify the input: pasted JD, job URL, company name, or interview request. If a URL can't be read, ask for the pasted text.
2. Extract: title, seniority, must-haves, nice-to-haves, stack keywords, location and timezone rules, work-authorization rules, comp if listed, red flags.
3. Apply the hard filters (below). If one fails, the verdict is Skip: quote the exact line from the JD and stop unless the user asks to continue.
4. Map each must-have to evidence in the knowledge files. Label it Strong, Partial or Gap.
5. Score fit 0–100 with the rubric. Show the breakdown.
6. Choose the variant:
   - A: {{targeting.variants.A.name}} ({{targeting.variants.A.focus}})
   - B: {{targeting.variants.B.name}} ({{targeting.variants.B.focus}})
   - C: {{targeting.variants.C.name}} ({{targeting.variants.C.focus}})
7. Give the verdict: Apply ({{scoring.thresholds.apply}}+), Referral first ({{scoring.thresholds.referral}} up to but not including {{scoring.thresholds.apply}}, or {{scoring.thresholds.apply}}+ at a target company: {{targeting.target_companies}}), Skip (below {{scoring.thresholds.referral}} or a hard filter fails).
8. Produce what was asked for (limits below).
9. Verify before output: every number, tool, date and employer must exist in the knowledge files. Move anything unverified to "Needs your input".
10. Offer next actions: log in the tracker, start a referral ask, save a draft. Do them only after the user approves.

## Hard filters (any one = Skip)

- Requires citizenship, a green card, security clearance, or local work authorization the candidate doesn't have (check facts.md), with no contractor or employer-of-record option.
- Onsite or hybrid only, outside {{candidate.home_country}}.
- Unpaid trial work, or a take-home over 8 hours before any conversation.
- Comp clearly below the floor in facts.md.
- Required working hours that don't overlap {{candidate.working_hours}}.

## Fit rubric (100 points)

| Area | Points | Full marks when |
| --- | --- | --- |
| Core stack | 30 | The candidate's core stack ({{candidate.core_stack}}) is a must-have |
| Seniority | 20 | Senior, Staff, Lead or Architect, with ownership of design |
| AI / LLM | 15 | LLM integration, RAG or AI reliability in scope |
| Supporting stack | 10 | Queues, caching, event-driven or GraphQL work |
| Remote fit | 15 | Remote for {{targeting.region}} or worldwide, async-friendly |
| Company signal | 10 | Product company, clear scope, real engineering team |

## Output limits

- Fit analysis: table Requirement | Evidence | Fit, then score, variant, verdict, 3 gaps, 5 keywords to mirror.
- Resume: same facts, reordered. Headline, 3-line summary, skills that match the JD, then bullets as action + named system + number. Single column, standard headings (Summary, Skills, Experience, Projects, Education, Certifications), no tables or text boxes.
- Cover letter: max {{writing.cover_letter_max_words}} words. A specific hook about the company's product, one quantified proof point ("{{candidate.headline_metric}}" by default), one sentence on fit, short close.
- Interview prep: likely questions (system design, stack depth, failure handling, leadership) with STAR outlines from real experience only. Mock mode: one question at a time, wait, then give strengths, gaps and a tighter version.

## Examples

**Paste a JD.** "Senior backend role at a US fintech. Fit?" Return the fit table, score, variant, verdict, 3 gaps, 5 keywords, then ask whether to tailor the resume, write the cover letter or start a referral ask.

**Authorization blocker.** JD says "Must reside in the US." Verdict Skip, quote that line, one sentence why. Don't tailor anything.

**Missing fact.** "Add team size to my cover letter." If team size isn't in the files, ask for it. Don't invent it.

## Notes

- Titles below Lead: use Variant C but keep the headline.
- Local roles in {{candidate.home_country}}: drop the timezone pitch, keep the same facts.
- Conflicting metrics, dates or titles across files: stop and ask.
