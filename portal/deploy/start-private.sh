#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
cd /opt/yvexor/portal
set -a
source /etc/yvexor/portal.env
set +a
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py migrate --noinput
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py collectstatic --noinput
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py check --deploy
systemctl enable --now yvexor-portal.service
curl --fail --silent --retry 5 --retry-connrefused --retry-delay 1 -H 'X-Forwarded-Proto: https' http://127.0.0.1:8100/health/
