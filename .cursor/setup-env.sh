#!/usr/bin/env bash
# Instalación idempotente para el entorno de Cloud Agent.
# - Instala dependencias de raíz, client y server.
# - Genera un .env con la configuración NO secreta si aún no existe.
#   Los valores sensibles (SUPABASE_ANON_KEY, JWT_SECRET) se inyectan como
#   Secrets del entorno y NO se escriben aquí.
set -euo pipefail

cd "$(dirname "$0")/.."

npm run install-all

if [ ! -f .env ]; then
  cat > .env <<'ENV'
# Config NO secreta generada por .cursor/setup-env.sh.
# Los secretos (SUPABASE_ANON_KEY, JWT_SECRET) llegan por Secrets del entorno.
SUPABASE_URL=https://ydbefwfqkimznydpybss.supabase.co
PORT=3002
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3002
VITE_BASE=/
DEMO_ACADEMY_SLUG=dpdemo
ACADEMY_NAME=Academia Demo
CONTACT_EMAIL=contacto@dpsistemas.cl
DEMO_LOCK=true
ENV
  echo "[setup-env] .env generado con defaults no secretos."
else
  echo "[setup-env] .env ya existe; no se modifica."
fi
