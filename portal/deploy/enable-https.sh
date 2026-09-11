#!/usr/bin/env bash
set -euo pipefail
test "$(hostname)" = "yvexor-espace-client-01"
test -s /etc/letsencrypt/live/client.yvexor.com/fullchain.pem
test -s /etc/letsencrypt/live/client.yvexor.com/privkey.pem
install -m 0644 /opt/yvexor/portal/deploy/nginx-https.conf /etc/nginx/sites-available/yvexor-portal
nginx -t
ufw allow 443/tcp
systemctl reload nginx
install -m 0755 /opt/yvexor/portal/deploy/renewal-reload.sh /etc/letsencrypt/renewal-hooks/deploy/yvexor-nginx
systemctl enable --now certbot.timer
