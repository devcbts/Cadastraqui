import ButtonBase from "Components/ButtonBase"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import entityService from "services/entity/entityService"
import { NotificationService } from "services/notification"
import { formatCPF } from "utils/format-cpf"
import lawyerSchema from "./schema"

export default function Lawyer() {
    const { control, formState: { isValid }, trigger, reset, getValues } = useControlForm({
        schema: lawyerSchema,
        defaultValues: {
            CPF: "",
            name: "",
            email: "",
            password: "",
        }
    })
    const handleSubmit = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const data = getValues()
            await entityService.registerLawyer(data)
            reset()
            NotificationService.success({ text: 'Advogado(a) criado(a)' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <h1>Informações Cadastrais</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ width: 'max(290px, 50%)' }}>
                    <InputForm control={control} label={'CPF'} name={"CPF"} transform={(e) => formatCPF(e.target.value)} />
                    <InputForm control={control} label={'nome'} name={"name"} />
                    <InputForm control={control} label={'email'} name={"email"} />
                    {/* <InputForm control={control} label={'celular'} name={"phone"} transform={(e) => formatTelephone(e.target.value)} /> */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px', }}>
                    </div>
                    <InputForm control={control} label={'senha'} name={"password"} type="password" />
                </div>
                <ButtonBase label={'cadastrar'} onClick={handleSubmit} />
            </div>

        </>
    )
}