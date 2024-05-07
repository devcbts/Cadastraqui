import { useForm } from 'react-hook-form'
import commonStyles from '../Form_BasicInformation/styles.module.scss'
import { additionalInfoSchema } from './schemas/additional-info'
import { zodResolver } from '@hookform/resolvers/zod'
import InputForm from 'Components/InputForm'
import { forwardRef, useImperativeHandle } from 'react'
import FormSelect from 'Components/FormSelect'
import GENDER from 'utils/enums/gender'
const AdditionalInfo = forwardRef(({ data }, ref) => {
    const { control, trigger, formState: { isValid }, getValues, watch } = useForm({
        mode: "all",
        defaultValues: {
            socialName: '',
            gender: '',
            profession: '',
            naturality: '',
            nacionality: '',
        },
        values: data && {
            socialName: data.socialName,
            gender: data.gender,
            profession: data.profession,
            naturality: data.naturality,
            nacionality: data.nacionality,
        },
        resolver: zodResolver(additionalInfoSchema)
    })
    const watchGender = watch("gender")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Informações Adicionais</h1>
            <div>
                <InputForm name="socialName" label="nome social (quando houver)" control={control} />
                <FormSelect name="gender" label="sexo" control={control} options={GENDER} value={GENDER.find(e => e.value === watchGender)} />
                <InputForm name="profession" label="profissão" control={control} />
                <InputForm name="naturality" label="naturalidade" control={control} />
                <InputForm name="nacionality" label="nacionalidade" control={control} />
            </div>
        </div>

    )
})
export default AdditionalInfo