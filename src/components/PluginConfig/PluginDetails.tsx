import React from 'react'
import {useParams} from "react-router";

interface RouteParams {
  pluginName: string
}

interface PluginProps {
  config: FocusConfig
}

const PluginDetails: React.FC<PluginProps> = ({config}) => {
  const {pluginName} = useParams<RouteParams>()
  return <pre>{JSON.stringify(config.plugins[pluginName], null, 2)}</pre>
}

export default PluginDetails
