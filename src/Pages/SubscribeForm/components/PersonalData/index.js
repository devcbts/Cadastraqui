import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import personalDataFormSchema from "./schemas/personal-data-schema"
import InputForm from "Components/InputForm"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import { forwardRef } from "react"
import useControlForm from "hooks/useControlForm"
const PersonalData = forwardRef(({ data }, ref) => {
    const { control } = useControlForm({
        schema: personalDataFormSchema,
        defaultValues: {
            fullName: '',
            CPF: '',
            birthDate: '',
            landlinePhone: '',
            email: '',
        },
        initialData: data
    }, ref)


    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Dados Pessoais</h1>
            <InputForm name="fullName" label="nome completo" control={control} />
            <InputForm name="CPF" label="CPF" control={control} transform={(e) => formatCPF(e.target.value)} />
            <InputForm name="birthDate" label="data de nascimento" type="date" control={control} />
            <InputForm name="landlinePhone" label="telefone" control={control} transform={(e) => formatTelephone(e.target.value)} />
            <InputForm name="email" label="email" control={control} />

        </div>
    )
})


export default PersonalData