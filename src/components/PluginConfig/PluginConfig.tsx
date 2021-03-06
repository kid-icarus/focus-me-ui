import * as React from 'react'
import PluginList from './PluginList'
import { Route, useRouteMatch } from 'react-router-dom'
import PluginDetails from './PluginDetails'
import { Grid, Heading } from 'grommet'

interface GeneralConfigProps {
  updatePluginConfig: (pluginName: string, Config) => Promise<void>
  config: FocusConfig
}

const PluginConfig: React.FC<GeneralConfigProps> = ({
  updatePluginConfig,
  config,
}) => {
  const { path } = useRouteMatch()

  return (
    <Grid
      fill
      columns={['auto', 'flex']}
      rows={['auto', 'flex']}
      areas={[
        { name: 'subnav', start: [0, 0], end: [0, 0] },
        { name: 'content', start: [1, 0], end: [1, 0] },
      ]}
      margin="none"
    >
      <PluginList updatePluginConfig={updatePluginConfig} config={config} />
      <Route path={`${path}/:pluginName`}>
        <PluginDetails
          config={config}
          updatePluginConfig={updatePluginConfig}
        />
      </Route>
    </Grid>
  )
}

export default PluginConfig
