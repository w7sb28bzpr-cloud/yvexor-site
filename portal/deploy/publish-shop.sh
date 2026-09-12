#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
stage=/opt/yvexor/shop-stage-20260912/portal
test -f "$stage/core/shop.py"
backup=/var/backups/yvexor/before-shop-20260912
mkdir -p /var/backups/yvexor
mkdir -m 700 "$backup"
umask 077
runuser -u postgres -- pg_dump -Fc yvexor_portal > "$backup/portal.dump"
pg_restore --list "$backup/portal.dump" > /dev/null
tar -czf "$backup/source.tgz" -C /opt/yvexor portal
echo 'Backup database and previous source verified.'
umask 022
# Additive migrations: existing tables/authentication are not replaced.
/opt/yvexor/venv/bin/pip install -q -r "$stage/requirements.lock"
rsync -a --exclude=__pycache__ --exclude=private --exclude=staticfiles "$stage/" /opt/yvexor/portal/
chown -R yvexor:yvexor /opt/yvexor/portal
cd /opt/yvexor/portal
set -a
source /etc/yvexor/portal.env
set +a
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py migrate --noinput
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py import_first_product --image seed-assets/ecran-tactile-156.png
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py collectstatic --noinput
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py check --deploy
systemctl restart yvexor-portal
curl --fail --silent --retry 5 --retry-connrefused --retry-delay 2 https://client.yvexor.com/health/
echo 'Shop portal deployed.'
