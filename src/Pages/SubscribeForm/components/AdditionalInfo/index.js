import { useForm } from 'react-hook-form'
import commonStyles from '../Form_BasicInformation/styles.module.scss'
import { additionalInfoSchema } from './schemas/additional-info'
import { zodResolver } from '@hookform/resolvers/zod'
import InputForm from 'Components/InputForm'
import { forwardRef, useImperativeHandle } from 'react'
import FormSelect from 'Components/FormSelect'
import GENDER from 'utils/enums/gender'
import STATES from 'utils/enums/states'
const AdditionalInfo = forwardRef(({ data }, ref) => {
    const { control, trigger, formState: { isValid }, getValues, watch } = useForm({
        mode: "all",
        defaultValues: {
            socialName: '',
            gender: '',
            profession: '',
            natural_city: '',
            natural_UF: '',
            nationality: '',
        },
        values: data && {
            socialName: data.socialName,
            gender: data.gender,
            profession: data.profession,
            natural_city: data.natural_city,
            natural_UF: data.natural_UF,
            nationality: data.nationality,
        },
        resolver: zodResolver(additionalInfoSchema)
    })
    const watchGender = watch("gender")
    const watchState = watch("natural_UF")
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
                <InputForm name="nationality" label="nacionalidade" control={control} />
                <InputForm name="natural_city" label="naturalidade" control={control} />
                <FormSelect name="natural_UF" label="estado" control={control} options={STATES} value={STATES.find(e => e.value === watchState)} />
            </div>
        </div>

    )
})
export default AdditionalInfo