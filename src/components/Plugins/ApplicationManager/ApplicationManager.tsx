import React, { KeyboardEventHandler } from 'react'
import { Button, FormField, Text, TextInput } from 'grommet'
import { PluginProps } from '../index'
import { FormClose } from 'grommet-icons'

const ApplicationManager: React.FC<PluginProps> = ({
  config,
  updatePluginConfig,
}) => {
  const pluginConfig: ApplicationManagerConfig =
    config.plugins['application-manager']

  const addPluginToClose: KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === 'Enter') {
      await updatePluginConfig('application-manager', {
        ...pluginConfig,
        close: [...pluginConfig.close, e.currentTarget.value],
      })
    }
  }

  const addPluginToOpen: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
      await updatePluginConfig('application-manager', {
        ...pluginConfig,
        open: [...pluginConfig.open, { name: e.currentTarget.value }],
      })
    }
  }

  const onRemoveAppClick = async (appName: string) => {
    const index = pluginConfig.close.indexOf(appName)
    pluginConfig.close.splice(index, 1)
    await updatePluginConfig('application-manager', {
      ...pluginConfig,
    })
  }

  return (
    <div>
      <Text>Close the following applications when timer starts:</Text>
      <FormField>
        <TextInput onKeyPress={addPluginToClose} />
      </FormField>
      {pluginConfig.close.map((x) => (
        <Button
          onClick={() => onRemoveAppClick(x)}
          key={x}
          icon={<FormClose />}
          label={x}
        />
      ))}
      <Text>Open the following applications when timer stops:</Text>
      <FormField>
        <TextInput onKeyPress={addPluginToOpen} />
      </FormField>
      {pluginConfig.open.map((x) => (
        <Button
          onClick={() => onRemoveAppClick(x.name)}
          key={x.name}
          icon={<FormClose />}
          label={x.name}
        />
      ))}
    </div>
  )
}

export default ApplicationManager
