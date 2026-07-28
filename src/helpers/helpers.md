# Home Assistant Frontend source helpers

Sub directories match subdirectories in Home Assistant Frontend `src` directory with corresponding files matching those in Frontend. This allows for checking state is not active to apply CSS color via style as `color` for `<state-badge>` only applies when active since Home Assistant 2026.8.0. Only the `HassEntity` important changes to include from `hass.ts` helper rather than including the websocket repository just for this import.
