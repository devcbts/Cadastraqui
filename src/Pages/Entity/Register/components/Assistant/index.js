import useControlForm from "hooks/useControlForm"
import assistantSchema from "./schemas/assistant-schema"
import { NotificationService } from "services/notification"
import entityService from "services/entity/entityService"
import InputForm from "Components/InputForm"
import ButtonBase from "Components/ButtonBase"

export default function Assistant() {
    const { control, formState: { isValid }, trigger, reset, getValues } = useControlForm({
        schema: assistantSchema,
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            CPF: "",
            RG: "",
            CRESS: "",
        }
    })
    const handleSubmit = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const data = getValues()
            await entityService.registerAssistant(data)
            reset()
            NotificationService.success({ text: 'Assistente criado(a)' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h1>Informações Cadastrais</h1>
            <div style={{ width: 'max(400px, 50%)' }}>
                <InputForm control={control} label={'nome'} name={"name"} />
                <InputForm control={control} label={'email'} name={"email"} />
                <InputForm control={control} label={'celular'} name={"phone"} />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '20px', }}>
                    <InputForm control={control} label={'CPF'} name={"CPF"} />
                    <InputForm control={control} label={'RG'} name={"RG"} />
                </div>
                <InputForm control={control} label={'CRESS'} name={"CRESS"} />
                <InputForm control={control} label={'password'} name={"password"} type="password" />

            </div>
            <ButtonBase label={'cadastrar'} onClick={handleSubmit} />
        </div>

    )
}