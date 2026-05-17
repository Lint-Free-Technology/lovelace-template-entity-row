from __future__ import annotations

import os
from functools import partial
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

os.environ.setdefault("HA_CONFIG_PATH", str(REPO_ROOT / "tests" / "ha-config"))
os.environ.setdefault("HA_PLUGINS_YAML", str(REPO_ROOT / "tests" / "plugins.yaml"))

# Import after env setup so scenario_runner picks up these defaults at module import time.
import ha_testcontainer.visual.scenario_runner as _sr  # noqa: E402

_sr.SCENARIOS_DIR = REPO_ROOT / "tests" / "visual" / "scenarios"
_sr.SNAPSHOTS_DIR = REPO_ROOT / "tests" / "visual" / "snapshots"
_sr.REPO_ROOT = REPO_ROOT
_sr.DOCS_SCENARIOS_DIR = _sr.REPO_ROOT / "docs" / "scenarios"
_sr.assert_snapshot = partial(_sr.assert_snapshot, snapshots_dir=_sr.SNAPSHOTS_DIR)
