#!/usr/bin/env bash
set -uo pipefail

FETCH_REF="+refs/heads/main:refs/remotes/origin/main"

fetch_git_history() {
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo "[git-history] No Git metadata found; using available build files."
    return 0
  fi

  if ! git remote get-url origin >/dev/null 2>&1; then
    echo "[git-history] No origin remote found; using available Git history."
    return 0
  fi

  IS_SHALLOW="$(git rev-parse --is-shallow-repository 2>/dev/null || echo false)"

  if [ "$IS_SHALLOW" = "true" ]; then
    git fetch --unshallow --tags --force origin "$FETCH_REF" && return 0
    git fetch --deepen=1000000 --tags --force origin "$FETCH_REF" && return 0
  else
    git fetch --tags --force origin "$FETCH_REF" && return 0
  fi

  echo "[git-history] Could not fetch full history; continuing build with available history."
  return 0
}

fetch_git_history

rm -rf site
.venv/bin/python -m mkdocs build
