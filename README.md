# XionTech Landing Page

New landing page / website for [XionTech](https://xiontechs.com/).

Built for the XionTech internal AI build challenge (demo day: 2026-10-09).

## Live URLs (Vercel)

| Environment | Branch      | URL                                       |
| ----------- | ----------- | ----------------------------------------- |
| Production  | `main`      | https://xion-tech-landing-page.vercel.app |
| Development | `develop`   | https://xiontech-dev.vercel.app           |
| PR preview  | `feature/*` | posted by Vercel as a comment on each PR  |

## Getting started

Requires Node.js 20.9+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## One-time setup per clone

Needs Docker Desktop, Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
npm install
cp scripts/sonar/sonar.env.example scripts/sonar/sonar.env
./scripts/sonar/local_sonar.sh up             # Docker must be running; first run pulls ~700MB
git config core.hooksPath scripts/git-hooks   # last: from now on every git push runs the Sonar gate
```

SonarQube runs **only on your machine**. Never point it at the shared XT SonarQube server.

## Docs

- [`AGENTS.md`](AGENTS.md) — shared context for the team and AI agents: rules, stack, git workflow.
- [`docs/ai-log.md`](docs/ai-log.md) — prompts and decisions that mattered.

## Current site reference

Content to carry over from https://xiontechs.com/ (scraped by AI, **verify before use**):

- **About:** IT services and product engineering firm, 25+ years of leadership experience, consumer-centric technology solutions.
- **Services:** Product Engineering, AI-Driven Analytics, Product Co-Creation, Staffing Services, Custom App Development, Low-code Solutions (Power Platform, Make, n8n, Retool, Bubble), AI-Powered Solutions, Cloud Computing (Azure, AWS, GCP).
- **Process (4-D Framework):** Discovery, Design, Development, Deployment.
- **Differentiators:** Metric-driven delivery, client-centric focus, integrated engineering platform, "Get IT Done" methodology.
- **Navigation:** Services, About Us, Why Choose Us, FAQs, Support, Careers, Contact Us.
- **Offices:** Dallas (USA); Ho Chi Minh City & Da Nang (Vietnam).
- **Phone:** +1 469 322 9899 / +84 908 107552
