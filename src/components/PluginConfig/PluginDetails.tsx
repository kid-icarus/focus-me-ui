import React from 'react'
import {useParams} from "react-router";
import {Box} from 'grommet'

interface RouteParams {
  pluginName: string
}

interface PluginProps {
  config: FocusConfig
}

const PluginDetails: React.FC<PluginProps> = ({config}) => {
  const {pluginName} = useParams<RouteParams>()

  return (
    <Box gridArea="content">
      <pre>{JSON.stringify(config.plugins[pluginName], null, 2)}</pre>
    </Box>
  )
}

export default PluginDetails
