# Project Definitions & Operating Context

## Purpose
Create a high-impact, shareable career dashboard that demonstrates technical ownership, AI-first approach, and measurable impact.

## Non-goals
- Full resume rewrite
- Interactive multi-page app (keep single-page for now)
- Real-time data feeds

## Data Sources
- Google Drive: Engineering Workstyle, Job Analysis Master Context, Resume PDF
- LinkedIn / GitHub profile
- Manual curation of metrics

## Design Principles
- Clarity, Deference, Depth (Apple HIG inspired)
- Premium, minimal, high-signal
- Device presentation framing
- Dark/light friendly
- Mobile-first responsive

## Metrics Schema (draft)
```json
{
  "experience_years": 15,
  "companies": ["Wati", "Gupshup", "Botmaker", "..."],
  "markets": ["LATAM", "AMER", "EMEA"],
  "skills_count": 40,
  "languages": ["EN", "PT", "ES"],
  "key_impacts": ["40% MTTR reduction via N8N+LLM"]
}
```

## Sharing
- All assets (images, docs) live in Google Drive
- Crosswalk careertaskforce for Bot ↔ Cursor handoffs
- Repo is the source of truth for code & definitions
