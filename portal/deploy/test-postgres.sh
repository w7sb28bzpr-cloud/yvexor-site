#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
# This command fails if the dedicated test DB already exists; never reuse unknown data.
runuser -u postgres -- createdb --owner=yvexor test_yvexor_portal
trap 'runuser -u postgres -- dropdb test_yvexor_portal' EXIT
cd /opt/yvexor/portal
set -a
source /etc/yvexor/portal.env
set +a
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py test core --keepdb --noinput
