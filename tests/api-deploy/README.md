# API Deploy & Smoke Tests

Place deployment smoke checks and API integration probes here.

Planned checks:
- API starts successfully
- /health returns healthy status
- basic auth-required endpoint behavior is correct

Notes:
- Token and authenticated scan checks run only when API_USERNAME/API_PASSWORD are supplied.
- Health and unauthorized scan checks always run against the configured API base URL.
