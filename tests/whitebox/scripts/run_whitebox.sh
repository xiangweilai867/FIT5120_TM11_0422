#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

export PYTHONPATH="$repo_root/nutri-health-api${PYTHONPATH:+:$PYTHONPATH}"
pytest "$repo_root/tests/whitebox" -q
