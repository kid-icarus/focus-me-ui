import React, { useState } from 'react'
import { FormField, Heading, Paragraph, RangeInput } from 'grommet'
import { PluginProps } from '../index'

const Bell: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  const pluginConfig = config.plugins.bell
  const [value, setValue] = useState<number>(Number(pluginConfig.volume ?? 0))

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = parseFloat(event.target.value)
    setValue(volume)
    updatePluginConfig('bell', { volume }).catch((e) => console.error(e))
  }

  return (
    <>
      <Heading>Bell</Heading>
      <Paragraph margin={{ top: 'small', bottom: 'medium' }}>
        Plays a pleasant bell at the start and end of the timer.
      </Paragraph>
      <FormField label={`Volume: ${value * 100}%`}>
        <RangeInput
          min={0}
          max={1}
          step={0.1}
          value={value}
          onChange={onChange}
        />
      </FormField>
    </>
  )
}

export default Bell
