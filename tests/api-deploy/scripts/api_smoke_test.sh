#!/usr/bin/env bash
set -euo pipefail

base_url="${API_BASE_URL:-https://fit5120-tm11.onrender.com}"
username="${API_USERNAME:-${DEMO_USERNAME:-}}"
password="${API_PASSWORD:-${DEMO_PASSWORD:-}}"

request_json() {
  local method="$1"
  local url="$2"
  shift 2

  curl -sS -w '\n%{http_code}' -X "$method" "$url" "$@"
}

split_response() {
  local response="$1"
  body="${response%$'\n'*}"
  status="${response##*$'\n'}"
}

check_health() {
  local response body status
  response="$(request_json GET "$base_url/health")"
  split_response "$response"

  if [[ "$status" != "200" ]]; then
    echo "Health check failed with status $status" >&2
    echo "$body" >&2
    exit 1
  fi

  python3 - <<'PY' "$body"
import json, sys
payload = json.loads(sys.argv[1])
assert payload.get("status") == "healthy", payload
assert payload.get("service") == "nutrihealth-api", payload
PY
}

check_token() {
  # Keep API smoke tests non-blocking when credentials are not configured in CI.
  if [[ -z "$username" || -z "$password" ]]; then
    echo "Skipping token/authenticated scan checks because API_USERNAME/API_PASSWORD were not provided."
    return 1
  fi

  local response body status token
  response="$(request_json POST "$base_url/token" -H 'Content-Type: application/x-www-form-urlencoded' -d "username=$username&password=$password")"
  split_response "$response"

  if [[ "$status" != "200" ]]; then
    echo "Token request failed with status $status" >&2
    echo "$body" >&2
    exit 1
  fi

  token="$(python3 - <<'PY' "$body"
import json, sys
payload = json.loads(sys.argv[1])
print(payload["access_token"])
PY
)"

  if [[ -z "$token" ]]; then
    echo "Access token was empty" >&2
    exit 1
  fi

  printf '%s' "$token"
}

check_scan_unauthorized() {
  local response body status
  response="$(request_json POST "$base_url/scan" -F 'file=@/dev/null;type=image/png;filename=empty.png')"
  split_response "$response"

  if [[ "$status" != "401" ]]; then
    echo "Unauthorized scan should return 401, got $status" >&2
    echo "$body" >&2
    exit 1
  fi
}

check_scan_validation() {
  local token="$1"
  local temp_file response body status

  temp_file="$(mktemp)"
  trap 'rm -f "$temp_file"' EXIT
  printf 'not-an-image' > "$temp_file"

  response="$(curl -sS -w '\n%{http_code}' -X POST "$base_url/scan" \
    -H "Authorization: Bearer $token" \
    -F "file=@$temp_file;type=text/plain;filename=sample.txt")"
  split_response "$response"

  if [[ "$status" != "400" ]]; then
    echo "Validation scan should return 400, got $status" >&2
    echo "$body" >&2
    exit 1
  fi
}

check_health

# This check must always pass and does not require credentials.
check_scan_unauthorized

# Only run authenticated validation when token credentials are available.
if token="$(check_token)"; then
  check_scan_validation "$token"
fi

echo "API smoke tests passed for $base_url"
