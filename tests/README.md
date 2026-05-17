# template-entity-row tests

This repository uses [ha-testcontainer](https://github.com/Lint-Free-Technology/ha-testcontainer)
for Home Assistant visual tests.

## Prerequisites

- Docker
- Python 3.11+
- Node dependencies installed and build generated (`npm ci && npm run build`)

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[test]'
playwright install chromium
```

## Setup and run tests (VS Code tasks or CLI)

Home Assistant test version is read from `tests/HA_VERSION`.

### VS Code tasks

Open **Run Task...** and use:

- `Python: Set up virtual environment`
- `HA: Start persistent server` (optional when iterating)
- `pytest: Visual scenarios`
- `pytest: Visual scenarios (Update)`
- `pytest: Visual scenario - single`
- `pytest: Doc images`
- `pytest: Doc images (Update)`

### CLI

```bash
pytest tests/visual/test_scenarios.py
pytest tests/visual/test_doc_images.py
pytest tests/visual/test_scenarios.py -k templates
SNAPSHOT_UPDATE=1 pytest tests/visual/test_scenarios.py
DOC_IMAGE_UPDATE=1 pytest tests/visual/test_doc_images.py
```
