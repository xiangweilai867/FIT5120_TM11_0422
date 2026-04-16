#!/usr/bin/env python3
"""
本地测试 POST /scan：取 Token（或使用已有 Token）→ 上传图片 → 打印 JSON。

依赖：仅 Python 标准库（urllib / json）。

用法:
  cd nutri-health-api
  python3 scripts/run_scan_test.py
  python3 scripts/run_scan_test.py /path/to/food.jpg

环境变量:
  BASE_URL       默认 http://127.0.0.1:8000
  ACCESS_TOKEN   若已设置则跳过 /token，直接用该 Bearer
  SCAN_USERNAME  与 SCAN_PASSWORD 配合，从 /token 取 token（默认 demo / demo123）
  SCAN_PASSWORD
"""
from __future__ import annotations

import json
import mimetypes
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path


def _repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def _default_image() -> Path:
    p = _repo_root() / "stories" / "story-1" / "cover.jpg"
    return p


def _post_token(base_url: str) -> str:
    user = os.environ.get("SCAN_USERNAME", "demo")
    password = os.environ.get("SCAN_PASSWORD", "demo123")
    data = urllib.parse.urlencode({"username": user, "password": password}).encode()
    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/token",
        data=data,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode())
    return body["access_token"]


def _post_scan(base_url: str, token: str, image_path: Path) -> dict:
    boundary = f"----NutriBoundary{uuid.uuid4().hex}"
    filename = image_path.name
    ctype = mimetypes.guess_type(str(image_path))[0] or "application/octet-stream"
    file_bytes = image_path.read_bytes()

    part_header = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f"Content-Type: {ctype}\r\n\r\n"
    ).encode("utf-8")
    part_footer = f"\r\n--{boundary}--\r\n".encode("utf-8")
    body = part_header + file_bytes + part_footer

    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/scan",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        return json.loads(resp.read().decode())


def _print_summary(data: dict) -> None:
    print()
    print("--- 摘要 ---")
    print(f"  recognised:      {data.get('recognised')}")
    print(f"  confidence:      {data.get('confidence')}")
    print(f"  food_name:       {data.get('food_name')}")
    print(f"  assessment_score:{data.get('assessment_score')}")
    alts = data.get("alternatives") or []
    print(f"  alternatives:    {len(alts)} 条")
    for i, a in enumerate(alts, 1):
        name = a.get("name", "?")
        url = (a.get("image_url") or "").strip()
        extra = f"  image_url={url[:80]}..." if len(url) > 80 else (f"  image_url={url}" if url else "")
        print(f"    [{i}] {name}")
        if extra:
            print(f"        {extra}")


def main() -> int:
    base_url = os.environ.get("BASE_URL", "http://127.0.0.1:8000").rstrip("/")

    if len(sys.argv) >= 2:
        image_path = Path(sys.argv[1]).expanduser().resolve()
    else:
        image_path = _default_image()

    if not image_path.is_file():
        print(f"图片不存在: {image_path}", file=sys.stderr)
        print("用法: python3 scripts/run_scan_test.py [/绝对或相对路径/照片.jpg]", file=sys.stderr)
        return 1

    token = (os.environ.get("ACCESS_TOKEN") or "").strip()
    try:
        if token:
            print(f">>> 使用环境变量 ACCESS_TOKEN（跳过 /token）")
        else:
            print(f">>> POST {base_url}/token")
            token = _post_token(base_url)
        print(f">>> POST {base_url}/scan  file={image_path}")
        data = _post_scan(base_url, token, image_path)
    except urllib.error.HTTPError as e:
        err = e.read().decode(errors="replace")
        print(f"HTTP {e.code}: {err}", file=sys.stderr)
        return 1
    except urllib.error.URLError as e:
        print(f"请求失败: {e.reason}", file=sys.stderr)
        return 1

    print(json.dumps(data, indent=2, ensure_ascii=False))
    _print_summary(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
