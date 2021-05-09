import React, { useState } from 'react'
import { FormField, RangeInput } from 'grommet'
import { PluginProps } from '../index'

const Rain: React.FC<PluginProps> = ({ config, updatePluginConfig }) => {
  const pluginConfig = config.plugins.rain
  const [value, setValue] = useState<number>(Number(pluginConfig.volume))

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const volume = parseFloat(event.target.value)
    setValue(volume)
    updatePluginConfig('rain', { volume }).catch((e) => console.error(e))
  }

  return (
    <FormField label={`Volume: ${value * 100}%`}>
      <RangeInput
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={onChange}
      />
    </FormField>
  )
}

export default Rain
