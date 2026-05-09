import { templates } from "./templates";

export function verifyTemplate(templateKey) {
  return !!templates[templateKey];
}