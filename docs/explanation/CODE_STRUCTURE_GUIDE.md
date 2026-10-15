# SecureGuard Code Structure and Function Guide

This guide explains the main frontend code structure and documents how each core function works in the current implementation.

## 1. High-Level Structure

- `frontend/src/app/pages/Landing.tsx`
  - Public homepage with interactive text scanner preview.
- `frontend/src/app/pages/Dashboard.tsx`
  - Auth-gated dashboard shell (sidebar + topbar + subpage host).
- `frontend/src/app/pages/dashboard/ScannerPage.tsx`
  - Dashboard scanner workflow for text/file analysis.
- `frontend/src/app/pages/dashboard/helpers.ts`
  - Mapping/normalization helpers for scanner result rendering.
- `frontend/src/app/utils/detection.ts`
  - Detection service adapter (API-first with mock fallback) and heuristic scoring logic.

## 2. Landing Page Functions

### `mapResultToView(threatLevel, safetyScore, reasons)`
- **Purpose**: Converts backend-like detection fields into a simplified `ScanView` object for landing UI cards.
- **Input**:
  - `threatLevel`: raw severity bucket.
  - `safetyScore`: numeric score from detection details.
  - `reasons`: textual explanation list.
- **Output**:
  - `ScanView` with `safe`, `label`, `score`, and `details`.
- **Why it exists**:
  - Keeps landing rendering independent from full dashboard/backend result schema.

### `Landing()` (component)
- **Purpose**: Renders marketing content and a lightweight scanner demo.
- **Key state**:
  - `theme`: local landing visual mode (`dark`/`light`).
  - `inputText`: textarea content.
  - `scanning`: async status flag.
  - `result`: final mapped scanner output.

### `handleScan()`
- **Purpose**: Runs text analysis for landing scanner.
- **Flow**:
  1. Validates non-empty input.
  2. Sets loading and clears prior result.
  3. Calls `analyzeText` from detection utility.
  4. Maps returned data via `mapResultToView`.
  5. Falls back to a user-friendly error result on failure.

## 3. Dashboard Shell Functions

### `Dashboard()` (component)
- **Purpose**: Hosts all dashboard subpages and shared chrome.
- **Key state**:
  - `page`: active subpage (`overview`, `scanner`, `history`, `threats`, `reports`, `settings`).
  - `notifOpen`: notifications panel visibility.
  - `sidebarCollapsed`: sidebar compact mode.
- **Auth behavior**:
  - Redirects to `/signin` when `getCurrentUser()` returns null.

### `handleSignOut()`
- **Purpose**: Logs out current user and routes back to landing.
- **Flow**:
  1. Calls `signOut()`.
  2. Navigates to `/`.

### Theme integration logic
- Uses `useTheme()` from `next-themes`.
- Computes `dashboardThemeClass` (`dashboard-light` / `dashboard-dark`).
- Passes the class to root container so CSS token sets switch instantly.

## 4. Dashboard Scanner Functions

### `ScannerPage()` (component)
- **Purpose**: Unified scanner UI for text and file analysis.
- **Key state**:
  - `scanText`: text payload.
  - `activeTab`: scanner mode (`text` or `file`).
  - `selectedFile`: chosen file object.
  - `scanResult`: mapped dashboard-safe result.
  - `scanning`: async loading state.

### `applyScanResult(detection)`
- **Purpose**: Converts raw detection output into dashboard display model.
- **Flow**:
  - Calls `mapDetectionToDashboardResult` and stores the result.

### `runScan(mode, payload)`
- **Purpose**: Shared async scanner executor for both text and file paths.
- **Flow**:
  1. Sets loading and clears prior result.
  2. Selects API call (`analyzeText` or `analyzeFile`) by mode.
  3. Applies mapped result.
  4. Dispatches `secureguard:scan-updated` after successful backend save.
  5. Handles failures with a user-facing error result.

### `handleScan()`
- **Purpose**: Triggered by "Scan Now" button.
- **Flow**:
  - Validates input by active mode.
  - Routes to `runScan('file', selectedFile)` or `runScan('text', scanText)`.

### `handleExampleScan(content)`
- **Purpose**: Called by `ScanExamples` component.
- **Flow**:
  1. Injects sample text into textarea.
  2. Forces text tab active.
  3. Runs scan immediately.

## 4A. Dashboard Analytics Functions

Primary file:
- `frontend/src/app/pages/dashboard/liveTelemetry.ts`
- `frontend/src/app/pages/dashboard/OverviewPage.tsx`

### `useLiveTelemetry(options)`
- **Purpose**: Shared live history source used by Overview and History pages.
- **Behavior**:
  - Polls backend scan history at configured intervals.
  - Prevents overlapping refresh calls with a lock guard.
  - Listens for `secureguard:scan-updated` to refresh immediately after new scans.
  - Exposes `records`, `lastUpdated`, `loadingLiveData`, and `refreshError`.

### `mapScanToLevel(scan)`
- **Purpose**: Normalize backend `DetectionResult` into dashboard severity buckets.
- **Why it exists**:
  - Keeps all chart computations and filters aligned with a single severity mapping rule.

### `fallbackSeedRecords()`
- **Purpose**: Build synthetic-timestamp records from mock history.
- **Why it exists**:
  - Ensures charts render meaningful trend data even before API history is available.

