import * as React from "react";
import {useForm } from 'react-hook-form'
import PluginList from "./PluginList";

interface GeneralConfigProps {
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: FocusConfig
}

const PluginConfig: React.FC<GeneralConfigProps> = ({ updateConfig, config}) => {
  const { register, handleSubmit, formState: { errors }} = useForm();
  return (
    <main>
      <PluginList updateConfig={updateConfig} config={config}/>
      <form onSubmit={handleSubmit(updateConfig)}>
        <label htmlFor="time">Duration</label>
        {errors.time && <p>Duration Required</p>}
        <input {...register('time', {required: true})}/>
      </form>
    </main>
  )
}

export default PluginConfig
