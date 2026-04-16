#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
reports_dir="$(cd "$script_dir/.." && pwd)"
template_file="$reports_dir/templates/report_template.md"
history_dir="$reports_dir/history"
repo_root="$(cd "$reports_dir/../.." && pwd)"

mkdir -p "$history_dir"

if [[ ! -f "$template_file" ]]; then
  echo "Template not found: $template_file" >&2
  exit 1
fi

report_id="${TEST_REPORT_ID:-$(date -u +%Y-%m-%d_%H-%M-%S)}"
report_time="${TEST_REPORT_TIME:-$(date -u '+%Y-%m-%d %H:%M:%S UTC')}"
commit_sha="${TEST_COMMIT_SHA:-$(git -C "$repo_root" rev-parse --short HEAD 2>/dev/null || echo unknown)}"
branch_name="${TEST_BRANCH_NAME:-$(git -C "$repo_root" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)}"
trigger_source="${TEST_TRIGGER_SOURCE:-manual}"
execution_environment="${TEST_EXECUTION_ENVIRONMENT:-Local Dev Server}"
api_base_url="${TEST_API_BASE_URL:-}"
if [[ -z "$api_base_url" ]]; then
  api_base_url="https://fit5120-tm11.onrender.com"
fi

output_file="$history_dir/${report_id}.md"
if [[ -e "$output_file" ]]; then
  suffix=2
  while [[ -e "$history_dir/${report_id}_$suffix.md" ]]; do
    suffix=$((suffix + 1))
  done
  output_file="$history_dir/${report_id}_$suffix.md"
fi

rendered_report="$(cat "$template_file")"
rendered_report="${rendered_report//'{{REPORT_ID}}'/$report_id}"
rendered_report="${rendered_report//'{{REPORT_TIME}}'/$report_time}"
rendered_report="${rendered_report//'{{COMMIT_SHA}}'/$commit_sha}"
rendered_report="${rendered_report//'{{BRANCH_NAME}}'/$branch_name}"
rendered_report="${rendered_report//'{{TRIGGER_SOURCE}}'/$trigger_source}"
rendered_report="${rendered_report//'{{EXECUTION_ENVIRONMENT}}'/$execution_environment}"
rendered_report="${rendered_report//'{{API_BASE_URL}}'/$api_base_url}"

printf '%s\n' "$rendered_report" > "$output_file"

echo "Generated report: $output_file"