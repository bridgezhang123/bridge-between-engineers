import os
import subprocess
from pathlib import Path

from git import Repo

from mkdocs_git_revision_date_localized_plugin.util import Util


def _run_git(repo_root, *args):
    return subprocess.run(
        ["git", *args],
        cwd=repo_root,
        check=False,
        capture_output=True,
        text=True,
    )


def _is_shallow_repository(repo_root):
    result = _run_git(repo_root, "rev-parse", "--is-shallow-repository")
    return result.returncode == 0 and result.stdout.strip().lower() == "true"


def _ensure_full_history(repo_root):
    is_vercel = os.environ.get("VERCEL") == "1"
    is_shallow = _is_shallow_repository(repo_root)

    if not is_vercel and not is_shallow:
        return

    remote = _run_git(repo_root, "remote", "get-url", "origin")
    if remote.returncode != 0:
        print("[git-history] No origin remote found; using available Git history.")
        return

    fetch_ref = "+refs/heads/main:refs/remotes/origin/main"

    if is_shallow:
        unshallow = _run_git(repo_root, "fetch", "--unshallow", "--tags", "--force", "origin", fetch_ref)
        if unshallow.returncode == 0:
            print("[git-history] Expanded shallow clone to full history.")
            return

    full_fetch = _run_git(repo_root, "fetch", "--tags", "--force", "origin", fetch_ref)
    if full_fetch.returncode == 0:
        print("[git-history] Refreshed full origin/main history for page dates.")
        return

    deepen = _run_git(repo_root, "fetch", "--deepen=1000000", "--tags", "--force", "origin", fetch_ref)
    if deepen.returncode == 0:
        print("[git-history] Deepened Git history for page dates.")
        return

    print("[git-history] Could not fetch full history; page creation dates may use the available clone history.")


def _resolve_locale(page, config):
    locale = getattr(page.file, "locale", None)
    if not locale and "locale" in page.meta:
        locale = page.meta["locale"]
    if not locale:
        theme = config.get("theme") or {}
        locale = theme.get("language") or "en"
    return locale


def _get_creation_timestamp(abs_src_path, repo_root):
    repo = Repo(repo_root, search_parent_directories=True)
    repo_root = Path(repo_root).resolve()
    source_path = Path(abs_src_path).resolve()
    try:
        rel_path = source_path.relative_to(repo_root)
    except ValueError:
        return None

    result = repo.git.log(
        "--follow",
        "--date=unix",
        "--format=%at",
        str(rel_path),
    )
    values = [int(value) for value in result.splitlines() if value.strip()]
    if not values:
        return None
    return min(values)


def on_config(config, **kwargs):
    repo_root = Path(__file__).resolve().parent.parent
    _ensure_full_history(repo_root)
    return config


def on_page_markdown(markdown, page, config, files, **kwargs):
    if not getattr(page.file, "abs_src_path", None):
        return markdown

    repo_root = Path(__file__).resolve().parent.parent
    timestamp = _get_creation_timestamp(page.file.abs_src_path, repo_root)
    if timestamp is None:
        return markdown

    locale = _resolve_locale(page, config)
    util = Util(
        config={
            "type": "date",
            "timezone": "UTC",
            "locale": locale,
            "custom_format": "%d. %B %Y",
            "strict": False,
            "ignored_commits_file": None,
            "fallback_to_build_date": False,
            "enable_git_follow": True,
        },
        mkdocs_dir=str(repo_root),
    )

    creation_dates = util.get_date_formats_for_timestamp(timestamp, locale=locale, add_spans=True)
    page.meta["git_creation_date_localized"] = creation_dates["date"]
    creation_dates_raw = util.get_date_formats_for_timestamp(timestamp, locale=locale, add_spans=False)
    for date_type, date_string in creation_dates_raw.items():
        page.meta[f"git_creation_date_localized_raw_{date_type}"] = date_string

    return markdown
