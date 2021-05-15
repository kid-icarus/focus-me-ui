import React, { useEffect, useState, useCallback } from 'react'
import { Switch, Link, Route, HashRouter, LinkProps } from 'react-router-dom'
import { render } from 'react-dom'
import { GeneralConfig, PluginConfig } from './components'
import { Grommet, Main, Box, Grid, Nav, Anchor, AnchorProps } from 'grommet'
import { Action, SettingsOption } from 'grommet-icons'

export type AnchorLinkProps = LinkProps &
  AnchorProps &
  Omit<JSX.IntrinsicElements['a'], 'color'>

export const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  return (
    <Anchor
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      as={({ colorProp, hasIcon, hasLabel, focus, ...p }) => <Link {...p} />}
      {...props}
    />
  )
}

const App: React.FC = () => {
  const [config, setConfig] = useState<FocusConfig>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const cfg = await window.electron.readConfig()
      setConfig(cfg)
    }
    fetchConfig().catch((e) => console.error(e))
  }, [])

  const updateConfig = useCallback(
    async (formValues: Partial<FocusConfig>) => {
      const updatedConfig: FocusConfig = { ...config, ...formValues }
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
        <Grid fill columns={['auto', 'flex']} rows={['auto', 'flex']}>
          <Nav background="brand" pad={{ top: 'small' }}>
            <AnchorLink icon={<SettingsOption />} to="/general"></AnchorLink>
            <AnchorLink icon={<Action />} to="/plugins"></AnchorLink>
          </Nav>
          <Box background="light-5">
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
