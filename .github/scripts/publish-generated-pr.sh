#!/usr/bin/env bash
# Publish FootMate's regenerated editable decks as a review PR, never directly to main.
set -euo pipefail
kind="${1:?generator identifier required}"
title="${2:?commit title required}"
shift 2
test "$#" -gt 0 || { echo "::error::No generated paths specified"; exit 1; }
[[ "$kind" =~ ^[a-z][a-z0-9-]*$ ]] || { echo "::error::Invalid generator identifier"; exit 1; }

if [[ "${GITHUB_REF:-}" != "refs/heads/main" ]] ||
   [[ "${GITHUB_EVENT_NAME:-}" != "workflow_dispatch" ]]; then
  echo "Not publishing: only a trusted manual run on main can open generated asset PRs."
  exit 0
fi

: "${GITHUB_REPOSITORY:?GitHub repository required}"
: "${GITHUB_RUN_ID:?GitHub run ID required}"
: "${GITHUB_RUN_ATTEMPT:?GitHub run attempt required}"
: "${GH_TOKEN:?GitHub Actions PR token required}"

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add -A -- "$@"
if git diff --cached --quiet; then
  echo "Generated assets are already in sync; no PR is required."
  exit 0
fi
branch="automation/${kind}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}"
git commit -m "$title"
git push origin "HEAD:refs/heads/${branch}"

body="Generated artifacts from FootMate Design Sync run ${GITHUB_RUN_ID} (attempt ${GITHUB_RUN_ATTEMPT}).

Please review the two editable PPTX files and all 15 previews. Confirm FootMate Case Study QA succeeds before merging. A GITHUB_TOKEN-generated PR may require workflow approval or a separate QA trigger.

This automation never writes generated assets to main and never auto-merges."
if ! gh pr create --repo "$GITHUB_REPOSITORY" --base main --head "$branch" --title "$title" --body "$body"; then
  echo "::error::Could not create asset PR. Enable Actions > General > Allow GitHub Actions to create and approve pull requests; then retry or review the preserved automation branch."
  exit 1
fi
