# CLAUDE.md — School Grades App

> ⚠️ **Sync note:** This file and `.github/copilot-instructions.md` must always have identical content.
> Whenever you edit one, immediately update the other to keep them in sync.

> 📋 **Requirements sync:** Whenever a new functional or technical requirement is implemented, also update `requirements.md` to reflect the new behaviour. Keep `requirements.md` as the single source of truth for what the app does.

---

## Project overview

Single-page React app for Romanian students to manage school grades.
Live at: **https://im-trainer.github.io/school-grades/**
Repo: `git@github.com:im-trainer/school-grades.git`

## Tech stack

- **React 18** + **Vite 5** (SPA, no backend)
- **Plain CSS** — `src/styles/main.css`, no Tailwind, no CSS-in-JS
- **localStorage** only — no server, no auth
- **GitHub Actions** → auto-deploy to GitHub Pages on push to `main`
- `base: '/school-grades/'` in `vite.config.js` (required for Pages)

## Dev workflow

```bash
npm run dev      # start dev server at http://localhost:5173/school-grades/
npm run build    # production build → dist/
```

Preview server config: `.claude/launch.json` (name: `school-grades`, port: 5173)

## File structure

```
src/
├── App.jsx                        # root: state wiring, simulation logic
├── main.jsx
├── hooks/
│   ├── useGrades.js               # subjects state, localStorage, all mutations, CSV
│   └── usePersistentState.js      # useState + auto localStorage sync
├── components/
│   ├── Header.jsx                 # app title + class badge
│   ├── OverallAverage.jsx         # overall avg card + simulation toggle + sim avg
│   ├── SubjectList.jsx            # sort controls + collapse/expand + grid
│   ├── SubjectCard.jsx            # per-subject card: grades, edit, upgrade badge
│   ├── SmartHint.jsx              # simulation slider (shown when simulationMode ON)
│   ├── GradeChip.jsx              # colored grade pill with delete ×
│   ├── AddSubjectForm.jsx         # add new subject input
│   ├── ExportButton.jsx           # Materii implicite + Import/Export CSV split button
│   └── ClassPickerModal.jsx       # class picker 1–12 grouped by level
├── data/
│   └── defaultSubjects.js         # SUBJECTS_BY_CLASS: keys 1–12, Romanian curriculum
└── styles/
    └── main.css                   # all styles, CSS variables, button groups
```

## Data model

```js
// localStorage key: 'school-grades-v1'
subjects: [{ id: string, name: string, teacher: string, grades: number[] }]
// teacher is optional (empty string = not set)

// localStorage key: 'school-grades-class'
studentClass: number | null   // 1–12

// UI state (all in localStorage):
// 'school-grades-ui-sort-field'   → 'name' | 'average' | 'count'
// 'school-grades-ui-sort-dir'     → 'asc' | 'desc'
// 'school-grades-ui-collapsed'    → string[] (subject IDs)
// 'school-grades-ui-simulation'   → boolean
// 'school-grades-ui-sim-grades'   → { [subjectId]: number }
```

## Key calculation rules

- **Subject average**: `Math.round(sum / count)` — always integer
- **Overall average**: `parseFloat((sumOfRoundedAvgs / count).toFixed(2))` — 2 decimal places
- **Upgrade badge**: for delta 1–3, find the smallest delta where `Math.round((sum + avg+delta) / (count+1)) > avg`. Badge colors: green (+1), orange (+2), red (+3)
- **Simulated overall**: computed only when `simulationMode === true` AND at least one slider has been moved. Uses regular avg for non-simulated subjects.

## CSS conventions

- CSS variables defined in `:root` (colors, radius, shadows, font)
- Color classes: `.good` (≥7), `.ok` (≥5), `.bad` (<5), `.no-grade`
- Button group pattern: `.btn-group > .btn` — `border-radius: 0`, negative margin, rounded only on `:first-child` / `:last-child`
- No `transform: translateY()` on hover — only `box-shadow` changes
- Responsive: 2-column grid on desktop, 1-column on mobile

## Component conventions

- Subject name is only editable when the card is **expanded** (not collapsed)
- `usePersistentState(key, defaultValue)` works exactly like `useState` but persists to localStorage
- Collapsed IDs stored as `string[]` in localStorage, exposed as `Set` internally in SubjectList
- Simulation slider values live in `App` state (`simGrades`), passed down — not local to SmartHint
- `simCount` = number of subjects with a slider value set (passed to OverallAverage for display)

## Git

- Branch: `main` (deploy triggers on push)
- Commit messages: short and descriptive (e.g. `fix spacing`, `add simulation toggle`)
- After each feature: `git add <files> && git commit -m "..." && git push`
