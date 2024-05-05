import { Controller, useForm } from "react-hook-form"
import ButtonBase from "../../../../../Components/ButtonBase"
import { zodResolver } from "@hookform/resolvers/zod"
import personalDataFormSchema from "./schemas/personal-data-schema"
import InputForm from "../../../../../Components/InputForm"
import styles from '../styles.module.scss'
export default function PersonalData() {
    const { control, getValues } = useForm({
        mode: "all",
        defaultValues: {
            fullName: '',
            CPF: '',
            birthDate: '',
            phone: '',
            email: '',
        },
        resolver: zodResolver(personalDataFormSchema)
    })
    return (
        <div className={styles.formcontainer}>
            <h1 className={styles.title}>Dados Pessoais</h1>
            <div>
                <InputForm name="fullName" label="nome completo" control={control} />
                <InputForm name="CPF" label="CPF" control={control} />
                <InputForm name="birthDate" label="data de nascimento" type="date" control={control} />
                <InputForm name="phone" label="telefone" control={control} />
                <InputForm name="email" label="email" control={control} />
            </div>

        </div>
    )
}