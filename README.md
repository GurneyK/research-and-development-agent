# Unilever R&D Portal

Production-ready React rebuild of the Figma Make prototype for the Unilever R&D agent workspace.

The app is intentionally structured as a maintainable dashboard rather than a static mockup: navigation views, data-driven cards, modals, drawers, responsive layouts, charts, and user management are all implemented in code so the development team can continue from a clean baseline.

## Screens Included

- Submissions queue with search, date range control, sorting/filter affordances, closed count, and detail drawer.
- Insights dashboard with KPI cards, trend chart, decision pipeline, score distribution, tier breakdown, and recent activity.
- Scoring Guide with UFS scoring flow, score allocation, component cards, disqualifiers, and tier outcomes.
- Users management with role/status summaries, searchable account table, and audit activity.
- Settings view for operational toggles.
- Manual submission modal and filter panel.
- Responsive mobile navigation that fixes the horizontal overflow seen in the original prototype.

## Tech Stack

- React 19
- TypeScript
- Vite
- Lucide React icons
- Playwright smoke tests
- Oxlint

## Getting Started

```bash
npm install
npm run dev
```

The local app runs at:

```text
http://127.0.0.1:5173/
```

## Quality Checks

```bash
npm run build
npm run lint
npm run test:e2e
```

## Project Notes

The current implementation uses local typed data in `src/App.tsx`. When backend endpoints are ready, replace the local arrays for submissions, users, activity, and scoring configuration with API calls while keeping the component structure intact.

Most visual tuning lives in `src/App.css` through shared design tokens for surfaces, borders, text, accent colors, spacing, and responsive behavior.
