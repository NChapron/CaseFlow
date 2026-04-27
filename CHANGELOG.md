# Changelog

## [1.1.0] — 2026-04-27

### Added

**Environments**
- `src/environments/environment.ts` — dev environment config (apiUrl, logLevel, production flag)
- `src/environments/environment.uat.ts` — UAT environment config
- `src/environments/environment.prod.ts` — production environment config
- `ENVIRONMENT` injection token at `src/core/tokens/environment.token.ts` — environments injected via DI, never imported directly in components

**Docker**
- `docker/Dockerfile.dev` — Node 20 Alpine, Angular dev server with `--host 0.0.0.0` for container accessibility, hot reload via volume mount
- `docker/Dockerfile.uat` — multi-stage build, Node 20 compile → nginx Alpine serve, source maps retained
- `docker/Dockerfile.prod` — multi-stage build, Node 20 compile → nginx Alpine serve, source maps stripped
- `docker/nginx.uat.conf` — SPA routing fallback, gzip, `X-Environment: UAT` header
- `docker/nginx.prod.conf` — SPA routing fallback, gzip, aggressive asset caching (`Cache-Control: immutable`), full security headers
- `docker-compose.dev.yml` — dev service, port 4200, named volume for node_modules, bind mount for hot reload
- `docker-compose.uat.yml` — UAT service, port 8080
- `docker-compose.prod.yml` — prod service, port 80, resource limits (0.5 CPU / 256MB)
- `.dockerignore` — excludes node_modules, dist, .angular, .git, spec files, coverage

**Build scripts**
- `npm run build` — development build
- `npm run build:uat` — UAT optimised build with source maps
- `npm run build:prod` — production optimised build, no source maps
- `npm run docker:dev` — build and run dev container
- `npm run docker:uat` — build and run UAT container
- `npm run docker:prod` — build and run prod container

**angular.json**
- `development` build configuration — no optimisation, no hashing, full source maps
- `uat` build configuration — optimised, output hashing, source maps, UAT environment file replacement
- `production` build configuration — optimised, output hashing, no source maps, prod environment file replacement
- Serve configurations wired for all three targets

### Changed
- Removed `@angular/ssr`, `@angular/platform-server`, `express`, `@types/express` — SSR not required for this SPA
- Removed `provideClientHydration` and `withEventReplay` from `app.config.ts`
- `app.config.ts` updated to provide `ENVIRONMENT` token with active environment value
- `zone.js` moved to `dependencies` from transitive — required at runtime

### Environment matrix

| | Dev | UAT | Prod |
|---|---|---|---|
| Port | 4200 | 8080 | 80 |
| Optimisation | off | on | on |
| Source maps | full | full | off |
| Output hashing | off | on | on |
| Cache-Control immutable | no | no | yes |
| Resource limits | — | — | 0.5 CPU / 256MB |
| Restart policy | unless-stopped | unless-stopped | always |
