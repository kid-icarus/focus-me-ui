import * as React from "react";
import {Box, CheckBox} from "grommet";
import {Link, useRouteMatch} from "react-router-dom";
import {ChangeEvent, useCallback} from "react";

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

  return (
    <Box background="dark-3">
      {Object.entries(plugins).map(([name, plugin]) => (
        <Box key={name}>
          <CheckBox checked={plugin.enabled} onChange={setPluginEnabled(name)}/>
          <Link to={`${url}/${name}`}>{name}</Link>
        </Box>
      ))}
    </Box>
  )
}

export default PluginList
