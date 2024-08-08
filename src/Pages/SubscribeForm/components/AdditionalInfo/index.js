import FormSelect from 'Components/FormSelect'
import InputForm from 'Components/InputForm'
import useControlForm from 'hooks/useControlForm'
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { forwardRef } from 'react'
import GENDER from 'utils/enums/gender'
import STATES from 'utils/enums/states'
import { additionalInfoSchema } from './schemas/additional-info'
const AdditionalInfo = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: additionalInfoSchema,
        defaultValues: {
            socialName: '',
            gender: '',
            profession: '',
            natural_city: '',
            natural_UF: '',
            nationality: '',
        },
        initialData: data
    }, ref)

    const watchGender = watch("gender")
    const watchState = watch("natural_UF")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Informações Adicionais</h1>
            {!!data?.name &&
                <h4 className={commonStyles.subTitle}>{data?.name}</h4>
            }
            {
                !!data?.fullName &&
                <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>
            }
            <>
                <InputForm name="socialName" label="nome social (quando houver)" control={control} />
                <FormSelect name="gender" label="sexo" control={control} options={GENDER} value={watchGender} />
                <InputForm name="profession" label="profissão" control={control} />
                <InputForm name="nationality" label="nacionalidade" control={control} />
                <InputForm name="natural_city" label="naturalidade" control={control} />
                <FormSelect name="natural_UF" label="estado" control={control} options={STATES} value={watchState} />
            </>
        </div>

    )
})
export default AdditionalInfo