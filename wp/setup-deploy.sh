#!/usr/bin/env bash
#
# Finish the SSH deploy setup.
#
#   ./wp/setup-deploy.sh <ssh-host> <ssh-user> [ssh-port]
#
# e.g.
#   ./wp/setup-deploy.sh 123.45.67.89 u123456789
#
# Everything is verified against the live server BEFORE any secret is written.
# The reason is specific: rsync creates missing directories without complaining,
# so a wrong wp-content path produces a deploy that reports success and puts the
# theme somewhere WordPress will never look. That failure is invisible until
# someone wonders why the site still looks the same.

set -euo pipefail

HOST="${1:-}"
USER_NAME="${2:-}"
PORT="${3:-65002}"
KEY="wp/secrets/hostinger_deploy"

if [[ -z "$HOST" || -z "$USER_NAME" ]]; then
  echo "usage: ./wp/setup-deploy.sh <ssh-host> <ssh-user> [ssh-port]" >&2
  echo "       values are in hPanel -> Advanced -> SSH Access" >&2
  exit 1
fi

[[ -f "$KEY" ]] || { echo "missing $KEY — the deploy keypair was not generated" >&2; exit 1; }
chmod 600 "$KEY"

SSH="ssh -p $PORT -i $KEY -o BatchMode=yes -o ConnectTimeout=15"

say() { printf '  %-34s %s\n' "$1" "$2"; }

echo
echo "1. Connection"
if ! $SSH "$USER_NAME@$HOST" true 2>/dev/null; then
  say "ssh" "FAILED"
  echo
  echo "  The public key is probably not authorised yet. Add this in" >&2
  echo "  hPanel -> Advanced -> SSH Access -> Manage SSH keys:" >&2
  echo >&2
  cat "$KEY.pub" >&2
  exit 1
fi
say "ssh" "ok"

echo
echo "2. Server environment"
PHP_VERSION=$($SSH "$USER_NAME@$HOST" 'php -r "echo PHP_VERSION;"' 2>/dev/null || echo "unknown")
say "php" "$PHP_VERSION"
case "$PHP_VERSION" in
  8.[1-9]*|9.*|1[0-9].*) ;;
  *) echo "  WARNING: the plugin declares Requires PHP 8.1 and uses match/enums." >&2
     echo "           Set the version in hPanel -> Advanced -> PHP Configuration." >&2 ;;
esac

if $SSH "$USER_NAME@$HOST" 'command -v wp >/dev/null 2>&1'; then
  say "wp-cli" "$($SSH "$USER_NAME@$HOST" 'wp --version --allow-root 2>/dev/null' || echo present)"
else
  say "wp-cli" "NOT FOUND — the content import step will not run"
fi

echo
echo "3. Locating wp-content"
# Checked in order of likelihood rather than guessed, because the whole point of
# this script is to not guess.
CANDIDATES=$($SSH "$USER_NAME@$HOST" '
  for d in \
    ~/domains/frontpaged.io/public_html/wp-content \
    ~/public_html/wp-content \
    ~/domains/frontpaged.io/public_html/wordpress/wp-content \
    ~/htdocs/wp-content; do
    [ -d "$d" ] && echo "$d"
  done' 2>/dev/null || true)

if [[ -z "$CANDIDATES" ]]; then
  say "wp-content" "NOT FOUND"
  echo
  echo "  WordPress does not appear to be installed yet. Install it first via" >&2
  echo "  hPanel -> Website -> Auto Installer, then re-run this script." >&2
  echo >&2
  echo "  Directories that do exist:" >&2
  $SSH "$USER_NAME@$HOST" 'ls -d ~/domains/*/public_html 2>/dev/null || ls -d ~/public_html 2>/dev/null' >&2 || true
  exit 1
fi

WP_CONTENT=$(printf '%s\n' "$CANDIDATES" | head -1)
say "wp-content" "$WP_CONTENT"

for sub in themes plugins; do
  if $SSH "$USER_NAME@$HOST" "[ -d '$WP_CONTENT/$sub' ]"; then
    say "  $sub/" "ok"
  else
    say "  $sub/" "MISSING — not a WordPress install?"
    exit 1
  fi
done

if $SSH "$USER_NAME@$HOST" "[ -w '$WP_CONTENT/themes' ]"; then
  say "  writable" "yes"
else
  say "  writable" "NO — rsync will fail"
  exit 1
fi

echo
echo "4. Writing GitHub secrets"
gh secret set HOSTINGER_SSH_HOST   --body "$HOST"        >/dev/null && say "HOSTINGER_SSH_HOST" "set"
gh secret set HOSTINGER_SSH_USER   --body "$USER_NAME"   >/dev/null && say "HOSTINGER_SSH_USER" "set"
gh secret set HOSTINGER_SSH_PORT   --body "$PORT"        >/dev/null && say "HOSTINGER_SSH_PORT" "set"
gh secret set HOSTINGER_WP_CONTENT --body "$WP_CONTENT"  >/dev/null && say "HOSTINGER_WP_CONTENT" "set"
gh secret set HOSTINGER_SSH_KEY < "$KEY"                 >/dev/null && say "HOSTINGER_SSH_KEY" "set"

echo
echo "Done. Deploy with:"
echo "  gh workflow run 'Deploy WordPress theme & plugin'"
echo
echo "Or with a content import on the first run:"
echo "  gh workflow run 'Deploy WordPress theme & plugin' -f run_import=true"
echo
