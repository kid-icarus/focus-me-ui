import React, {
  ChangeEvent,
  EventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Button,
  FormField,
  Heading,
  Layer,
  Paragraph,
  TextInput,
  TextInputProps,
} from 'grommet'
import { PluginProps } from '../index'
import { FormClose, Target } from 'grommet-icons'
import ApplicationSelector, { ApplicationType } from './ApplicationSelector'

interface Suggestion {
  label: string
  value: string
}

interface App {
  name: string
  displayedName: string
}

const ApplicationManager: React.FC<PluginProps> = ({
  config,
  updatePluginConfig,
}) => {
  const pluginConfig: ApplicationManagerConfig =
    config.plugins['application-manager']
  const [runningApps, setRunningApps] = useState<
    {
      label: string
      value: string
    }[]
  >([])
  const appTypes: ApplicationType[] = ['close', 'open']

  useEffect(() => {
    window.electron
      .getRunningApps()
      .then((apps) => {
        console.log(apps)
        return apps.map((x): { label: string; value: string } => ({
          label: x.displayedName ?? x.name,
          value: x.name,
        }))
      })
      .then(setRunningApps)
      .catch((e) => console.log(e))
  }, [])

  return (
    <Box>
      <Heading>Application Manager</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Configure applications to be closed while focusing, and optionally
        choose applications to open once the timer ends.
      </Paragraph>
      {appTypes.map((type) => (
        <ApplicationSelector
          key={type}
          config={config}
          updatePluginConfig={updatePluginConfig}
          suggestions={runningApps}
          type={type}
        />
      ))}
    </Box>
  )
}

export default ApplicationManager
