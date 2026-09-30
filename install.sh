#!/bin/bash
# Установка TatarlargaBot на сервер (Ubuntu/Debian).
# Запуск одной командой:
#   curl -sL https://raw.githubusercontent.com/marat2215/tatar-skazki/main/install.sh | bash
set -e

REPO="https://github.com/marat2215/tatar-skazki.git"
DIR="/opt/tatarbot"
RUN_USER="$(id -un)"

echo "=== 1/5 Устанавливаю системные пакеты ==="
sudo apt-get update -qq
sudo apt-get install -y -qq git python3-venv ffmpeg

echo "=== 2/5 Скачиваю бота с GitHub ==="
if [ -d "$DIR/.git" ]; then
  sudo git -C "$DIR" pull -q
else
  sudo git clone -q "$REPO" "$DIR"
fi
sudo chown -R "$RUN_USER" "$DIR"
cd "$DIR"

echo "=== 3/5 Устанавливаю Python-библиотеки (пара минут) ==="
python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip
.venv/bin/pip install -q -r bot/requirements.txt

echo "=== 4/5 Скачиваю голос TatarTTS (~110 МБ) ==="
.venv/bin/python scripts/get_model.py

if [ ! -f .env ]; then
  echo
  read -r -p "Вставьте токен бота от @BotFather и нажмите Enter: " TOKEN </dev/tty
  read -r -p "Ваш Telegram ID (цифры, можно узнать у @userinfobot): " ADMIN </dev/tty
  printf "BOT_TOKEN=%s\nADMIN_ID=%s\nDATA_DIR=%s/data\n" "$TOKEN" "$ADMIN" "$DIR" > .env
  chmod 600 .env
fi

echo "=== 5/5 Включаю автозапуск и автообновление ==="
sudo tee /etc/systemd/system/tatarbot.service >/dev/null <<EOF
[Unit]
Description=TatarlargaBot
After=network-online.target

[Service]
User=$RUN_USER
WorkingDirectory=$DIR
EnvironmentFile=$DIR/.env
ExecStart=$DIR/.venv/bin/python $DIR/bot/bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/tatarbot-update.service >/dev/null <<EOF
[Unit]
Description=Update TatarlargaBot from GitHub

[Service]
Type=oneshot
User=$RUN_USER
WorkingDirectory=$DIR
ExecStart=/bin/bash $DIR/update.sh
EOF

sudo tee /etc/systemd/system/tatarbot-update.timer >/dev/null <<EOF
[Unit]
Description=Hourly update of TatarlargaBot

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
EOF

# обновлению нужно право перезапускать бота без пароля
echo "$RUN_USER ALL=(root) NOPASSWD: /usr/bin/systemctl restart tatarbot" | \
  sudo tee /etc/sudoers.d/tatarbot >/dev/null
sudo chmod 440 /etc/sudoers.d/tatarbot

sudo systemctl daemon-reload
sudo systemctl enable --now tatarbot tatarbot-update.timer
sudo systemctl restart tatarbot
sleep 5
echo
if systemctl is-active --quiet tatarbot; then
  echo "✅ Готово! Бот работает. Откройте его в Telegram и нажмите /start"
else
  echo "❌ Бот не запустился. Скопируйте текст ниже и пришлите его в чат:"
  sudo journalctl -u tatarbot -n 30 --no-pager
fi
