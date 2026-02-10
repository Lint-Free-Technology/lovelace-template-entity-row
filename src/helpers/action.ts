import { hass_base_el } from "./hass";

export function bindActionHandler(element, options = {}) {
  customElements.whenDefined("long-press").then(() => {
    const longpress = document.body.querySelector("long-press") as any;
    longpress.bind?.(element);
  });
  customElements.whenDefined("action-handler").then(() => {
    const actionHandler = document.body.querySelector("action-handler") as any;
    actionHandler.bind?.(element, options);
  });
  return element;
}

export async function buttonAction(actionConfig, entityId = "") {
  if (!actionConfig) {
    actionConfig = {      
      action: "perform-action",
      perform_action: "input_button.press",
      target: {
        entity_id: entityId
      }
    };
  }
  const hsEl = await hass_base_el();
  let actionJSON = JSON.stringify(actionConfig);
  actionJSON = actionJSON.replace("config.entity", entityId);
  const action = JSON.parse(actionJSON);
  const detail = { config: { tap_action: action }, action: "tap" };
  hsEl.dispatchEvent(new CustomEvent("hass-action", { detail: detail, bubbles: true, composed: true }));
}
