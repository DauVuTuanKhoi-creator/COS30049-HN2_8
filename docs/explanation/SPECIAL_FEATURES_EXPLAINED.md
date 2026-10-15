# Special Features Explained

This document explains the implementation details of the web app's special UI/UX features.

## 1. Dashboard Drawer-Style Sidebar

Primary files:

- `frontend/src/app/pages/Dashboard.tsx`
- `frontend/src/app/pages/dashboard/dashboard.css`

How it works:

- `sidebarCollapsed` in `Dashboard.tsx` controls whether the sidebar is full-width or icon-only.
- The root sidebar element sets `data-collapsed`, and CSS switches widths:
  - Expanded: `248px`
  - Collapsed: `72px`
- Sidebar buttons continue working in collapsed mode to keep navigation accessible.
- The collapse arrow rotates with `.collapse-arrow.collapsed` to mirror state.

Why this pattern:

- Keeps navigation always visible.
- Maximizes dashboard content space on smaller screens.
- Avoids expensive remounts because only width/state changes.

## 2. Card Navigation Hubs (Product, Company, Resources)

Primary files:

- `frontend/src/app/pages/Product.tsx`
- `frontend/src/app/pages/Company.tsx`
- `frontend/src/app/pages/Resources.tsx`

How it works:

- Each hub page defines a typed card list (`title`, `to`, `desc`, `icon`).
- Cards render using `.map` and each card is a `Link` to a subpage.
- This creates three grouped navigation surfaces:
  - Product -> Features, Pricing, Security
  - Company -> About, Blog, Careers
  - Resources -> Docs, Tutorials, API Reference

Why this pattern:

- Keeps information architecture obvious.
- Makes route expansion low-risk: add one object entry, not custom JSX blocks.
- Improves discoverability of deep pages.

## 3. Shared Marketing Header + Footer Shell

Primary files:

- `frontend/src/app/components/MarketingLayout.tsx`
- `frontend/src/app/routes.ts`

How it works:

- Marketing pages use one shared layout component via nested routes.
- `Outlet` renders child pages while preserving common header/footer.
- Header uses the same two-row structure as landing:
  - Brand + auth actions
  - Product/Company/Resources nav + theme switch
- Footer repeats grouped link columns to maintain consistency.

Why this pattern:

- Eliminates duplicated layout code.
- Keeps behavior and branding aligned across top-level pages.

## 4. Landing and Dashboard Animation System

Primary files:

- `frontend/src/app/pages/landing.css`
- `frontend/src/app/pages/dashboard/dashboard.css`

Landing animation details:

- Header icon uses a gentle `float` loop.
- Feature/process cards use staged `fadeUp` entry with `nth-child` delays.
- Scanner loading indicators use `spin` keyframes.
- Result cards animate in with `slideIn` for state change clarity.

Dashboard animation details:

- Page transitions use `.fade-up` with `@keyframes fadeUp`.
- Scanner loading spinner uses `@keyframes spin`.
- Sidebar collapse uses `width` transition for drawer-style interaction.

Why this pattern:

- Motion provides context (what changed and where).
- Visual transitions remain subtle to avoid distraction in security workflows.

## 5. Theme Compatibility (Dark/Light)

Primary files:

- `frontend/src/app/pages/Landing.tsx`
- `frontend/src/app/components/MarketingLayout.tsx`
- `frontend/src/app/pages/dashboard/dashboard.css`

How it works:

- `next-themes` controls persisted theme (`dark` / `light`).
- React components read and toggle theme via `useTheme()`.
- CSS token sets drive colors for each mode:
  - Landing: `.landing-dark` and `.landing-light`
  - Dashboard: `.dashboard-dark` and `.dashboard-light`

Why this pattern:

- One state source for theme avoids mismatch between pages.
- Token-driven palettes allow scalable styling without per-component rewrites.

## 6. Scanner UX Consistency

Primary files:

- `frontend/src/app/pages/Landing.tsx`
- `frontend/src/app/pages/dashboard/ScannerPage.tsx`
- `frontend/src/app/utils/detection.ts`

How it works:

- Landing scanner and dashboard scanner both call `analyzeText` / `analyzeFile`.
- Dashboard scan actions are backend-first for persistence-critical behavior.
- After a successful scan save, scanner dispatches `secureguard:scan-updated` so telemetry views refresh immediately.
- Dashboard scanner uses mapping helpers to normalize display format.

Why this pattern:

- Ensures saved scans are actually persisted to backend history.
- Prevents silent mock behavior from masking authentication/API issues.

## 7. Analytics Layer (3 Interactive Chart Types)

Primary files:

- `frontend/src/app/pages/dashboard/OverviewPage.tsx`
- `frontend/src/app/pages/dashboard/dashboard.css`

What was implemented:

- Added three Chart.js visualizations in the dashboard overview:
  - Line chart: safety score trend over time.
  - Bar chart: threat-category counts for actionable scans.
  - Doughnut chart: threat distribution with click-to-focus behavior.

Interactive capabilities:

- Time window switching (`24h`, `7d`, `all`).
- Zoom and pan on line chart via `chartjs-plugin-zoom`.
- Threat-level chip filters (clean/spam/phishing/malware).
- Doughnut click interaction to focus on one threat type.
- Reset zoom action for quick return to full trend context.

Why this pattern:

- Allows analysts to inspect macro trends first, then drill into focused slices.

## 8. Real-Time Telemetry Updates

Primary file:

- `frontend/src/app/pages/dashboard/liveTelemetry.ts`

How it works:

- `useLiveTelemetry(...)` is shared by Overview and History pages.
- Hook performs periodic polling when `autoRefresh` is enabled and prevents overlapping refresh calls.
- Hook listens for `secureguard:scan-updated` for immediate post-scan refresh.
- Hook exposes `lastUpdated`, loading, and refresh-error states to the page UI.

Why this pattern:

- Provides live analytics behavior for the dashboard experience.
- Keeps Overview and History data synchronized through one refresh source.
- Keeps UX transparent by showing refresh state, update timestamps, and refresh errors.

## 10. Placeholder Chart Data Mode

Primary file:

- `frontend/src/app/pages/dashboard/OverviewPage.tsx`

How it works:

- `USE_PLACEHOLDER_CHART_DATA` controls whether chart series are rendered from static demo arrays.
- Placeholder mode affects line, bar, and doughnut chart datasets only.
- Non-chart telemetry (recent activity, refresh state, history sync) remains live.

Why this pattern:

- Ensures stable chart visuals for demos/report screenshots.
- Decouples presentation evidence from volatile runtime scan volume.

## 9. Advanced AI-Outcome Features

Primary file:

- `frontend/src/app/pages/dashboard/OverviewPage.tsx`

Implemented advanced features:

- Risk-threshold slider:
  - Converts model output into triage slices (high-risk-only views).
  - Actionable list is derived from thresholded safety scores.
- Export pipeline:
  - CSV export for actionable records.
  - JSON summary export with filters, counts, and selected context.
- AI insight card:
  - Highlights dominant threat level.
  - Provides recommendation text based on average safety.

Why this pattern:

- Moves beyond static charts into analyst workflow support (triage + reporting).
- Gives concrete, outcome-driven functionality tied directly to model predictions.
