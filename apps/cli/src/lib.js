import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import handlebars from 'handlebars'
import inquirer from 'inquirer'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  checkPackageExists,
  findConfigFile,
  libPath,
  localPath,
  success,
} from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TAILWIND_CONFIG_FILE = 'tailwind.config.mjs'
const UI_CONFIG_FILE = 'ui-config.json'

/**
 * Verify project dependencies
 */
export async function verifyProjectDependencies() {
  const dependencies = ['tailwind-merge', 'class-variance-authority']
  for (const dependency of dependencies) {
    checkAndInstallPackage(dependency)
  }
}

/**
 * Check if a package is installed in the project and install it if it's missing.
 *
 * @param {string} packageName
 */
export async function checkAndInstallPackage(packageName) {
  if (!checkPackageExists(packageName)) {
    console.log(
      chalk.yellow(
        `📦 ${packageName} is missing from your package.json. Installing...`
      )
    )
    execSync(`npm i ${packageName}`, { stdio: 'inherit' })
    console.log(success('✅ Installed dependency', packageName))
  }
}

/**
 * Verify compiler options
 *
 * @param {object} answers
 */
export async function verifyCompilerOptions(answers, options) {
  // TODO: options is not used. Consider -y
  const configFile = findConfigFile()

  if (!configFile.compilerOptions) {
    await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'addCompilerOptions',
          message:
            'Missing compilerOptions in your tsconfig.json. Should i add it for you?',
          default: true,
        },
      ])
      .then((_answers) => {
        if (_answers.addCompilerOptions) {
          const newConfig = {
            ...configFile,
            compilerOptions: {
              baseUrl: '.',
              paths: {
                [`${answers.aliasComponents}/*`]: [
                  `${answers.outputComponents}/*`,
                ],
              },
            },
          }

          fs.writeFileSync(
            localPath('tsconfig.json'),
            JSON.stringify(newConfig, null, 2),
            'utf-8'
          )
          console.log(success('\n✅ Added compilerOptions to tsconfig.json'))
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      })
  }
}

/**
 * Writes the ui-config.json file
 *
 * @param {object} answers
 */
export async function writeConfigFile(answers) {
  const templatePath = path.join(__dirname, 'templates', UI_CONFIG_FILE)
  const template = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = handlebars.compile(template)
  const output = compiledTemplate(answers)

  const filePath = localPath(UI_CONFIG_FILE)
  fs.writeFileSync(filePath, output, 'utf-8')
  console.log(success('✅ ' + UI_CONFIG_FILE))
}

export async function verifyTailwindConfig(answers, options) {
  if (options?.yes)
    return execSync(`npx astro add tailwind -y`, {
      stdio: 'inherit',
    })

  const gotconf = await tailwindConfigExists()

  if (!gotconf) {
    await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'addTailwindConfig',
          message: `Missing ${TAILWIND_CONFIG_FILE}. Should i add tailwind for you?`,
          default: true,
        },
      ])
      .then((_answers) => {
        if (_answers.addTailwindConfig) {
          execSync(`npx astro add tailwind${options?.y && ' -y'}`, {
            stdio: 'inherit',
          })
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      })
  }

  return true
}

async function tailwindConfigExists() {
  const directoryPath = localPath('.')
  const searchFileNameWithoutExtension = 'tailwind.config'

  const files = fs.readdirSync(directoryPath)

  // Filtering files that match the searchFileName without considering the extension
  const foundFiles = files.filter((file) => {
    // Extract the filename without extension
    const filenameWithoutExtension = path.parse(file).name
    return filenameWithoutExtension === searchFileNameWithoutExtension
  })

  return foundFiles.length > 0
}
