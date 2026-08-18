#!/usr/bin/env bash
# PostToolUse: `astro check` after editing .astro/.tsx/.ts source.
# astro check is heavy, so CPU-leashed (nice + timeout) and gated by file type.
# Non-blocking: always exits 0; type errors surface on stderr only.

file="$(jq -r '.tool_input.file_path // empty' 2>/dev/null)"
case "$file" in
  *.astro|*.tsx|*.ts) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
nice -n 19 timeout 120 npx astro check 1>&2 || true
exit 0
