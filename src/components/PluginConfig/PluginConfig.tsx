import * as React from "react";
import PluginList from "./PluginList";
import {Route, useRouteMatch} from "react-router-dom";
import PluginDetails from "./PluginDetails";

interface GeneralConfigProps {
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
  config: FocusConfig
}

const PluginConfig: React.FC<GeneralConfigProps> = ({ updatePluginConfig, config}) => {
  let { path } = useRouteMatch();

  return (
    <div>
      <PluginList updatePluginConfig={updatePluginConfig} config={config}/>
      <Route path={`${path}/:pluginName`}>
        <PluginDetails config={config}/>
      </Route>
    </div>
  )
}

export default PluginConfig
