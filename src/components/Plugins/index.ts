export { Rain } from './Rain'
export { Bell } from './Bell'
export { ApplicationManager } from './ApplicationManager'

export interface PluginProps {
  config: FocusConfig
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
}
