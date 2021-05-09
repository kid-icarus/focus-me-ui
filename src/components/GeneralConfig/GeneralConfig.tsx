import * as React from 'react'
import { useForm } from 'react-hook-form'
import { FormField, TextInput } from 'grommet'

interface GeneralConfigProps {
  updateConfig: (formValues: Partial<FocusConfig>) => Promise<void>
  config: FocusConfig
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
        <FormField label="Duration" error={errors.time && 'Duration Required'}>
          <TextInput
            {...register('time', { required: true })}
            defaultValue={config.time}
            type={'number'}
          />
        </FormField>
        <input type="submit" />
      </form>
    </main>
  )
}

export default GeneralConfig
