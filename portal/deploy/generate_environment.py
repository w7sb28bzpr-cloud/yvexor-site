"""Generate the production secret on its host; never emit it or persist it in Git."""
import os
import re
import secrets
import socket
import sys

if socket.gethostname() != 'yvexor-espace-client-01' or os.getuid() != 0:
    raise SystemExit('Wrong target or privileges')
email = sys.argv[1]
if not re.fullmatch(r'[A-Za-z0-9_.+\-]+@[A-Za-z0-9.\-]+', email):
    raise SystemExit('Invalid email')
fd = os.open('/etc/yvexor/portal.env', os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, 'w') as output:
    output.write('PORTAL_SECRET_KEY=' + secrets.token_urlsafe(64) + '\n')
    output.write('PORTAL_DEBUG=0\nPORTAL_HOSTS=client.yvexor.com,admin.yvexor.com,127.0.0.1\n')
    output.write('PORTAL_DB_NAME=yvexor_portal\nPORTAL_DB_USER=yvexor\nPORTAL_DB_HOST=\n')
    output.write('PORTAL_OWNER_EMAIL=' + email.lower() + '\n')
print('Private production environment generated without displaying secrets.')
