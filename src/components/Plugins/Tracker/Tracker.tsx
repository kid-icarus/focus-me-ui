import React from 'react'
import { Heading, Paragraph } from 'grommet'
import { PluginProps } from '../index'

const Tracker: React.FC<PluginProps> = () => {
  return (
    <>
      <Heading>Tracker</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        This plugin will keep track of how long you have been focused on a given
        application for the duration of the focus session. Additionally, it
        persists completed session for future analysis.
      </Paragraph>
    </>
  )
}

export default Tracker
