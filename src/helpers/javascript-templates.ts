import HomeAssistantJavaScriptTemplates, { HomeAssistantJavaScriptTemplatesRenderer } from 'home-assistant-javascript-templates';

export function getJSTemplateRenderer(variables: Record<string, unknown> = {}, refs: Record<string, unknown> = {}): Promise<HomeAssistantJavaScriptTemplatesRenderer> {
  return new HomeAssistantJavaScriptTemplates(
    document.querySelector('home-assistant'),
    {
      autoReturn: false,
      variables,
      refs,
      refsVariableName: 'variables'
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
    variables: Record<string, unknown> = {}): Promise<any> {
  if (!isJSTemplate(template)) {
    throw new Error("Not a valid JS template");
  }
  template = String(template).trim().slice(3, -3);
  return templatesRenderer.then(renderer => {
    return renderer.renderTemplate(template, { variables } );
  });
}

export async function trackJSTemplate(
    templatesRenderer: Promise<HomeAssistantJavaScriptTemplatesRenderer>,
    callback: (result: any) => void,  
    template: string, 
    variables: Record<string, unknown> = {}): Promise<void> {
  if (!isJSTemplate(template)) {
    throw new Error("Not a valid JS template");
  }
  template = String(template).trim().slice(3, -3);
  templatesRenderer.then(renderer => {
    renderer.trackTemplate(template, callback, { variables });
  });
}

export async function setJSTemplateRef(
  templatesRenderer: Promise<HomeAssistantJavaScriptTemplatesRenderer>, 
  refName: string, 
  refValue: unknown): Promise<void> {
    templatesRenderer.then(renderer => {
    renderer.refs[refName] = refValue;
  });
}