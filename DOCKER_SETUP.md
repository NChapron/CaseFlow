# Docker Setup

CaseFlow runs in three containerised environments — dev, UAT, and prod.
Each has its own Dockerfile, nginx config, and compose file.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine + Compose plugin
- Ports `4200`, `8080`, and `80` available on your machine

---

## Quick start

### Dev
```bash
npm run docker:dev
```
Open `http://localhost:4200`

Hot reload is enabled — changes to source files reflect in the browser without rebuilding the image.

### UAT
```bash
npm run docker:uat
```
Open `http://localhost:8080`

Production-optimised build with source maps retained for debugging.

### Prod
```bash
npm run docker:prod
```
Open `http://localhost:80`

Production-optimised build, no source maps, aggressive asset caching.

---

## Teardown

```bash
# Stop dev
docker compose -f docker-compose.dev.yml down

# Stop UAT
docker compose -f docker-compose.uat.yml down

# Stop prod
docker compose -f docker-compose.prod.yml down
```

To remove all CaseFlow images and start clean:

```bash
docker rmi $(docker images | grep caseflow | awk '{print $3}')
```

---

## Environment comparison

| | Dev | UAT | Prod |
|---|---|---|---|
| Port | 4200 | 8080 | 80 |
| Angular optimisation | off | on | on |
| Source maps | full | full | off |
| Output hashing | off | on | on |
| Hot reload | yes | no | no |
| Cache-Control immutable | no | no | yes |
| Resource limits | — | — | 0.5 CPU / 256MB |
| Restart policy | unless-stopped | unless-stopped | always |

---

## File structure
```angular2html
docker/
  Dockerfile.dev       — Node 20, ng serve with --host 0.0.0.0
  Dockerfile.uat       — multi-stage: Node 20 build → nginx serve
  Dockerfile.prod      — multi-stage: Node 20 build → nginx serve
  nginx.uat.conf       — SPA routing, gzip, X-Environment header
  nginx.prod.conf      — SPA routing, gzip, asset caching, security headers
docker-compose.dev.yml
docker-compose.uat.yml
docker-compose.prod.yml
```

---

## Verify headers

```bash
# UAT
curl -I http://localhost:8080

# Prod
curl -I http://localhost:80
```

Expected UAT response includes:
X-Environment: UAT
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff

Expected prod response includes:
X-Environment: Production
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

---

## Troubleshooting

**`ERR_EMPTY_RESPONSE` on dev** — the Angular dev server is not binding to `0.0.0.0`.
Check that `Dockerfile.dev` CMD includes `--host 0.0.0.0`.

**`Project does not exist`** — the Angular project name in the build command doesn't match `angular.json`.
The project name is `CaseFlow` — check all Dockerfiles and `package.json` scripts use this exact casing.

**Port already in use** — another process is using the port.
Run `lsof -i :4200` (or `:8080`, `:80`) to find and kill the process, then retry.

**`dist/CaseFlow/browser` not found** — the build output path casing doesn't match.
Angular outputs to `dist/CaseFlow/browser` — capital C and F. Check the `COPY` line in `Dockerfile.uat` and `Dockerfile.prod`.
