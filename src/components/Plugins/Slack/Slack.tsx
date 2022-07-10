import React from 'react'
import { Box, Button, FormField, Heading, Paragraph, TextInput } from 'grommet'
import { PluginProps } from '../index'
import { FormView, FormViewHide } from 'grommet-icons'
import { B } from './styles'

type SlackConfig = Omit<FocusConfig['plugins']['slack'], 'enabled'>

const Slack: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  const [
    { statusEmoji, statusText, token, client_id, client_secret, redirect_uri },
    setSlackConfig,
  ] = React.useState<SlackConfig>(config.plugins.slack)

  const updateSlackConfig = (partialUpdate: Partial<SlackConfig>) => {
    const update = {
      statusEmoji: partialUpdate.statusEmoji ?? statusEmoji,
      statusText: partialUpdate.statusText ?? statusText,
      token,
      client_id,
      client_secret,
      redirect_uri,
    }
    setSlackConfig(update)
    updatePluginConfig('slack', update).catch((e) => console.error(e))
  }

  const auth: React.MouseEventHandler = (e) => {
    e.preventDefault()
    window.electron.openSlackAuth()
  }

  return (
    <>
      <Heading>Slack</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Sets Slack status as do not disturb, and sets an status message and
        emoji. Important: this requires you to set up a slack app. And requires
        you to modify your slack configuration to oauth through the app's creds.
      </Paragraph>
      <Box direction="row" justify="center">
        <B primary onClick={auth}>
          {!token ? 'Add To Slack' : 'Reset Token'}
        </B>
      </Box>
      <FormField label="Status Emoji">
        <TextInput
          name="emoji"
          value={statusEmoji}
          onChange={(e) => updateSlackConfig({ statusEmoji: e.target.value })}
        />
      </FormField>
      <FormField label="Status Text">
        <TextInput
          name="statusText"
          value={statusText}
          onChange={(e) => updateSlackConfig({ statusText: e.target.value })}
        />
      </FormField>
    </>
  )
}

export default Slack
