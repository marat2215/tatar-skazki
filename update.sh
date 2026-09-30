#!/bin/bash
# Раз в час подтягивает изменения с GitHub.
# Новые сказки/фразы бот видит сам; при изменении кода — перезапуск.
cd "$(dirname "$0")"
OLD=$(git rev-parse HEAD)
git pull -q || exit 0
NEW=$(git rev-parse HEAD)
[ "$OLD" = "$NEW" ] && exit 0
if git diff --name-only "$OLD" "$NEW" | grep -qE '^(bot/|scripts/)'; then
  .venv/bin/pip install -q -r bot/requirements.txt
  sudo systemctl restart tatarbot
fi
