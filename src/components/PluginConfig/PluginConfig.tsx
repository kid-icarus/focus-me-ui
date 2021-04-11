import * as React from "react";
import PluginList from "./PluginList";
import {Route, useRouteMatch} from "react-router-dom";
import PluginDetails from "./PluginDetails";

interface GeneralConfigProps {
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: FocusConfig
}

const PluginConfig: React.FC<GeneralConfigProps> = ({ updateConfig, config}) => {
  let { path } = useRouteMatch();

  return (
    <div>
      <PluginList updateConfig={updateConfig} config={config}/>
      <Route path={`${path}/:pluginName`}>
        <PluginDetails config={config}/>
      </Route>
    </div>
  )
}

export default PluginConfig
