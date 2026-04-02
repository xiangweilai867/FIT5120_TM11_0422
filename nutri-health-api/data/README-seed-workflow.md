# Seed and ETL Input Layout

Put files in the following folders.

## 1) Raw source JSON (your original data)
- Path: data/raw/
- Keep the original filename from source systems.
- Do not manually rename keys yet.

## 2) Mapping and transform rules
- Path: data/mapping/
- Put lookup tables, key mapping, enum mapping, and value normalization rules here.

## 3) Staging outputs (cleaned intermediate data)
- Path: data/staging/
- ETL scripts write normalized intermediate JSON here.

## 4) Final seed payloads (database-ready)
- Path: data/seed/
- ETL scripts write final JSON for DB initialization here.

## 5) ETL code
- Path: app/etl/
- Put transform scripts here, for example:
  - app/etl/transform_raw_to_staging.py
  - app/etl/build_seed_payload.py

## Suggested next input from you
1. Database design (tables, columns, types, constraints, unique keys, foreign keys).
2. One or more sample raw JSON files in data/raw/.
3. Business rules for computed keys and derived fields.
