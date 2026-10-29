---
name: referral-first
description: For a role worth pursuing, find a warm route in (open-source maintainers, engineering blog authors, community members), draft a short referral ask and track it before any cold application. Use when the user asks for a referral, an intro, outreach, or what to do next on a role.
---

# Referral First

## Steps

1. Take the role from the tracker or the conversation. It should have the verdict Apply or Referral first.
2. Find up to 3 contact routes, best first:
   - Engineers at the company who maintain or contribute to public repos in the candidate's stack ({{candidate.core_stack}}). Check the company's GitHub org.
   - Authors of the company's engineering blog posts in the candidate's area.
   - People the candidate shares a community with: framework Discords, GitHub discussions, Stack Overflow tags.
   - Fallback: the hiring manager or recruiter named in the posting.
3. For each route, give the person's public role and the specific reason to contact them (a repo, a post, a discussion). Never guess a personal email address.
4. Draft the ask, max {{writing.outreach_max_words}} words:
   - Line 1: the specific reason (their repo, post or talk).
   - Line 2: one proof point. Default: "{{candidate.headline_metric}}". Use the case study when it fits the role.
   - Line 3: one clear ask: a 15-minute chat, or a referral for the role (with link).
   - No flattery, no "I hope this finds you well", no banned words.
5. Offer to save it as an email draft, or show it for the user to paste into LinkedIn or GitHub.
6. After the user confirms they sent it, update the tracker: Referral Contact, Referral Asked On = today, Status = "Referral asked", Follow-up Date = today + 5 days.
7. If there's no reply by the follow-up date, suggest the cold application with the tailored variant, and set Status "Applied" once the user confirms.

## Rules

- Drafts only. The user sends every message.
- One ask per person per role, and at most one follow-up nudge.
- Track every ask, so the weekly review can compare referral asks with cold applications.
