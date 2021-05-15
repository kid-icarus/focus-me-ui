import * as React from 'react'
import { Box, CheckBox, Heading, Text } from 'grommet'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

interface GeneralConfigProps {
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
  config: FocusConfig
}

const PluginLink = styled(Link)`
  color: white;
  text-decoration: none;
`

const PluginList: React.FC<GeneralConfigProps> = ({
  updatePluginConfig,
  config,
}) => {
  const { plugins } = config
  const { url } = useRouteMatch()
  const location = useLocation()
  const activePlugin = location.pathname.split('/plugins/')[1] ?? ''

  const setPluginEnabled = useCallback(
    (pluginName) => (e: ChangeEvent<HTMLInputElement>) => {
      updatePluginConfig(pluginName, { enabled: e.target.checked }).catch((e) =>
        console.error(e)
      )
    },
    [plugins]
  )

  return (
    <Box gridArea="subnav" background="dark-2" height={{ min: '100vh' }}>
      <Box pad="small">
        <Heading level={2}>Plugins</Heading>
      </Box>
      {Object.entries(plugins).map(([name, plugin]) => (
        <PluginLink key={name} to={`${url}/${name}`}>
          <Box
            key={name}
            direction="row"
            pad="small"
            gap="small"
            hoverIndicator="brand"
            background={activePlugin === name ? 'brand' : 'none'}
            onClick={() => {
              // really dumb hack to get a hover indicator. it requires onclick
            }}
          >
            <CheckBox
              toggle
              checked={plugin.enabled}
              onChange={setPluginEnabled(name)}
            />
            <Text>{name}</Text>
          </Box>
        </PluginLink>
      ))}
    </Box>
  )
}

export default PluginList
