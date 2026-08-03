import { LitElement, html, css, PropertyValues } from "lit";
import { property, queryAsync } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { bindActionHandler, buttonAction } from "./helpers/action";
import pjson from "../package.json";
import { bind_template, hasTemplate } from "./helpers/templates";
import { hass } from "./helpers/hass";
import { stateActive } from "./helpers/common/entity/state_active";
import { computeCssColor } from "./helpers/common/entity/compute_color";

const OPTIONS = [
  "icon",
  "active",
  "name",
  "secondary",
  "state",
  "state_display",
  "condition",
  "image",
  "entity",
  "color",
  "toggle",
  "tap_action",
  "hold_action",
  "double_tap_action",
  "button_action",
  "icon_tap_action",
  "icon_hold_action",
  "icon_double_tap_action",
  "state_tap_action",
  "state_hold_action",
  "state_double_tap_action",
  "action_entity",
  "secondary_action_entity"
];

const LOCALIZE_PATTERN = /_\([^)]*\)/g;

const translate = (hass, text: String) => {
  return text.replace(LOCALIZE_PATTERN, (key) => {
    const params = key
      .substring(2, key.length - 1)
      .split(new RegExp(/\s*,\s*/));
    return hass.localize.apply(null, params) || key;
  });
};
  
class TemplateEntityRow extends LitElement {
  @property() _config;
  @property() hass;
  @property() config; // Rendered configuration of the row to display
  @property() _action;
  
  @queryAsync(".info") _infoElement;

  private _infoActionElement: HTMLElement;
  private _boundInfoActionListener = this._infoActionListener.bind(this);
  private _infoActionEvents = ["mousedown", "touchstart", "click", "keydown", "contextmenu"];

  setConfig(config) {
    if (config.toggle !== undefined && config.button !== undefined) {
      throw new Error("toggle and button options cannot be used together.");
    }
    this._config = { ...config };
    this.config = { ...this._config };

    this.bind_templates();
  }

  async bind_templates() {
    const hs = await hass();
    for (const k of OPTIONS) {
      if (!this._config[k]) continue;
      if (hasTemplate(this._config[k], this._config.nested_templates)) {
        bind_template(
          (res) => {
            const state = { ...this.config };
            if (typeof res === "string") res = translate(hs, res);
            state[k] = res;
            this.config = state;
          },
          this._config[k],
          { config: this._config },
          this._config.nested_templates
        );
      } else if (typeof this._config[k] === "string") {
        this.config[k] = translate(hs, this._config[k]);
      }
    }
    this.requestUpdate();
  }

  async firstUpdated() {
    const condition = this.config.condition === undefined ? true
      : String(this.config.condition).toLowerCase() === "true";
    this.dispatchEvent(
      new CustomEvent("row-visibility-changed", 
        { detail: { row: this, value: condition }, bubbles: true, composed: true }) 
    );
  }

  _actionEntity(part?: "" | "icon" | "state" | "secondary") {
    let actionEntity;
    if (part) {
      actionEntity = this.config[`${part}_action_entity`];
    }
    return actionEntity ?? this.config[`action_entity`] ?? this.config.entity;
  }

  _actionConfig(part?: "" | "icon" | "state", action: string = "tap") {
    let actionConfig;
    if (part) {
      actionConfig = this.config[`${part}_${action}_action`];
    }
    return actionConfig ?? this.config[`${action}_action`];
  }

  _hasAction(part: "" | "icon" | "state" = "") {
    const actionsEntity = this._actionEntity(part);
    const tapActionConfig = this._actionConfig(part);
    const holdActionConfig = this._actionConfig(part, "hold");
    const doubleTapActionConfig = this._actionConfig(part, "double_tap");
    return (
      (actionsEntity && String(tapActionConfig?.action).toLowerCase() != "none") ||
      (tapActionConfig && String(tapActionConfig.action).toLowerCase() != "none") ||
      (holdActionConfig && String(holdActionConfig.action).toLowerCase() != "none") ||
      (doubleTapActionConfig && String(doubleTapActionConfig.action).toLowerCase() != "none")
    );
  }

