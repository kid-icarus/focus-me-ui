import React, { useEffect, useState, useCallback } from 'react'
import { Switch, Link, Route, HashRouter } from 'react-router-dom'
import { render } from 'react-dom'
import { GeneralConfig, PluginConfig } from './components'
import { Grommet, Main, Box, Grid, Button, Text } from 'grommet'

const App: React.FC = () => {
  const [config, setConfig] = useState<FocusConfig>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const cfg = await window.electron.readConfig()
      setConfig(cfg)
    }
    fetchConfig()
  }, [])

  const updateConfig = useCallback(
    async (formValues) => {
      const updatedConfig = { ...config, ...formValues }
      await window.electron.writeConfig(updatedConfig)
      setConfig(updatedConfig)
    },
    [config]
  )

  const updatePluginConfig = useCallback(
    async (pluginName: string, formValues: Config) => {
      const updatedConfig = {
        ...config,
        plugins: {
          ...config.plugins,
          [pluginName]: { ...config.plugins[pluginName], ...formValues },
        },
      }
      await window.electron.writeConfig(updatedConfig)
      setConfig(updatedConfig)
    },
    [config]
  )

  if (!config) return <p>loading</p>

  return (
    <Grommet>
      <HashRouter>
        <Grid
          fill
          columns={['auto', 'flex']}
          rows={['auto', 'flex']}
          gap="small"
          areas={[
            { name: 'sidebar', start: [0, 0], end: [0, 0] },
            { name: 'main', start: [1, 0], end: [1, 0] },
          ]}
        >
          <Box gridArea="sidebar" background="dark-3">
            {[
              { name: 'General', path: '/general' },
              { name: 'Plugins', path: '/plugins' },
            ].map(({ name, path }) => (
              <Box key={name} pad={{ horizontal: 'medium', vertical: 'small' }}>
                <Link to={path}>{name}</Link>
              </Box>
            ))}
          </Box>
          <Box gridArea="main" background="light-5">
            <Main>
              <Switch>
                <Route path="/general">
                  <GeneralConfig updateConfig={updateConfig} config={config} />
                </Route>
                <Route path="/plugins">
                  <PluginConfig
                    updatePluginConfig={updatePluginConfig}
                    config={config}
                  />
                </Route>
              </Switch>
            </Main>
          </Box>
        </Grid>
      </HashRouter>
    </Grommet>
  )
}

render(<App />, document.getElementById('root'))
