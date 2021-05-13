import React from 'react'
import { useParams } from 'react-router'
import { Box } from 'grommet'
import { PluginProps, Rain, Bell, ApplicationManager } from '../Plugins'

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
    <Box gridArea="content">
      <Details config={config} updatePluginConfig={updatePluginConfig} />
    </Box>
  )
}

export default PluginDetails
