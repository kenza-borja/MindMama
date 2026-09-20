"""
Shared-secret check for the AI endpoints.

The service is publicly reachable once deployed, and every /ai/* route costs
Groq tokens on the project key. The Node backend is the only intended caller
and sends AI_API_KEY as x-api-key.

With AI_API_KEY unset the check is skipped so local development and tests keep
working. Deployed environments must set it.
"""

import os
from secrets import compare_digest

from fastapi import Header, HTTPException


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
    expected = os.getenv("AI_API_KEY", "").strip()

    if not expected:
        return

    # Trim: dashboard paste boxes and shell quoting pick up stray whitespace,
    # which would otherwise be indistinguishable from a wrong key.
    provided = (x_api_key or "").strip()

    if not compare_digest(provided, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")
