import { useForm } from 'react-hook-form'
import commonStyles from '../styles.module.scss'
import { additionalInfoSchema } from './schemas/additional-info'
import { zodResolver } from '@hookform/resolvers/zod'
import InputForm from '../../../../../Components/InputForm'
export default function AdditionalInfo() {
    const { control, getValues } = useForm({
        mode: "all",
        defaultValues: {
            socialName: '',
            gender: '',
            profession: '',
            naturality: '',
            nacionality: '',
        },
        resolver: zodResolver(additionalInfoSchema)
    })
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Informações Adicionais</h1>
            <div>
                <InputForm name="socialName" label="nome social (quando houver)" control={control} />
                <InputForm name="gender" label="sexo" control={control} />
                <InputForm name="profession" label="profissão" control={control} />
                <InputForm name="naturality" label="naturalidade" control={control} />
                <InputForm name="nacionality" label="nacionalidade" control={control} />
            </div>
        </div>

    )
}