# template-entity-row

Forked from [thomasloven/lovelace-template-entity-row](https://github.com/thomasloven/lovelace-template-entity-row) to continue development of the stalled project.

Display whatever you want in an entities card row.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Lint-Free-Technology&repository=lovelace-template-entity-row&category=plugin)

To install via HACS, add this repo [https://github.com/Lint-Free-Technology/lovelace-template-entity-row](https://github.com/Lint-Free-Technology/lovelace-template-entity-row) as a [custom HACS repository](https://www.hacs.xyz/docs/faq/custom_repositories/)  using type `Dashboard`. Use the button above to do this in one step. You are best to remove [thomasloven/lovelace-template-entity-row](https://github.com/thomasloven/lovelace-template-entity-row) in your HACS to avoid confusion as to what repo you are using.

Install `template-entity-row.js` as a `module`.

```yaml
resources:
  - url: /local/template-entity-row.js
    type: module
```

## Usage example

**Note:** This is _not_ a card. It's a row for an [entities](https://www.home-assistant.io/lovelace/entities/) card.

![Quick start example](/docs/source/assets/animations/01_readme_example.gif)

```yaml
type: entities
title: Quick Start
entities:
  - light.bed_light
  - type: custom:template-entity-row
    icon: mdi:lamp
    name: "The light is {{states('light.bed_light')}} but nobody's"
    state: "{% if is_state('input_boolean.test_boolean', 'on')%} home {% else %} away {% endif %}"
    secondary: "It's {{ now().strftime('%H:%M') }}"
    active: "{{ is_state('light.bed_light', 'on') }}"
  - entity: input_boolean.test_boolean
    name: A toggle
  - type: custom:template-entity-row
    icon: "{% if is_state('input_boolean.test_boolean', 'on')%} mdi:check-circle-outline {% else %} mdi:close-circle-outline {% endif %}"
    name: "The toggle is {{states('input_boolean.test_boolean')}}"
    state: "{% if is_state('input_boolean.test_boolean', 'on')%}"
    active: "{{ is_state('input_boolean.test_boolean', 'on') }}"
    color: "{% if is_state('input_boolean.test_boolean', 'on')%} green {% else %} red {% endif %}"
```

## Options

<!-- markdownlint-disable MD033 -->
| Name | Type | Options | Description |
| --- | --- | --- | --- |
| `icon`<br>`state`<br>`image` | string | - | selects what `icon`, `state` and `entity_picture` to display respectively. |
| `name` | string / object | - | If set selects what `name` to show. Both string and flexible name object are supported. See [flexible name object](#flexible-name-object). If not set defaults to friendly name of `entity` |
| `secondary_name` | string / object | - | selects what name will show when `- name` is used for `secondary` when a secondary object config is used. Both string and flexible name object are supported. See [flexible name object](#flexible-name-object). If not set defaults to friendly name of `secondary_entity` if set, otherwise friendly name of `entity`. |
| `active` | boolean | `true` / `false` | If this evaluates to `true` or `false`, the icon  will always look active or inactive respectively. This should be used only if **not** using `entity`, otherwise you are best to template `state` to a valid raw (non localized) state for the entity’s device class. This enables `color` to work correctly when setting `entity` but wishing to override `state`. |
| `entity` | string | - | If this evaluates to an entity id, `icon`, `name`, `state` and `image` will be taken from that entity unless manually overridden. Specifying an `entity` will also let you use [actions](https://www.home-assistant.io/dashboards/actions/). If you don’t override `state` or `state_display` then the displayed state text will be the localized `entity` state, which includes any units. |
| `secondary_entity` | string | - | entity id used for `secondary_name` and `secondary` config. If not set then defaults to `entity`. |
| `secondary` | string / object | - | If string then this will show as secondary information. If object then will display information as per [secondary object config](#secondary-object-config). |
| `time_format` | string / object | - | When set controls the time format of any timestamp `secondary` config options. See Home Assistant [`time_format` options](https://www.home-assistant.io/dashboards/entities/#time_format) |
| `state_display` | string | - | If this is set then the displayed state text will be the text or rendered template as text. If you are using an `entity` but overriding `state`, then `state` needs to be a valid raw (non localized) state for the entity’s device class. Use `state_display` to display any localized state you wish to show. |
| `hidden` | boolean | - | If this is set and evaluates to `true`, the row is hidden and not displayed. Takes precedence over deprecated `condition`. |
| `condition`<br>**Deprecated** | boolean | - | **Deprecated**. Use `hidden` (opposite logic). If this is set but does not evaluate to `true`, the row is hidden and not displayed. |
| `toggle` | boolean | `true` / `false` | If this evaluates to `true` a toggle is shown instead of the state. The toggle is connected to the `entity`. This will only show a toggle, nothing else. No sliders, no dropdowns, no media controls. `toggle` means Toggle. NOTE: Both `toggle` and `button` cannot be set together. |
| `button` | boolean | `true` / `false` | If this is set then the state will be replaced with a button. If the value for `button` is `true` then the translated string `Press` will be used for the button. Otherwise a string is expected and will be used. If `button_action` is not set then the default action will be `input_button.press` for the config entity. NOTE: Both `toggle` and `button` cannot be set together. |
| `button_action` | object | Action config | Button action. Set to an action config. If not set the default action will be `input_button.press` for the config entity. |
| `color` | string | `state` (default)<br>`none`<br>color token<br>CSS color | drives the state color of the icon. By default, the color is based on the `state`, `domain`, and `device_class` of the entity. To take default color, set to `none`. It accepts `state`, `none`, a Home Assistant [color token](https://www.home-assistant.io/dashboards/tile/#available-colors), or a CSS color. |
| `color_inactive` | boolean | `true` / `false` | If this is set to `true` and `state` is not active, `color` is set by overriding `--state-icon-color` to `color`. This is required since Home Assistant 2026.8.0 where `<state-badge>` uses `color` only when active. |
| `nested_templates` | boolean | `true` / `false` | If set to `true`, enables nested bracket syntax (`[[`/`]]`) as an alternative to the standard `{{`/`}}` Jinja2 delimiters. This is useful in if using template entity in a card that uses Jinja templates itself. |
| `tap_action`<br>`hold_action`<br>`double_tap_action` | object | Action config | Primary actions. See [Actions](#actions). |
| `action_entity` | string | - | If set, overrides the entity id used for `tap_action`, `hold_action` and `double_tap_action`. See [Actions](#actions) |
| `secondary_action_entity` | string | - | If set, overrides the entity id used for `tap_action`, `hold_action` and `double_tap_action` when the action is executed on the `secondary` area. This allows the primary actions (e.g. `more-info`, `toggle`) to target the main entity while the `secondary` area targets a different entity. If not set then will default to `secondary_entity` if set, otherwise `entity`. See [Actions](#actions) |
| `icon_tap_action`<br>`icon_hold_action`<br>`icon_double_tap_action` | object | Action config | Icon actions. See [Actions](#actions). |
| `icon_action_entity` | string | - | If set, overrides the entity id used for `icon_tap_action`, `icon_hold_action` and `icon_double_tap_action`. See [Actions](#actions) |
| `state_tap_action`<br>`state_hold_action`<br>`state_double_tap_action` | object | Action config | State actions. See [Actions](#actions). |
| `state_action_entity` | string | - | If set, overrides the entity id used for `state_tap_action`, `state_hold_action` and `state_double_tap_action`. See [Actions](#actions) |

  | Standard Jinja2 | Nested (`nested_templates: true`) |
  | - | - |
  | `{{ expression }}` | `[[ expression ]]` |
  | `{% block tag %}` | `[% block tag %]` |
  | `{# comment #}` | `[# comment #]` |

  Example — set `nested_templates: true` and write:

  ```yaml
  type: custom:template-entity-row
  nested_templates: true
  name: "The light is [[ states('light.bed_light') ]]"
  state: "[% if is_state('input_boolean.car_home', 'on') %] home [% else %] away [% endif %]"
  ```

All options accept [jinja2 templates](https://www.home-assistant.io/docs/configuration/templating/).

Jinja templates have access to a few special variables. Those are:

- `config` - an object containing the card configuration
- `user` - the username of the currently logged in user
- `browser` - the deviceID of the current browser (see [browser_mod](https://github.com/thomasloven/hass-browser_mod)).
- `hash` - the hash part of the current URL.

In evaluated templates the function `_(<key>)` (underscore) will localize the `<key>` to the current language.
E.g. `_(component.binary_sensor.entity_component.motion.state.off)` will be replaced with `Clear` if your language is set to English.

To find the available keys you will need to browse the Home Assistant lokalise project. See [Home Assistant Internationalization](https://developers.home-assistant.io/docs/internationalization/) for more information.

### Flexible name object

`name` supports the standard Home Assistant [flexible name object](https://www.home-assistant.io/dashboards/naming/). This can be a string for a simple name, a single flexible name object or a list of flexible name objects.

Flexible name objects can be templated. The template needs to evaluate to a valid [flexible name object](https://www.home-assistant.io/dashboards/naming/) (either a single object or a list/array of objects). Standard YAML object without templates works too.

Flexible naming:

```yaml
type: entities
entities:
  - type: custom:template-entity-row
    entity: light.bed_light
    # Standard yaml configuration - No templates allowed
    name:
      - type: area
      - type: text
        text: ' - '
      - type: entity
  - type: custom:template-entity-row
    entity: light.bed_light
    # JSON return format
    name: |
      [
        { "type": "entity" },
        { 
          "type": "text",
          "text": " - {{ int(state_attr(config.entity, 'brightness') / 255 * 100)}}%"
        }
      ]
```

![Flexible naming example](/docs/source/assets/images/02_readme_flexible_naming.png)

### Secondary object config

`secondary` can either be a string or a secondary object config, which is a list of secondary options which will be displayed in order concatenated by ` · `. Any timestamp based option will show in the format set by `time_format` which can be set to supported Home Assistant entities [`time_format`](https://www.home-assistant.io/dashboards/entities/#time_format).

`secondary` option list can be templated. The template needs to evaluate to a valid list. Standard YAML list without templates works too.

`secondary` options:

- name
- state
- device_name
- area_name
- floor_name
- last_changed
- last_updated
- last_triggered (if available)
- _any attribute_

The following `secondary` options will be dynamically updated.

- `update.*`
  - install_status
- `timer.*`
  - remaining_time

- _NOTE: secondary object config will be coming to Home Assistant inbuilt rows in 2026.9. Once available in 2026.9, `entity-id` will also be a supported `secondary` option. Also coming in 2026.9 will be timestamp tooltips for any timestamp based option.

Secondary options:

```yaml
type: entities
entities:
  - type: custom:template-entity-row
    entity: sun.sun
    secondary_name: Next dawn
    secondary:
      - name
      - next_dawn
  - type: custom:template-entity-row
    entity: sun.sun
    secondary_name: |
      {{ "Next dusk" if states(config.entity) == 'above_horizon' else "Next dawn" }}
    secondary: |
      [
        "name",
        "{{ 'next_dusk' if states(config.entity) == 'above_horizon' else 'next_dawn' }}"
      ]
    time_format:
      type: time
      style: short
  - type: custom:template-entity-row
    entity: sun.sun
    secondary_entity: light.bed_light
    secondary:
      - name
      - state
      - brightness
```

![Secondary options example](docs/source/assets/images/03_readme_secondary_options.png)

### Actions

Actions are applied to the `info`, `icon` and `state` areas and will take primary actions by default. Actions for `icon` and `state` can be set specifically for each action type.

- Primary:
  - `tap_action`
  - `hold_action`
  - `double_tap_action`
- Icon actions:
  - `icon_tap_action` if set, otherwise `tap_action`
  - `icon_hold_action` if set, otherwise `hold_action`
  - `icon_double_tap_action` if set, otherwise `double_tap_action`
- State actions:
  - `state_tap_action` if set, otherwise `tap_action`
  - `state_hold_action` if set, otherwise `hold_action`
  - `state_double_tap_action` if set, otherwise `double_tap_action`

An override can be set for entity if for actions that operate on the config entity (e.g. `more-info`, `toggle`).

- Primary:
  - `action_entity` if set, otherwise main config `entity`
  - Secondary area:
    - `secondary_action_entity` if set, then `secondary_entity` if set, then `action_entity` if set, otherwise main config `entity`.
- Icon:
  - `icon_action_entity` if set, then `action_entity` if set, otherwise main config `entity`
- State:
  - `state_action_entity` if set, then `action_entity` if set, otherwise main config `entity`

All action config objects can be templated. The template needs to evaluate to a valid [action configuration](https://www.home-assistant.io/dashboards/actions/) in python format. Standard YAML object without templates works too.

Actions and templates:

```yaml
type: custom:template-entity-row
entity: light.bed_light
# Standard yaml configuration - No templates allowed
hold_action:
  action: more-info
# JSON return format
tap_action: |
  {
    "action": "toggle",
    "confirmation": {
      "text": "Do you really want to turn {{ state_attr(config.entity, 'friendly_name') }} {% if is_state(config.entity, 'on') %}off{% else %}on{% endif %}?",
    },
  }
double_tap_action:
  action: toggle
```

Override actions:

```yaml
type: custom:template-entity-row
entity: sun.sun
secondary_entity: sensor.sun_next_dawn # tap on secondary line will show more-info for sensor.sun_next_dawn
secondary: |
  Next dawn in {{ time_until(as_datetime(states(config.secondary_entity))) }}
icon_tap_action: # tap on icon will navigate to logbook for sun.sun and sun.next_dawn
  action: navigate
  navigation_path: /logbook?entity_id=sun.sun%2Csensor.sun_next_dawn
```

## Visual test scaffold (ha-testcontainer)

A `ha-testcontainer` visual test scaffold is included with scenario snapshots and doc-image scaffolding.

- Scenario tests: `tests/visual/scenarios/*.yaml` + `tests/visual/test_scenarios.py`
- Snapshot baselines directory: `tests/visual/snapshots/`
- Doc image scenarios: `docs/scenarios/*.yaml` + `tests/visual/test_doc_images.py`
- VS Code tasks: `.vscode/tasks.json`

See [tests/README.md](tests/README.md) for setup and execution details.
