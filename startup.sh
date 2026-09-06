#!/bin/sh
set -eu
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:3000/; then
  exit 0
fi
npm run dev -- --host 0.0.0.0 --port 3000 >> /tmp/app-startup.log 2>&1 &
