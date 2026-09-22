import {resolve} from "node:path";
import fs from "node:fs/promises";
import Handlebars from "handlebars";

// 1. Формуємо шлях до шаблона
const templatePaths = {
  "reset-password" : resolve("src", "templates", "reset-password-email.html"),
  "verify-email" : resolve("src", "templates", "verify-email.html")
}

export const getEmailTemplate = async (templateType) => {
  const templatePath = templatePaths[templateType];
  if(!templatePath) {
    throw new Error(`Unknown email template: ${templateType}`)
  }

  // 2. Читаємо шаблон
  const templateSource = await fs.readFile(templatePath, "utf-8");

  return Handlebars.compile(templateSource);
};
