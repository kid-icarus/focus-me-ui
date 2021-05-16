import React, { ChangeEvent, EventHandler, useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormField,
  Layer,
  Paragraph,
  TextInput,
  TextInputProps,
} from 'grommet'
import { PluginProps } from '../index'
import { FormClose, Target } from 'grommet-icons'

interface Suggestion {
  label: string
  value: string
}

export type ApplicationType = 'open' | 'close'

interface ApplicationSelectorProps {
  type: ApplicationType
  suggestions: Suggestion[]
}

const ApplicationSelector: React.FC<PluginProps & ApplicationSelectorProps> = ({
  type,
  config,
  updatePluginConfig,
  suggestions,
}) => {
  const pluginConfig: ApplicationManagerConfig =
    config.plugins['application-manager']
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selection, setSelection] = useState<string>('')
  const [runningApps, setRunningApps] = useState<
    {
      label: string
      value: string
    }[]
  >(suggestions)

  useEffect(() => {
    if (!suggestions) return
    setRunningApps(suggestions)
  }, [suggestions])

  const addApp = async (app: Application): Promise<void> => {
    if (pluginConfig[type].some((x) => x.name === app.name)) return

    return updatePluginConfig('application-manager', {
      ...pluginConfig,
      [type]: [...pluginConfig[type], app],
    })
  }

  const onRemoveAppClick = async (appName: string) => {
    const index = pluginConfig[type].findIndex((app) => app.name === appName)
    pluginConfig[type].splice(index, 1)
    await updatePluginConfig('application-manager', {
      ...pluginConfig,
    })
  }

  const selectApplication = async () => {
    setShowModal(true)
    const app = await window.electron.selectApplication()
    await addApp(app)
    setShowModal(false)
  }

  const onSuggestionSelect: TextInputProps['onSuggestionSelect'] = async (e: {
    suggestion: Suggestion
  }) => {
    setSelection('')
    await addApp({
      name: e.suggestion.value,
      displayedName: e.suggestion.label,
    })
  }

  const onAppChange: EventHandler<ChangeEvent<HTMLInputElement>> = (e) => {
    const nextValue = e.target.value
    setSelection(nextValue)
    if (!nextValue) {
      console.log('no next value, resetting suggestions')
      setRunningApps(suggestions)
    } else {
      const regexp = new RegExp(`^${nextValue}`, 'i')
      setRunningApps(suggestions.filter((s) => regexp.test(s.label)))
    }
  }

  return (
    <Box margin={{ bottom: 'large' }}>
      {showModal && (
        <Layer>
          <Box pad="large">
            <Paragraph>
              Select the application you'd like by focusing its window.
            </Paragraph>
          </Box>
        </Layer>
      )}
      <FormField label={type === 'close' ? 'Close' : 'Open'}>
        <Box direction="row">
          <Button icon={<Target />} onClick={selectApplication} />
          <TextInput
            defaultSuggestion={0}
            value={selection}
            suggestions={runningApps}
            onSuggestionSelect={onSuggestionSelect}
            onChange={onAppChange}
            plain
          />
        </Box>
      </FormField>
      <Box direction="row" wrap>
        {pluginConfig[type].map((app) => (
          <Button
            onClick={() => onRemoveAppClick(app.name)}
            key={app.name}
            icon={<FormClose />}
            label={app.displayedName ?? app.name}
            size="small"
            margin="xsmall"
            primary
          />
        ))}
      </Box>
    </Box>
  )
}

export default ApplicationSelector
