import * as React from "react";
import {Box, Button, CheckBox} from "grommet";
import {Link, useRouteMatch} from "react-router-dom";
import {useForm} from "react-hook-form";

interface GeneralConfigProps {
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: FocusConfig
}

const PluginList: React.FC<GeneralConfigProps> = ({ updateConfig, config}) => {
  const { plugins } = config
  const { url } = useRouteMatch()

  return (
    <Box background="dark-3">
      {Object.entries(plugins).map(([name, plugin]) => (
        <Box key={name}>
          <CheckBox checked={plugin.enabled} />
          <Link to={`${url}/${name}`}>{name}</Link>
        </Box>
      ))}
    </Box>
  )
}

export default PluginList
