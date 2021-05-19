import React from 'react'
import { Box, Button, FormField, Heading, Paragraph, TextInput } from 'grommet'
import { PluginProps } from '../index'
import { FormView, FormViewHide } from 'grommet-icons'

type SlackConfig = Omit<FocusConfig['plugins']['slack'], 'enabled'>

const Slack: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  const [
    { statusEmoji, statusText, token },
    setSlackConfig,
  ] = React.useState<SlackConfig>(config.plugins.slack)
  const [hidden, setHidden] = React.useState(true)
  const toggleHidden = () => {
    setHidden((prev) => !prev)
  }

  const updateSlackConfig = (partialUpdate: Partial<SlackConfig>) => {
    const update = {
      statusEmoji: partialUpdate.statusEmoji ?? statusEmoji,
      statusText: partialUpdate.statusText ?? statusText,
      token: partialUpdate.token ?? token,
    }
    setSlackConfig(update)
    updatePluginConfig('slack', update).catch((e) => console.error(e))
  }

  return (
    <>
      <Heading>Slack</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Sets Slack status as do not disturb, and sets an status message and
        emoji.
      </Paragraph>
      <Box direction="row" align="center" flex="shrink">
        <Box flex="grow">
          <FormField label="API Token">
            <TextInput
              type={hidden ? 'password' : 'text'}
              name="token"
              value={token}
              onChange={(e) => updateSlackConfig({ token: e.target.value })}
            />
          </FormField>
        </Box>
        <Button
          plain
          onClick={toggleHidden}
          icon={hidden ? <FormView /> : <FormViewHide />}
        />
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
