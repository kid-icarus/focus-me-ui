import * as path from 'path'
import * as os from 'os'
import { promises } from 'fs'
const { readFile, writeFile } = promises

const platform = os.platform()

const configPaths: Partial<Record<NodeJS.Platform, string>> = {
  darwin: path.join(
    os.homedir(),
    'Library/Application Support/FocusMe/preferences.json'
  ),
}

export const CONFIG_PATH = configPaths[platform]
if (!CONFIG_PATH) {
  throw new Error(`${platform} is an unsupported platform.`)
}

export const readConfig = async (): Promise<FocusConfig> =>
  (JSON.parse(await readFile(CONFIG_PATH, 'utf8')) as unknown) as FocusConfig

export const writeConfig = async (config: FocusConfig): Promise<void> =>
  writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
