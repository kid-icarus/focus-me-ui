import React from 'react'
import { Heading, Paragraph } from 'grommet'
import { PluginProps } from '../index'

const Webhooks: React.FC<PluginProps> = () => {
  return (
    <>
      <Heading>Webhooks</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Sends one or more HTTP requests upon starting and stopping the timer.
      </Paragraph>
    </>
  )
}

export default Webhooks
