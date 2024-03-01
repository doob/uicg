import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { capitalizeFirstLetter, getConfig, libPath, localPath } from "../utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (component) {
  // load config from ui-config.json
  const config = getConfig();

  const { components } = config.output;

  const templatePath = libPath("/templates", `${component}.astro`);
  const template = fs.readFileSync(templatePath, "utf-8");

  const compiledTemplate = handlebars.compile(template);
  const output = compiledTemplate({ component });

  const filePath = localPath(`${components}/${capitalizeFirstLetter(component)}.astro`);

  fs.writeFileSync(filePath, output, "utf-8");

  const docsPath = libPath("/docs/", `${component}-docs.astro`);

  // Output some information
  let docs = chalk.greenBright(`Created ${component} component.`);

  if (fs.existsSync(docsPath)) {
    const _docs = fs.readFileSync(docsPath, "utf-8");
    const config = getConfig();

    const compiledDocsTemplate = handlebars.compile(_docs);
    const output = compiledDocsTemplate(config);

    docs = `${docs} ${chalk.greenBright("Example Usage:")}\n\n${output}`;
  }

  return { docs };
}
