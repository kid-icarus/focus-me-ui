import React from 'react'
import { Heading, Paragraph } from 'grommet'
import { PluginProps } from '../index'

const Spotify: React.FC<PluginProps> = () => {
  return (
    <>
      <Heading>Spotify</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Play spotify for the duration of the focus session.
      </Paragraph>
    </>
  )
}

export default Spotify
