#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
stage=/opt/yvexor/caisse-stage-20260913
live=/opt/yvexor/portal
test "$(sha256sum "$live/core/views.py" | cut -d' ' -f1)" = 2e97515845acec2d01540b29d5a2b7024627cac236554db80bb71d1e8745c60e
test "$(sha256sum "$live/config/urls.py" | cut -d' ' -f1)" = 47256aa337eb0a0c117e5fc4bf06434ba213a5d8a9969013b11f7e8431d0e789
backup=/var/backups/yvexor/before-caisse-20260913
mkdir -m 700 "$backup"
cp -p "$live/core/views.py" "$backup/views.py"
cp -p "$live/config/urls.py" "$backup/urls.py"
rollback(){ cp -p "$backup/views.py" "$live/core/views.py"; cp -p "$backup/urls.py" "$live/config/urls.py"; systemctl restart yvexor-portal; }
trap rollback ERR
install -o yvexor -g yvexor -m 644 "$stage/views.py" "$live/core/views.py"
install -o yvexor -g yvexor -m 644 "$stage/urls.py" "$live/config/urls.py"
for file in caisse.py caisse_catalogue.json tests_caisse.py; do install -o yvexor -g yvexor -m 644 "$stage/$file" "$live/core/$file"; done
cd "$live"
set -a
source /etc/yvexor/portal.env
set +a
runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py check --deploy
# Dedicated disposable test database. Creation fails rather than reusing existing data.
runuser -u postgres -- createdb --owner=yvexor test_yvexor_portal
if ! runuser -u yvexor -- /opt/yvexor/venv/bin/python manage.py test core --keepdb --noinput; then
  runuser -u postgres -- dropdb test_yvexor_portal
  rollback
  exit 1
fi
runuser -u postgres -- dropdb test_yvexor_portal
systemctl restart yvexor-portal
curl --fail --silent --retry 5 --retry-connrefused --retry-delay 2 https://client.yvexor.com/health/
trap - ERR
echo 'Caisse draft integration deployed; source backup retained; no production data migration.'
