#!/bin/sh
set -e

DATA_DIR=${DATA_DIR:-/data}
DB_FILE="$DATA_DIR/db.json"
TEMPLATE_FILE="$DATA_DIR/db.template.json"

mkdir -p "$DATA_DIR"

if [ ! -f "$DB_FILE" ] && [ -f "$TEMPLATE_FILE" ]; then
  cp "$TEMPLATE_FILE" "$DB_FILE"
  echo "Created db.json from template."
fi

exec json-server --watch "$DB_FILE" --host 0.0.0.0 --port "${PORT:-3034}"
