import HomeAssistantJavaScriptTemplates, { HomeAssistantJavaScriptTemplatesRenderer } from 'home-assistant-javascript-templates';

export function getJSTemplateRenderer(variables: any = {}): Promise<HomeAssistantJavaScriptTemplatesRenderer> {
  return new HomeAssistantJavaScriptTemplates(
    document.querySelector('home-assistant'),
    {
      autoReturn: false,
      variables,
    }
  ).getRenderer();
}

export function isJSTemplate(template: any): boolean {
  if (!template || typeof template !== "string") return false;
  return String(template).trim().startsWith("[[[") && String(template).trim().endsWith("]]]");
}

export async function renderJSTemplate(
    templatesRenderer: Promise<HomeAssistantJavaScriptTemplatesRenderer>, 
    template: string, 
    variables: any = {}): Promise<any> {
  if (!isJSTemplate(template)) {
    throw new Error("Not a valid JS template");
  }
  template = String(template).trim().slice(3, -3);
  return templatesRenderer.then(renderer => {
    return renderer.renderTemplate(template, variables);
  });
}

export async function trackJSTemplate(
    templatesRenderer: Promise<HomeAssistantJavaScriptTemplatesRenderer>,
    callback: (result: any) => void,  
    template: string, 
    variables: any = {},
    refsToAdd: string[] = []): Promise<void> {
  if (!isJSTemplate(template)) {
    throw new Error("Not a valid JS template");
  }
  template = String(template).trim().slice(3, -3);
  if (refsToAdd.length) {
    template = 
      `const variables = {${refsToAdd.map(r => `${r}: ref('${r}').value`).join(", ")} };\n`
      + template;
  }
  templatesRenderer.then(renderer => {
    renderer.trackTemplate(template, callback, variables);
  });
}