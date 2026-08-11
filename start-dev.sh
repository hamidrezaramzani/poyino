#!/usr/bin/env bash
# Install deps, ensure Docker services, build packages, then run API + web.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

log() { printf '\n==> %s\n' "$*"; }
warn() { printf '!! %s\n' "$*" >&2; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    warn "Missing required command: $1"
    exit 1
  fi
}

compose() {
  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  elif docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    warn "Neither docker-compose nor 'docker compose' is available."
    exit 1
  fi
}

service_running() {
  local service="$1"
  local status
  status="$(compose ps --status running --services 2>/dev/null || true)"
  printf '%s\n' "$status" | grep -qx "$service"
}

ensure_env_file() {
  local example="$1"
  local target="$2"
  if [[ ! -f "$target" ]]; then
    if [[ -f "$example" ]]; then
      cp "$example" "$target"
      log "Created $target from $(basename "$example")"
    else
      warn "Missing $example — create $target manually if needed."
    fi
  fi
}

wait_for_postgres() {
  local retries=30
  local i
  for ((i = 1; i <= retries; i++)); do
    if compose exec -T postgres pg_isready -U poyino -d poyino >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  warn "Postgres did not become ready in time."
  return 1
}

require_cmd node
require_cmd npm

if ! command -v docker >/dev/null 2>&1; then
  warn "Docker is not installed. Skipping container setup."
else
  log "Checking Docker containers..."
  if ! docker info >/dev/null 2>&1; then
    warn "Docker daemon is not running. Start Docker/Colima, then re-run this script."
    exit 1
  fi

  services_to_start=()
  for service in postgres pgadmin; do
    if service_running "$service"; then
      log "Container already running: $service"
    else
      services_to_start+=("$service")
    fi
  done

  if ((${#services_to_start[@]} > 0)); then
    log "Starting containers: ${services_to_start[*]}"
    compose up -d "${services_to_start[@]}"
  else
    log "All required containers are already running."
  fi

  log "Waiting for Postgres..."
  wait_for_postgres
fi

log "Ensuring env files..."
ensure_env_file "apps/api/.env.example" "apps/api/.env"
ensure_env_file "apps/web/.env.example" "apps/web/.env"

log "Installing dependencies..."
npm install

log "Generating Prisma client..."
npm run db:generate

log "Building packages..."
npm run build

log "Starting API and web (Ctrl+C to stop)..."
exec npm run dev
