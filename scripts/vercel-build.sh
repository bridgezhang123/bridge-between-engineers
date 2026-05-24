#!/usr/bin/env bash
set -euo pipefail

FETCH_REF="+refs/heads/main:refs/remotes/origin/main"

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  git fetch --unshallow --tags --force origin "$FETCH_REF" || \
    git fetch --deepen=1000000 --tags --force origin "$FETCH_REF"
else
  git fetch --tags --force origin "$FETCH_REF"
fi

rm -rf site
.venv/bin/python -m mkdocs build
