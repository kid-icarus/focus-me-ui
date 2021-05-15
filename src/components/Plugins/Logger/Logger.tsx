import React from 'react'
import { FormField, Heading, Paragraph, TextInput } from 'grommet'
import { PluginProps } from '../index'

const Logger: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  return (
    <>
      <Heading>Logger</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        (For CLI only): This controls whether to continuously log the time
        remaining to the terminal.
      </Paragraph>
    </>
  )
}

export default Logger
