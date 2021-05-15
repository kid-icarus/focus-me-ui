import React from 'react'
import { useParams } from 'react-router'
import { Box } from 'grommet'
import {
  PluginProps,
  Rain,
  Bell,
  ApplicationManager,
  Slack,
  Logger,
  Spotify,
  Webhooks,
} from '../Plugins'
import { Tracker } from '../Plugins/Tracker'
import { RescueTime } from '../Plugins/RescueTime'

interface RouteParams {
  pluginName: string
}

const pluginDetailsMap = new Map<string, React.FC<PluginProps>>([
  [
    'rain',
    ({ config, updatePluginConfig }) => (
      <Rain config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'bell',
    ({ config, updatePluginConfig }) => (
      <Bell config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'application-manager',
    ({ config, updatePluginConfig }) => (
      <ApplicationManager
        config={config}
        updatePluginConfig={updatePluginConfig}
      />
    ),
  ],
  [
    'slack',
    ({ config, updatePluginConfig }) => (
      <Slack config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'logger',
    ({ config, updatePluginConfig }) => (
      <Logger config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'spotify',
    ({ config, updatePluginConfig }) => (
      <Spotify config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'tracker',
    ({ config, updatePluginConfig }) => (
      <Tracker config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'webhooks',
    ({ config, updatePluginConfig }) => (
      <Webhooks config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
  [
    'rescue-time',
    ({ config, updatePluginConfig }) => (
      <RescueTime config={config} updatePluginConfig={updatePluginConfig} />
    ),
  ],
])

const PluginDetails: React.FC<PluginProps> = ({
  config,
  updatePluginConfig,
}) => {
  const { pluginName } = useParams<RouteParams>()
  const DefaultDetails: React.FC<PluginProps> = () => (
    <pre>{JSON.stringify(config, null, 2)}</pre>
  )
  const Details = pluginDetailsMap.has(pluginName)
    ? pluginDetailsMap.get(pluginName)
    : DefaultDetails

  return (
    <Box gridArea="content" pad="medium">
      <Details config={config} updatePluginConfig={updatePluginConfig} />
    </Box>
  )
}

export default PluginDetails
