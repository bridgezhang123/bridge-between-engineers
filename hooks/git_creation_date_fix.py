from pathlib import Path

from git import Repo

from mkdocs_git_revision_date_localized_plugin.util import Util


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
    result = repo.git.log(
        "--follow",
        "--reverse",
        "--date=unix",
        "--format=%at",
        "--diff-filter=A",
        str(Path(abs_src_path).resolve()),
    )
    values = [int(value) for value in result.splitlines() if value.strip()]
    if not values:
        return None
    return min(values)


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
