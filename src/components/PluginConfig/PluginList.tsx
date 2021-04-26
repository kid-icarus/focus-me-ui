import * as React from "react";
import {Box, CheckBox} from "grommet";
import {Link, useRouteMatch} from "react-router-dom";
import {ChangeEvent, useCallback} from "react";
import styled from 'styled-components'

interface GeneralConfigProps {
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
  config: FocusConfig
}

const PluginList: React.FC<GeneralConfigProps> = ({ updatePluginConfig, config}) => {
  const { plugins } = config
  const { url } = useRouteMatch()

  const setPluginEnabled = useCallback((pluginName) => (e: ChangeEvent<HTMLInputElement>) => {
    updatePluginConfig(pluginName, {enabled: e.target.checked})
  }, [plugins])

  const PluginItem = styled.div`
    margin: 8px;
  `

  return (
    <Box background="dark-3">
      {Object.entries(plugins).map(([name, plugin]) => (
        <PluginItem key={name}>
          <CheckBox label={<Link to={`${url}/${name}`}>{name}</Link>} checked={plugin.enabled} onChange={setPluginEnabled(name)} />
        </PluginItem>
      ))}
    </Box>
  )
}

export default PluginList
