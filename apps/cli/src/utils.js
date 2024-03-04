import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Check if a package is installed in the project
 *
 * @param {*} packageName
 * @returns
 */
export function checkPackageExists(packageName) {
  const packageJsonPath = localPath('package.json')

  try {
    // Read package.json file
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8')
    // Parse the JSON content
    const packageObj = JSON.parse(packageJson)

    // Check if the package exists in dependencies or devDependencies
    const existsInDependencies =
      packageObj.dependencies && packageObj.dependencies[packageName]
    const existsInDevDependencies =
      packageObj.devDependencies && packageObj.devDependencies[packageName]

    return !!existsInDependencies || !!existsInDevDependencies
  } catch (error) {
    console.error('Error reading or parsing package.json:', error)
    return false
  }
}

/**
 * Capitalizes the first letter of a string
 *
 * @param {*} string
 * @returns
 */
export function capitalizeFirstLetter(string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function cyan(str) {
  return console.log(chalk.cyan(str))
}

export function green(str) {
  return console.log(chalk.greenBright(str))
}

export function red(str) {
  return console.log(chalk.redBright(str))
}

export const error = chalk.bold.red
export const warning = chalk.hex('#FFA500')
export const success = chalk.greenBright

/**
 * Returns a path relative to the ui-gen library
 *
 * @param  {...any} args
 * @returns
 */
export function libPath(...args) {
  return path.join(__dirname, ...args)
}

/**
 * Returns a path relative to the current working directory
 *
 * @param  {...any} args
 * @returns
 */
export function localPath(...args) {
  return path.join(process.cwd(), ...args)
}

/**
 * Loads the ui-config.json file and returns it as an object
 *
 * @returns {Object} The ui-config.json file as an object
 */
export function getConfig() {
  const configPath = localPath('ui-config.json')
  return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

/**
 * Checks if the ui-config.json file exists and returns it as an object
 * If the file does not exist, it will log an error and exit the process
 *
 * @returns {Object} The ui-config.json file as an object
 */
export async function checkConfig() {
  const configPath = localPath('ui-config.json')
  if (!fs.existsSync(configPath)) {
    console.log(
      error(
        `🚨 Missing ui-config.json. Run ${success('npx ui-gen init')} to create one.`
      )
    )

    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

export function fileExists(...args) {
  const templatePath = libPath(...args)

  return fs.existsSync(templatePath)
}

export function checkFileExists(path) {
  return fs.existsSync(path)
}

export function readFileSync(...args) {
  const filePath = libPath(...args)
  return fs.readFileSync(filePath, 'utf-8')
}

export function getJsConfig() {
  const jsconfigPath = localPath('jsconfig.json')
  return fs.existsSync(jsconfigPath)
    ? JSON.parse(fs.readFileSync(jsconfigPath, 'utf8'))
    : false
}

export function findConfigFile() {
  const tsConfigPath = localPath('tsconfig.json')
  const jsConfigPath = localPath('jsconfig.json')

  // Check for tsconfig.json
  const tsConfigExists = checkFileExists(tsConfigPath)
  if (tsConfigExists) {
    return JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'))
  }

  // Check for jsconfig.json if tsconfig.json is not found
  const jsConfigExists = checkFileExists(jsConfigPath)
  if (jsConfigExists) {
    return JSON.parse(fs.readFileSync(jsConfigPath, 'utf8'))
  } else {
    return false
  }
}

export const log = (str) => console.log(`${chalk.red('LOG')}: ${str}`)
