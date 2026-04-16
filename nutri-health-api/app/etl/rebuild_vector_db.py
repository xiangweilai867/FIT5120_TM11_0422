"""
One-time ETL script: rebuild the FAISS vector index from CN seed data.

Run from the project root:
    python -m app.etl.rebuild_vector_db

Requires DASHSCOPE_API_KEY to be set in .env or environment.
Reads:
    data/seed/cn_fdes.json
    data/seed/cn_ctgnme.json
    data/seed/cn_food_tags.json
Writes:
    data/food_vector_db/index.faiss
    data/food_vector_db/index.pkl  (overwrites existing files)
"""

import json
import logging
import os
import argparse
from collections import defaultdict
from pathlib import Path

from app.load_env import ensure_dotenv_loaded
from app.services.embedding_provider import get_embeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
SEED_DIR = BASE_DIR / "data" / "seed"
VECTOR_DB_PATH = BASE_DIR / "data" / "food_vector_db"
FDES_JSON = SEED_DIR / "cn_fdes.json"
CTGNME_JSON = SEED_DIR / "cn_ctgnme.json"
FOOD_TAGS_JSON = SEED_DIR / "cn_food_tags.json"
INDEX_FILES = [VECTOR_DB_PATH / "index.faiss", VECTOR_DB_PATH / "index.pkl"]


def _load_json_array(path: Path) -> list[dict]:
    with path.open("r", encoding="utf-8") as fh:
        payload = json.load(fh)
    if not isinstance(payload, list):
        raise ValueError(f"{path} must contain a JSON array")
    return payload


def _build_category_lookup(rows: list[dict]) -> dict[int, str]:
    lookup: dict[int, str] = {}
    for row in rows:
        code = row.get("food_category_code")
        description = (row.get("category_description") or "").strip()
        if code is not None and description:
            lookup[int(code)] = description
    return lookup


def _build_tag_lookup(rows: list[dict]) -> dict[int, list[str]]:
    tags_by_food: dict[int, list[str]] = defaultdict(list)
    for row in rows:
        cn_code = row.get("cn_code")
        tag_type = (row.get("tag_type") or "").strip()
        tag_value = (row.get("tag_value") or "").strip()
        if cn_code is None or not tag_value:
            continue
        label = f"{tag_type}: {tag_value}" if tag_type else tag_value
        tags_by_food[int(cn_code)].append(label)
    return tags_by_food


def _join_non_empty(parts: list[str]) -> str:
    return ", ".join([part for part in parts if part])


def build_document(record: dict, category_lookup: dict[int, str], tag_lookup: dict[int, list[str]]) -> Document:
    cn_code = int(record["cn_code"])
    descriptor = (record.get("descriptor") or "").strip()
    category_description = category_lookup.get(record.get("food_category_code"), "")
    brand_name = (record.get("brand_name") or "").strip()
    brand_owner_name = (record.get("brand_owner_name") or "").strip()
    brand_text = _join_non_empty([brand_name, brand_owner_name])
    tags = tag_lookup.get(cn_code, [])
    tags_text = ", ".join(tags)

    page_content = "\n".join(
        [
            f"Descriptor: {descriptor}",
            f"Category: {category_description or 'Unknown'}",
            f"Brand: {brand_text or 'Generic'}",
            f"Tags: {tags_text or 'None'}",
        ]
    )

    return Document(
        page_content=page_content,
        metadata={
            "cn_code": cn_code,
            "name": descriptor,
            "descriptor": descriptor,
            "food_category_code": record.get("food_category_code"),
            "category_description": category_description,
            "brand_name": brand_name,
            "brand_owner_name": brand_owner_name,
            "health_grade": record.get("health_grade"),
            "tags": tags,
        },
    )


def _delete_existing_index_files() -> None:
    for path in INDEX_FILES:
        if path.exists():
            logger.info("Removing old index file: %s", path)
            path.unlink()


def main():
    parser = argparse.ArgumentParser(description="Rebuild FAISS vector index from CN seed data")
    parser.add_argument("--limit", type=int, default=None, help="Only index the first N cn_fdes rows for smoke tests")
    args = parser.parse_args()

    ensure_dotenv_loaded()

    if not os.getenv("DASHSCOPE_API_KEY"):
        raise EnvironmentError("DASHSCOPE_API_KEY is not set.")

    logger.info("Loading seed data from %s ...", SEED_DIR)
    records = _load_json_array(FDES_JSON)
    if args.limit is not None:
        if args.limit <= 0:
            raise ValueError("--limit must be a positive integer")
        records = records[: args.limit]
    category_lookup = _build_category_lookup(_load_json_array(CTGNME_JSON))
    tag_lookup = _build_tag_lookup(_load_json_array(FOOD_TAGS_JSON))
    logger.info("Loaded %d cn_fdes records.", len(records))

    docs = [build_document(record, category_lookup, tag_lookup) for record in records if record.get("cn_code") is not None]

    logger.info("Initialising Qwen embedding model ...")
    embeddings = get_embeddings()

    logger.info("Building FAISS index (this will call the DashScope API) ...")
    vectorstore = FAISS.from_documents(docs, embeddings)

    logger.info("Saving FAISS index to %s ...", VECTOR_DB_PATH)
    VECTOR_DB_PATH.mkdir(parents=True, exist_ok=True)
    _delete_existing_index_files()
    vectorstore.save_local(VECTOR_DB_PATH)

    logger.info("Done. Files written: index.faiss, index.pkl")


if __name__ == "__main__":
    main()
