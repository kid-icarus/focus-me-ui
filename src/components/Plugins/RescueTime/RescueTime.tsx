import React from 'react'
import { Box, Button, FormField, Heading, Paragraph, TextInput } from 'grommet'
import { PluginProps } from '../index'
import { FormView, FormViewHide } from 'grommet-icons'

const RescueTime: React.FC<PluginProps> = ({ config }) => {
  const pluginConfig = config.plugins['rescue-time']
  const [hidden, setHidden] = React.useState(true)
  const toggleHidden = () => {
    setHidden((prev) => !prev)
  }
  return (
    <>
      <Heading>RescueTime</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Starts a FocusTime session for the duration of the focus session.
      </Paragraph>
      <Box direction="row" margin={{ top: 'large' }} align="center">
        <Box flex="grow">
          <FormField label="API Key">
            <TextInput
              type={hidden ? 'password' : 'text'}
              value={pluginConfig.apiKey}
            />
          </FormField>
        </Box>
        <Box align="center" justify="center">
          <Button
            plain
            onClick={toggleHidden}
            icon={hidden ? <FormView /> : <FormViewHide />}
          />
        </Box>
      </Box>
    </>
  )
}

export default RescueTime
