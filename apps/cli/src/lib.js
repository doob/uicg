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
  localPath,
  success,
} from './utils.js' // Add missing import statement

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Verify project dependencies
 */
export async function verifyProjectDependencies() {
  const dependencies = [
    '@astrojs/tailwind',
    'tailwind-merge',
    'class-variance-authority',
  ]
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
  const templatePath = path.join(__dirname, 'templates', 'ui-config.json')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const compiledTemplate = handlebars.compile(template)
  const output = compiledTemplate(answers)

  const filePath = localPath(`ui-config.json`)
  fs.writeFileSync(filePath, output, 'utf-8')
  console.log(success('✅ Created ui-config.json'))
}
