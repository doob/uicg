#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import add from "./src/commands/add.js";
import { fileURLToPath } from "url";
import { checkConfig, checkPackageExists, cyan, error, fileExists, findConfigFile, getConfig, getJsConfig, green, libPath, localPath, readFileSync, success, warning } from "./src/utils.js";
import { execSync } from "child_process";

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
      const templatePath = path.join(__dirname, "src/templates", "ui-config.json");
      const template = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(template);
      const output = compiledTemplate(answers);

      const filePath = localPath(`ui-config.json`);

      fs.writeFileSync(filePath, output, "utf-8");

      if (!checkPackageExists("tailwind-merge")) {
        console.log(chalk.yellow("📦 tailwind-merge is missing from your package.json. Installing..."));
        execSync("npm i tailwind-merge", { stdio: "inherit" });
        green("✅ Installed tailwind-merge");
      }

      if (!checkPackageExists("class-variance-authority")) {
        console.log(chalk.yellow("📦 class-variance-authority is missing from your package.json. Installing..."));
        execSync("npm i class-variance-authority", { stdio: "inherit" });
        green("✅ Installed class-variance-authority");
      }

      if (!checkPackageExists("@astrojs/tailwind")) {
        console.log(chalk.yellow("📦 @astrojs/tailwind is missing from your package.json. Installing..."));
        execSync("npx astro add tailwind", { stdio: "inherit" });
      }

      const configFile = findConfigFile();
      if (!configFile.compilerOptions) {
        await inquirer
          .prompt([
            {
              type: "confirm",
              name: "addCompilerOptions",
              message: "Missing compilerOptions in your tsconfig.json. Should i add it for you?",
              default: true,
            },
          ])
          .then((_answers) => {
            if (_answers.addCompilerOptions) {
              const newConfig = {
                ...configFile,
                compilerOptions: {
                  baseUrl: ".",
                  paths: {
                    [`${answers.aliasComponents}/*`]: [`${answers.outputComponents}/*`],
                  },
                },
              };

              fs.writeFileSync(localPath("tsconfig.json"), JSON.stringify(newConfig, null, 2), "utf-8");
              console.log(success("\n✅ Added compilerOptions to tsconfig.json"));
            }
          })
          .catch((error) => {
            if (error.isTtyError) {
              // Prompt couldn't be rendered in the current environment
            } else {
              // Something else went wrong
            }
          });
      }

      console.log(success("✅ Created ui-config.json"));
      console.log("\nRun 'npx ui-gen add <component>' to generate a component");
      console.log("Run 'npx ui-gen list' to se a list of available components\n");
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
