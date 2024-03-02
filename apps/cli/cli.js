#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import add from "./src/commands/add.js";
import { fileURLToPath } from "url";
import { checkConfig, checkPackageExists, cyan, error, fileExists, findConfigFile, getConfig, getJsConfig, green, libPath, localPath, readFileSync, success, warning } from "./src/utils.js";
import { verifyCompilerOptions, verifyProjectDependencies, writeConfigFile } from "./src/lib.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync("../package.json"));

program.name("ui-gen").description("CLI for generating UI components").version(packageJson.version);

program
  .command("init")
  .description("Initialize a new ui component project")
  .action(() => {
    const questions = [
      {
        type: "input",
        name: "outputComponents",
        message: "Where do you want to store your components?",
        default: "src/components",
      },
      {
        type: "input",
        name: "aliasComponents",
        message: "Do you want to use alias for your components?",
        default: "@components",
      },
    ];

    inquirer.prompt(questions).then(async (answers) => {
      await verifyProjectDependencies();
      await verifyCompilerOptions(answers);
      await writeConfigFile(answers);

      console.log("\n");
      console.log(`Run ${chalk.blueBright.bold("npx ui-gen add button")} to generate a component`);
      console.log(`Run ${chalk.blueBright.bold("npx ui-gen list")} to se a list of available components`);
    });
  });

program
  .command("add <component>")
  .description("Generate a component")
  .action(async (component) => {
    await checkConfig();

    const templatePath = fileExists("templates", `${component}.astro`);
    if (!templatePath) {
      console.log(error(`Missing component template: ${component}`));
      process.exit(1);
    }

    const { docs } = add(component);

    console.log(docs);
  });

program
  .command("list")
  .description("List available components")
  .action(async (component) => {
    const directoryPath = libPath("templates");
    const files = fs.readdirSync(directoryPath);

    console.log(chalk.bold("\nAvailable components:"));
    console.log(
      files
        .filter((f) => f.includes(".astro"))
        .map((f) => f.replace(".astro", ""))
        .join("\n")
    );
  });

program.parse(process.argv);
