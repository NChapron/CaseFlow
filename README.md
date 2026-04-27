# CaseFlow

An internal case and incident management web client built with Angular 21.
Teams can track, triage, filter, and resolve operational cases through a clean,
accessible interface with dashboards, workflow states, and reactive forms.

---

## Tech stack

- **Angular 21** — standalone components, signals, `input()` / `output()`, `toSignal`
- **TypeScript** — strict mode throughout
- **SCSS** — BEM conventions, design tokens via CSS custom properties
- **RxJS** — `BehaviorSubject` state, `combineLatest`, `switchMap`
- **Vitest** — unit tests, no Karma
- **Docker** — multi-stage build, nginx

---

## Architecture
```angular2html
src/app/
pages/        — thin routed entry points, no business logic
features/     — domain components, services, models, mock data
case/       — core domain: workflow, filtering, forms, timeline
user/       — user lookup and assignment
dashboard/  — read model aggregating case data
shared/       — truly shared components, pipes, guards
layout/       — shell, navbar, sidebar
```

### Key decisions

**Standalone components throughout.**
No NgModules. Every component, pipe, and directive is standalone and
declares its own imports.

**Feature modules own their domain.**
`features/case/` contains everything about cases — models, services,
components, and mock data. Nothing leaks into `shared/` unless it is
genuinely used by two or more features.

**Pages are thin.**
Page components only compose feature components and pass route params down.
No service injection, no business logic.

**Reactive state via BehaviorSubject.**
All case state lives in a single `BehaviorSubject<Case[]>` inside
`CaseService`. Components subscribe to exposed Observables. No component
mutates state directly.

**Workflow enforced in the service layer.**
`CaseWorkflowService` owns the valid transition map. The UI only offers
buttons for legal next states. Invalid transitions throw — tested explicitly.

**Single form component for create and edit.**
`CaseFormComponent` detects its mode from the `caseId` input signal. If
present it loads and patches the existing case. If absent it initialises an
empty form. Validation is identical in both modes.

**OnPush everywhere.**
All components use `ChangeDetectionStrategy.OnPush`. Smart components
expose signals or observables; dumb components receive `@Input()` only.

**Why BehaviorSubject and not NgRx?**
NgRx is the right choice when multiple features share overlapping state and
the action/reducer/selector ceremony pays for itself. For a single domain
object with one stateful service, BehaviorSubject is sufficient and keeps
the codebase lean. The service interface is identical to what NgRx selectors
would expose — swapping the implementation requires no component changes.

**Why no backend?**
The project demonstrates frontend architecture. Replacing `MockCaseRepository`
with an HTTP implementation means changing one service — no component changes
required.

---

## Getting started

```bash
npm install
ng serve
```

App runs at `http://localhost:4200`.

### Run tests

```bash
npm test          # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

### Build

```bash
npm run build
```

---

## Docker

```bash
docker compose up --build
```

App available at `http://localhost:4200`.

Multi-stage build: Node 20 compiles the Angular app, nginx alpine serves
the static output with SPA routing fallback and gzip compression.

---

## Trade-offs and future work

| What | Why omitted | How to add |
|---|---|---|
| Authentication | Out of scope | HTTP interceptor for token injection, `AuthGuard` on all routes, login page as its own lazy feature |
| Real API | No backend | Replace `MockCaseRepository` with `HttpCaseRepository` — one line change in `app.config.ts` |
| E2E tests | Time constraint | Playwright or Cypress, happy-path flows per page |
| Angular signals migration | BehaviorSubject is more universally understood in interviews today | Replace `BehaviorSubject` with `signal()` + `computed()` in services |
| Dark mode toggle | OS preference respected via CSS `prefers-color-scheme` | Add a theme service + toggle in navbar |
| Bulk actions | Scope | Multi-select on case list, batch status update |
| Pagination | Mock data is small | Virtual scroll or page-based pagination on `CaseListComponent` |

---

