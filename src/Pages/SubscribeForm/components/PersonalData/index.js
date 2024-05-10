import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import personalDataFormSchema from "./schemas/personal-data-schema"
import InputForm from "Components/InputForm"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import { forwardRef, useImperativeHandle } from "react"
const PersonalData = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, getValues, reset } = useForm({
        mode: "all",
        defaultValues: {
            fullName: '',
            CPF: '',
            birthDate: '',
            phone: '',
            email: '',
        },
        values: data && {
            fullName: data.fullName,
            CPF: data.CPF,
            birthDate: data.birthDate,
            phone: data.phone,
            email: data.email,
        },
        resolver: zodResolver(personalDataFormSchema)
    })
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Dados Pessoais</h1>
            <InputForm name="fullName" label="nome completo" control={control} />
            <InputForm name="CPF" label="CPF" control={control} transform={(e) => formatCPF(e.target.value)} />
            <InputForm name="birthDate" label="data de nascimento" type="date" control={control} />
            <InputForm name="phone" label="telefone" control={control} transform={(e) => formatTelephone(e.target.value)} />
            <InputForm name="email" label="email" control={control} />

        </div>
    )
})


export default PersonalData