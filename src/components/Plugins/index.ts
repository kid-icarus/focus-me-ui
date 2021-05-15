export { Rain } from './Rain'
export { Bell } from './Bell'
export { ApplicationManager } from './ApplicationManager'
export { Slack } from './Slack'
export { Logger } from './Logger'
export { Spotify } from './Spotify'
export { Webhooks } from './Webhooks'
export { RescueTime } from './RescueTime'

export interface PluginProps {
  config: FocusConfig
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
}
