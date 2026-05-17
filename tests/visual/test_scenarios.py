from __future__ import annotations

import pytest
from playwright.sync_api import Page

from ha_testcontainer.visual.scenario_runner import (
    clear_scenario,
    goto_scenario,
    load_all_scenarios,
    push_scenario,
    reset_theme,
    run_assertions,
    run_interactions,
    set_theme,
)

_ALL_SCENARIOS = load_all_scenarios()
_SCENARIO_IDS = [s["id"] for s in _ALL_SCENARIOS]
_SCENARIO_MAP = {s["id"]: s for s in _ALL_SCENARIOS}


@pytest.mark.parametrize("scenario_id", _SCENARIO_IDS)
def test_scenario(
    scenario_id: str,
    ha,
    ha_page: Page,
    ha_url: str,
    ha_lovelace_url_path: str,
) -> None:
    scenario = _SCENARIO_MAP[scenario_id]
    theme = scenario.get("theme")

    push_scenario(ha, ha_lovelace_url_path, scenario)
    if theme:
        set_theme(ha, theme)

    try:
        run_interactions(ha_page, scenario, ha=ha, key="setup")
        goto_scenario(ha_page, ha_url, ha_lovelace_url_path, scenario["view_path"])
        run_interactions(ha_page, scenario, ha=ha)
        run_assertions(ha_page, scenario)
    finally:
        run_interactions(ha_page, scenario, ha=ha, key="teardown")
        if theme:
            reset_theme(ha)
        clear_scenario(ha, ha_lovelace_url_path)