### `refreshFromApi()`
- **Purpose**: Pull latest scan history for chart updates.
- **Flow**:
  1. Set loading state.
  2. Fetch data from `getScanHistory()`.
  3. Transform API shape into `AnalyticsRecord`.
  4. Update `records` and `lastUpdated`.
- **Why it exists**:
  - Centralizes live refresh logic for both initial load and interval polling.

### `windowRecords` (memoized selector)
- **Purpose**: Apply selected timeframe (`24h`, `7d`, `all`) to analytics records.
- **Why it exists**:
  - Provides timeline drill-down without refetching data.

### `actionableRecords` (memoized selector)
- **Purpose**: Convert risk threshold slider into a triage-ready subset.
- **Rule**:
  - Scan is actionable when `safetyScore <= (100 - riskThreshold)`.

### `visibleActionableRecords` (memoized selector)
- **Purpose**: Apply both threat chip filters and optional doughnut focus.
- **Why it exists**:
  - Keeps chart and list views synchronized under one filtering source.

### `trendChartData` / `threatBreakdownData` / `distributionData`
- **Purpose**: Construct Chart.js dataset models for line, bar, and doughnut charts.
- **Why it exists**:
  - Separates data derivation from JSX to simplify maintenance and testing.

### `USE_PLACEHOLDER_CHART_DATA`
- **Purpose**: Render deterministic chart series for demos/report screenshots.
- **Scope**:
  - Applies to chart datasets only.
  - Live telemetry refresh for lists/status remains enabled.

### `handleExportCsv()` and `handleExportSummary()`
- **Purpose**: Export triage artifacts from current analytics context.
- **Outputs**:
  - CSV: record-level actionable events.
  - JSON: summary snapshot with filters + aggregate metrics.

### `trendChartRef` + `resetZoom()`
- **Purpose**: Allow manual reset after zoom/pan interactions.
- **Why it exists**:
  - Prevents users getting stuck in a deeply zoomed time segment.

## 5. Dashboard Helper Functions

### `threatColor(level)`
- **Purpose**: Returns consistent color token for threat severity.

### `threatBg(level)`
- **Purpose**: Returns soft background color for severity badges/cards.

### `severityColor(severity)`
- **Purpose**: Maps threat intel severities (`critical`, `high`, `medium`) to colors.

### `normalizeDisplayText(text)`
- **Purpose**: Prepares long/noisy model text for safe UI display.
- **Behavior**:
  - Collapses repeated whitespace.
  - Detects mostly-uppercase text and converts to lower-case for readability.
  - Truncates very long strings to prevent layout overflow.

### `mapDetectionToDashboardResult(result)`
- **Purpose**: Converts full `DetectionResult` into `DashboardScanResult`.
- **Behavior**:
  - Derives dashboard level buckets (`clean`, `spam`, `phishing`, `malware`).
  - Joins and normalizes reason text.
  - Normalizes each suspicious/risk flag before display.

## 6. Detection Utility Functions

### `mockAnalyzeText(text)`
- **Purpose**: Heuristic text scanner used when backend is unavailable or mock mode enabled.
- **Signal groups**:
  - Spam keyword patterns.
  - Malware/code patterns.
  - Suspicious URL checks.
  - Exclamation and money-bait checks.
  - Caps-ratio check with code-aware bypass.
- **Output**:
  - Complete `DetectionResult` including reason lists and safety score.

### `analyzeText(text)`
- **Purpose**: Primary public text analyzer.
- **Flow**:
  1. Uses `mockAnalyzeText` when mock toggle is enabled.
  2. Otherwise calls backend via `apiService.analyzeText`.
  3. Throws a save error on API failure (no silent fallback in normal mode).

### `mockAnalyzeFile(file)`
- **Purpose**: Metadata-based file risk heuristic for fallback mode.
- **Checks**:
  - Dangerous/suspicious extensions.
  - Oversized files.
  - Double extensions.
  - Phishing-like filenames.

### `analyzeFile(file)`
- **Purpose**: Primary public file analyzer.
- **Flow**:
  1. Uses mock path when enabled.
  2. Calls backend upload scan API.
  3. Throws a save error on upload/API failure (no silent fallback in normal mode).

### `mockGetScanHistory()`
- **Purpose**: Local sample history data for development mode.

### `getScanHistory()`
- **Purpose**: Public history loader.
- **Flow**:
  1. Uses mock list when enabled.
  2. Calls backend history endpoint.
  3. Converts timestamps to `Date` objects for UI.
  4. Throws refresh error on API failure in normal mode.

## 7. How Components Work Together

1. Landing or Dashboard Scanner triggers analysis (`analyzeText` / `analyzeFile`).
2. Backend persists scan result and scanner dispatches `secureguard:scan-updated`.
3. Shared telemetry hook refreshes Overview/History from backend history.
4. Filters/threshold/focus states shape chart datasets and recent-activity rows.
5. Page components render severity, score, reasons, charts, and export actions with shared CSS tokens.

## 8. Styling and Theme Notes

- Landing styling is in `frontend/src/app/pages/landing.css`.
- Dashboard styling is in `frontend/src/app/pages/dashboard/dashboard.css`.
- `next-themes` drives dashboard light/dark mode through CSS token classes.

## 9. Recommended Maintenance Approach

- Keep API schema adaptations in helper files, not inside JSX.
- Keep fallback heuristics in `detection.ts` synchronized with backend threat categories.
- Add new dashboard pages by extending the `Page` type and navigation map in `Dashboard.tsx`.
- Keep view-model mapping functions small and deterministic for easier testing.
