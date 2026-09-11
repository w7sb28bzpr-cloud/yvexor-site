#!/usr/bin/env bash
# Run only on the dedicated new instance. No DNS changes, no public firewall ports.
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
test "$(id -u)" = "0"
if ! id yvexor >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /var/lib/yvexor --shell /usr/sbin/nologin yvexor
fi
install -d -o root -g root -m 755 /opt/yvexor /etc/yvexor
install -d -o yvexor -g yvexor -m 700 /var/lib/yvexor
if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='yvexor'" | grep -q 1; then
  runuser -u postgres -- createuser --no-superuser --no-createdb --no-createrole yvexor
fi
if ! runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='yvexor_portal'" | grep -q 1; then
  runuser -u postgres -- createdb --owner=yvexor yvexor_portal
fi
test -f /opt/yvexor/portal/requirements.lock
if ! test -x /opt/yvexor/venv/bin/python; then
  python3 -m venv /opt/yvexor/venv
fi
/opt/yvexor/venv/bin/pip install -r /opt/yvexor/portal/requirements.lock
install -d -o yvexor -g yvexor -m 755 /opt/yvexor/portal/staticfiles
install -m 644 /opt/yvexor/portal/deploy/yvexor-portal.service /etc/systemd/system/yvexor-portal.service
systemctl daemon-reload
echo 'Preparation complete. Configure private environment before starting.'
