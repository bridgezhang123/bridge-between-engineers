import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT / "docs"
OUTPUT = ROOT / "hooks" / "page_dates.json"


def run_git(*args):
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def page_dates(path):
    rel_path = path.relative_to(ROOT).as_posix()
    output = run_git(
        "log",
        "--follow",
        "--date=unix",
        "--format=%at%x09%H",
        "--",
        rel_path,
    )
    revisions = []
    for line in output.splitlines():
        if not line.strip():
            continue
        timestamp, commit_hash = line.split("\t", 1)
        revisions.append((int(timestamp), commit_hash))

    if not revisions:
        return None

    created_timestamp, created_hash = min(revisions, key=lambda item: item[0])
    updated_timestamp, updated_hash = max(revisions, key=lambda item: item[0])
    return {
        "created": created_timestamp,
        "created_hash": created_hash,
        "updated": updated_timestamp,
        "updated_hash": updated_hash,
    }


def main():
    dates = {}
    for path in sorted(DOCS_DIR.rglob("*.md")):
        rel_path = path.relative_to(ROOT).as_posix()
        value = page_dates(path)
        if value:
            dates[rel_path] = value

    OUTPUT.write_text(
        json.dumps(dates, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(dates)} page date records to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
