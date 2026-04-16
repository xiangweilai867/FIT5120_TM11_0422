#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
reports_dir="$(cd "$script_dir/.." && pwd)"
history_dir="$reports_dir/history"
repo_root="$(cd "$reports_dir/../.." && pwd)"
artifacts_dir="$reports_dir/artifacts"
whitebox_metrics_json="$artifacts_dir/whitebox_metrics.json"
api_metrics_json="$artifacts_dir/api_metrics.json"

mkdir -p "$history_dir"

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

python3 - <<'PY' "$output_file" "$report_id" "$report_time" "$commit_sha" "$branch_name" "$trigger_source" "$execution_environment" "$api_base_url" "$whitebox_metrics_json" "$api_metrics_json"
import json
import os
import sys

(
    output_file,
    report_id,
    report_time,
    commit_sha,
    branch_name,
    trigger_source,
    execution_environment,
    api_base_url,
    whitebox_metrics_json,
    api_metrics_json,
) = sys.argv[1:11]


def load_json(path):
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


wb = load_json(whitebox_metrics_json)
api = load_json(api_metrics_json)

coverage = wb.get("coverage_percent")
if isinstance(coverage, (int, float)):
    coverage_text = f"{coverage:.2f}% Line Coverage (app package)."
else:
    coverage_text = "N/A (run whitebox script first)."

wb_pass_rate = wb.get("pass_rate_percent")
wb_pass_rate_text = (
    f"{wb.get('tests_passed', 0)}/{wb.get('tests_total', 0)} ({wb_pass_rate:.2f}%)"
    if isinstance(wb_pass_rate, (int, float))
    else "N/A"
)

endpoint_coverage = api.get("endpoint_coverage", [])
endpoint_text = ", ".join(endpoint_coverage) if endpoint_coverage else "N/A (run api smoke script first)."

status_distribution = api.get("status_distribution", {})
if status_distribution:
    status_text = ", ".join([f"{k}: {v}" for k, v in status_distribution.items()])
else:
    status_text = "N/A"

success_rate = api.get("status_success_2xx_rate_percent")
success_rate_text = f"{success_rate:.2f}% 2xx responses" if isinstance(success_rate, (int, float)) else "N/A"

avg_ms = api.get("avg_latency_ms")
p95_ms = api.get("p95_latency_ms")
perf_text = (
    f"Avg: {avg_ms}ms / P95: {p95_ms}ms (current run)."
    if isinstance(avg_ms, (int, float)) and isinstance(p95_ms, (int, float))
    else "N/A"
)

api_pass_rate = api.get("pass_rate_percent")
api_pass_rate_text = (
    f"{api.get('checks_passed', 0)}/{api.get('checks_total', 0)} ({api_pass_rate:.2f}%)"
    if isinstance(api_pass_rate, (int, float))
    else "N/A"
)

lines = [
    f"# Test Report - {report_id}",
    "",
    "## Meta",
    "",
    f"- Report Time: {report_time}",
    f"- Commit SHA: {commit_sha}",
    f"- Branch: {branch_name}",
    f"- Trigger Source: {trigger_source}",
    f"- Execution Environment: {execution_environment}",
    f"- API Base URL: {api_base_url}",
    "",
    "## White-box Summary",
    "",
    "| 汇总信息项 | 描述 | 当前运行数据 |",
    "| --- | --- | --- |",
    f"| Test Scope | 哪些核心模块或函数被测试了。 | {wb.get('test_scope', 'N/A')} |",
    f"| Tooling | 使用的工具。 | {wb.get('tooling', 'N/A')} |",
    f"| Code Coverage | 最核心指标。 | {coverage_text} |",
    f"| Execution Environment | 运行环境。 | {execution_environment} |",
    f"| Edge Case Logic | 边界值处理情况。 | {wb.get('edge_case_logic', 'N/A')} |",
    "",
    "## API Test Summary",
    "",
    "| 汇总信息项 | 描述 | 当前运行数据 |",
    "| --- | --- | --- |",
    f"| Endpoint Coverage | 测试了哪些接口。 | {endpoint_text} |",
    f"| Status Code Distribution | 响应状态分布。 | {status_text} ({success_rate_text}) |",
    f"| Performance (P95) | 真实用户感知延迟。 | {perf_text} |",
    f"| Data Integrity | 数据一致性验证。 | {api.get('data_integrity', 'N/A')} |",
    f"| Resilience (Weak Net) | 弱网表现。 | {api.get('resilience', 'N/A')} |",
    "",
    "## Additional Quality Metrics",
    "",
    "| Metric | 描述 | 当前运行数据 |",
    "| --- | --- | --- |",
    f"| Test Pass Rate (White-box) | 白盒测试通过率。 | {wb_pass_rate_text} |",
    f"| Test Pass Rate (API) | API smoke 通过率。 | {api_pass_rate_text} |",
    f"| White-box Runtime | 白盒执行耗时。 | {wb.get('duration_seconds', 'N/A')} seconds |",
    "| Flaky Test Count | 近期有波动的用例数量。 | N/A (not tracked in this run) |",
    "| Regression Count | 本次引入的回归数量。 | N/A (not tracked in this run) |",
    "",
    "## Risks and Next Actions",
    "",
    "- Risks:",
    "- Blockers:",
    "- Next actions:",
]

with open(output_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
PY

echo "Generated report: $output_file"