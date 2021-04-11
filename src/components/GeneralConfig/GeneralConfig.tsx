import * as React from "react";
import {useForm} from 'react-hook-form'

interface GeneralConfigProps {
  duration: number
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: any
}

const GeneralConfig: React.FC<GeneralConfigProps> = ({duration, updateConfig, config}) => {
  const { register, handleSubmit, formState: { errors }} = useForm();
  return (
    <main>
      <form onSubmit={handleSubmit(updateConfig)}>
        <label htmlFor="time">Duration</label>
        {errors.time && <p>Duration Required</p>}
        <input {...register('time', {required: true})}/>
      </form>
    </main>
  )
}

export default GeneralConfig