  _infoActionListener(ev) {
    this._infoActionElement = ev.target;
  }

  _unbindInfoActionHandler(element) {
    if (!element) return;
    this._infoActionEvents.forEach((event) => {
      element.removeEventListener(event, this._boundInfoActionListener, { capture: true });
    });
  }

  _bindActionHandler(element, part: "" | "icon" | "state" = "") {
    if (!this._hasAction(part)) return;
    const options = {
      hasHold: this._actionConfig(part, "hold") !== undefined,
      hasDoubleClick: this._actionConfig(part, "double_tap") !== undefined,
    };
    bindActionHandler(element, options);
  }

  _infoActionHandler(ev) {
    const config = { ...this.config };
    config.tap_action = this._actionConfig();
    config.hold_action = this._actionConfig("", "hold");
    config.double_tap_action = this._actionConfig("", "double_tap");
    if (this._infoActionElement?.classList.contains("secondary")) {
      config.entity = this._actionEntity("secondary");
    } else {
      config.entity = this._actionEntity();
    }
    this.dispatchEvent(
      new CustomEvent("hass-action", { detail: { config, action: ev.detail.action }, bubbles: true, composed: true })
    );
  }

  _iconActionHandler(ev) {
    const config = { ...this.config };
    config.tap_action = this._actionConfig("icon");
    config.hold_action = this._actionConfig("icon", "hold");
    config.double_tap_action = this._actionConfig("icon", "double_tap");
    config.entity = this._actionEntity("icon");
    this.dispatchEvent(
      new CustomEvent("hass-action", { detail: { config, action: ev.detail.action }, bubbles: true, composed: true })
    );
  }

  _stateActionHandler(ev) {
    const config = { ...this.config };
    config.tap_action = this._actionConfig("state");
    config.hold_action = this._actionConfig("state", "hold");
    config.double_tap_action = this._actionConfig("state", "double_tap");
    config.entity = this._actionEntity("state");
    this.dispatchEvent(
      new CustomEvent("hass-action", { detail: { config, action: ev.detail.action }, bubbles: true, composed: true })
    );
  }

