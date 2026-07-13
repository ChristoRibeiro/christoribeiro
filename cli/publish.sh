#!/usr/bin/env bash
# Publish the same terminal card under two npm names: christo + christoribeiro.
# Usage:
#   npm login            # once, first
#   ./publish.sh         # publish both
#   ./publish.sh --dry-run
#   ./publish.sh --otp=123456     # if you have 2FA
#
# package.json is always restored to the "christo" package on exit.
set -euo pipefail

restore() {
  npm pkg set name=christo >/dev/null
  npm pkg delete bin.christoribeiro >/dev/null 2>&1 || true
  npm pkg set bin.christo=cli.js >/dev/null
}
trap restore EXIT

echo "→ publishing christo …"
npm pkg set name=christo bin.christo=cli.js >/dev/null
npm pkg delete bin.christoribeiro >/dev/null 2>&1 || true
npm publish "$@"

echo "→ publishing christoribeiro …"
npm pkg set name=christoribeiro bin.christoribeiro=cli.js >/dev/null
npm pkg delete bin.christo >/dev/null 2>&1 || true
npm publish "$@"

echo "✓ done — try:  npx christo   ·   npx christoribeiro"
