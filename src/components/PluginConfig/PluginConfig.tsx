import * as React from "react";
import PluginList from "./PluginList";
import {Route, useRouteMatch} from "react-router-dom";
import PluginDetails from "./PluginDetails";
import {Grid} from "grommet";

interface GeneralConfigProps {
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
  config: FocusConfig
}

const PluginConfig: React.FC<GeneralConfigProps> = ({ updatePluginConfig, config}) => {
  let { path } = useRouteMatch();

  return (
    <Grid
      fill
      columns={['auto', 'flex']}
      rows={['auto', 'flex']}
      gap="small"
      areas={[
        { name: 'subnav', start: [0, 0], end: [0, 0] },
        { name: 'content', start: [1, 0], end: [1, 0] },
      ]}
    >
      <PluginList updatePluginConfig={updatePluginConfig} config={config}/>
      <Route path={`${path}/:pluginName`}>
        <PluginDetails config={config}/>
      </Route>
    </Grid>
  )
}

export default PluginConfig