  protected async updated(changedProperties: PropertyValues) {
    if (changedProperties.has("config")) {
      const oldCondition = changedProperties.get("config")?.condition === undefined ? true
        : String(changedProperties.get("config")?.condition).toLowerCase() === "true";
      const newCondition = this.config.condition === undefined ? true
        : String(this.config.condition).toLowerCase() === "true";
      if (oldCondition !== newCondition) {
        this.dispatchEvent(
          new CustomEvent("row-visibility-changed", 
            { detail: { row: this, value: newCondition }, bubbles: true, composed: true }) 
        );
      }

      this._bindActionHandler(this.shadowRoot.querySelector(".info"));
      this._bindActionHandler(this.shadowRoot.querySelector("state-badge"), "icon");

      const show_toggle = this.config.toggle && this.config.entity;
      const show_button = this.config.button;
      if (!show_toggle && !show_button) {
        this._bindActionHandler(this.shadowRoot.querySelector(".state"), "state");
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._infoElement.then((element) => {
      this._infoActionEvents.forEach((event) => {
        element.addEventListener(event, this._boundInfoActionListener, { capture: true });
      });
    });
  }

  disconnectedCallback() {
    this._infoElement.then((element) => {
      this._infoActionEvents.forEach((event) => {
        element.removeEventListener(event, this._boundInfoActionListener, { capture: true });
      });
    });
    super.disconnectedCallback();
  }

  render() {
    const base = this.hass.states[this.config.entity?.trim()];
    const entity = (base && JSON.parse(JSON.stringify(base))) || {
      entity_id: "binary_sensor.",
      attributes: { icon: "no:icon", friendly_name: "" },
      state: "off",
    };

    const icon =
      this.config.icon !== undefined
        ? this.config.icon || "no:icon"
        : undefined;
    const image = this.config.image;


    const name = this.hass.formatEntityName(entity, this.config.name);
    const secondary = this.config.secondary;
    entity.state = this.config.state ?? base?.state;
    const stateDisplay = this.config.state_display ?? (this.config.state ? entity.state : this.hass.formatEntityState(entity));
    const migratedStateColor = this.config.state_color === true ? "state" : this.config.state_color == false ? "none" : undefined;
    const color = this.config.color ?? migratedStateColor ?? "state";

    const active = this.config.active !== undefined ? this.config.active : undefined;
    if (active) {
      entity.attributes.brightness = 255;
      entity.state = "on";
    } else if (active === false) {
      entity.state = "off";
    }

    // Since Home Assistant 2026.8.0 setting color to a color token or CSS only applies if state is active
    // So if state is not active and color_inactive and color is set, we set `--state-icon-color` to the 
    // color value so that it is applied regardless of state
    const stateIconColorStyle = 
      ( this.config.color_inactive && 
        color 
        && color !== "state" 
        && color !== "none" 
        && !stateActive(entity)
      ) ? `--state-icon-color: ${computeCssColor(color)};` : undefined;

    const hidden =
      this.config.condition !== undefined &&
      String(this.config.condition).toLowerCase() !== "true";
    const show_toggle = this.config.toggle && this.config.entity;
    const show_button = this.config.button;
    const has_action = this._hasAction();
    const has_icon_action = this._hasAction("icon");
    const has_state_action = this._hasAction("state");

    return html`
      <div id="wrapper" class="${hidden ? "hidden" : ""}">
        <state-badge
          .hass=${this.hass}
          .stateObj=${entity}
          @action=${this._iconActionHandler}
          .overrideIcon=${icon}
          .overrideImage=${image}
          .color=${color}
          style=${stateIconColorStyle !== undefined ? stateIconColorStyle : ""}
          class=${classMap({ pointer: has_icon_action })}
        ></state-badge>
        <div
          class=${classMap({ info: true, pointer: has_action })}
          @action="${this._infoActionHandler}"
        >
          ${name}
          <div class="secondary">${secondary}</div>
        </div>
        <div
          @action="${!show_toggle && !show_button ? this._stateActionHandler : undefined}"
          class=${classMap({ state: true, pointer: !show_toggle && !show_button && has_state_action })}
        >
          ${show_toggle
            ? html`<ha-entity-toggle .hass=${this.hass} .stateObj=${entity}>
              </ha-entity-toggle>`
            : show_button
            ? html`<ha-button 
                .hass=${this.hass} 
                @click=${() => buttonAction(this.config.button_action, this.config.entity?.trim())}
                appearance="plain"
                size="small"
                .disabled=${entity.state === "unavailable"}
              >
                ${this.config.button === true ? this.hass.localize?.("ui.card.button.press") : translate(this.hass, this.config.button)}
              </ha-button>`
            : stateDisplay
          }
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      (customElements.get("hui-generic-entity-row") as any)?.styles,
      css`
        :host {
          display: inline;
        }
        #wrapper {
          display: flex;
          align-items: center;
          flex-direction: row;
        }
        .state {
          text-align: right;
        }
        .state > ha-button {
          margin-right: -0.57em;
          margin-inline-end: -0.57em;
          margin-inline-start: initial;
        }
        #wrapper {
          min-height: 40px;
        }
        #wrapper.hidden {
          display: none;
        }
      `,
    ];
  }
}

if (!customElements.get("template-entity-row")) {
  customElements.define("template-entity-row", TemplateEntityRow);
  console.groupCollapsed(
    `%c💡 TEMPLATE-ENTITY-ROW ${pjson.version} IS INSTALLED 💡`,
    'color: white; background-color: #CE3226; padding: 2px 5px; font-weight: bold; border-radius: 5px;',
  );
  console.log('Readme:', 'https://github.com/Lint-Free-Technology/lovelace-template-entity-row');
  console.groupEnd();
}
