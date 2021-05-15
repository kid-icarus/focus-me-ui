import React from 'react'
import { Box, Button, FormField, Heading, Paragraph, TextInput } from 'grommet'
import { PluginProps } from '../index'
import { FormView, FormViewHide } from 'grommet-icons'

const Slack: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  const { statusEmoji, statusText, token } = config.plugins.slack
  const [hidden, setHidden] = React.useState(true)
  const toggleHidden = () => {
    setHidden((prev) => !prev)
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
        <TextInput name="emoji" value={statusEmoji} />
      </FormField>
      <FormField label="Status Text">
        <TextInput name="" value={statusText} />
      </FormField>
    </>
  )
}

export default Slack
