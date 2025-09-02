#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import { fileURLToPath } from 'url'
import add from './src/commands/add.js'
import {
  verifyCompilerOptions,
  verifyProjectDependencies,
  writeConfigFile,
  verifyTailwindConfig,
} from './src/lib.js'
import {
  checkConfig,
  error,
  fileExists,
  libPath,
  readFileSync,
} from './src/utils.js'

const program = new Command()
const packageJson = JSON.parse(readFileSync('../package.json'))

const install = async (answers, options) => {
  await verifyProjectDependencies()
  await verifyCompilerOptions(answers, options)
  await verifyTailwindConfig(answers, options)
  await writeConfigFile(answers, options)
}

program
  .name('ui-gen')
  .description('CLI for generating UI components')
  .version(packageJson.version)

program
  .command('init')
  .option('-y, --yes')
  .option('-d, --debug', 'output extra debugging')
  .description('Initialize a new ui component project')
  .action((options) => {
    let questions = [
      {
        message: 'Where do you want to store your components?',
        type: 'input',
        name: 'outputComponents',
        default: 'src/components',
      },
      {
        message: 'Do you want to use alias for your components?',
        type: 'input',
        name: 'aliasComponents',
        default: '@components',
      },
    ]

    if (options.yes) {
      const answers = {}
      for (const q of questions) {
        answers[q.name] = q.default
      }

      return install(answers, options)
    }

    inquirer.prompt(questions).then(async (answers) => {
      await install(answers)
    })
  })

program
  .command('add <component>')
  .description('Generate a component')
  .action(async (component) => {
    await checkConfig()

    const templatePath = fileExists(
      'components',
      `/${component}/${component}.astro`
    )
    if (!templatePath) {
      console.log(error(`Missing component template: ${component}`))
      process.exit(1)
    }

    const { docs } = add(component)

    console.log(docs)
  })

program
  .command('list')
  .description('List available components')
  .action(async (component) => {
    const directoryPath = libPath('components')
    const files = fs.readdirSync(directoryPath)
    console.log(files)

    console.log(chalk.bold('\nAvailable components:'))
    console.log(
      files
        .filter((f) => f.includes('.astro'))
        .map((f) => f.replace('.astro', ''))
        .join('\n')
    )
  })

program.parse(process.argv)
