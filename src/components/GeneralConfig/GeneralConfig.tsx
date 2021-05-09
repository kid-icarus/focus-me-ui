import * as React from 'react'
import { useForm } from 'react-hook-form'

interface GeneralConfigProps {
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: any
}

const GeneralConfig: React.FC<GeneralConfigProps> = ({
  updateConfig,
  config,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <main>
      <form onSubmit={handleSubmit(updateConfig)}>
        <label htmlFor="time">Duration</label>
        {errors.time && <p>Duration Required</p>}
        <input
          {...register('time', { required: true })}
          defaultValue={config.time}
        />
        <input type="submit" />
      </form>
    </main>
  )
}

export default GeneralConfig
