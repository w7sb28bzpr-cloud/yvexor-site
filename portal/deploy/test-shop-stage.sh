#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
cd /opt/yvexor/shop-stage-20260912/portal
export PORTAL_DEBUG=1 PORTAL_SECRET_KEY=isolated-shop-verification-not-production
export PORTAL_DB_NAME=yvexor_shop_20260912 PORTAL_DB_USER=yvexor PORTAL_DB_HOST=''
runuser -u postgres -- createdb --owner=yvexor test_yvexor_shop_20260912
trap 'runuser -u postgres -- dropdb test_yvexor_shop_20260912' EXIT
runuser -u yvexor -- ../venv/bin/python manage.py test core --keepdb --noinput
