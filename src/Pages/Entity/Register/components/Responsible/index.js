import ButtonBase from "Components/ButtonBase"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import entityService from "services/entity/entityService"
import { NotificationService } from "services/notification"
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import responsibleSchema from "./schemas/responsible-schema"

export default function Responsible() {
    const { control, formState: { isValid }, trigger, getValues, reset } = useControlForm({
        schema: responsibleSchema,
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            CPF: "",
            password: ""
        }
    })
    const handleSubmit = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const data = getValues()
            await entityService.registerResponsible(data)
            reset()
            NotificationService.success({ text: 'Diretor criado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h1>Informações Cadastrais</h1>
            <div style={{ width: 'max(290px, 50%)' }}>
                <InputForm control={control} name="name" label="nome" />
                <InputForm control={control} name="email" label="email" />
                <InputForm control={control} name="phone" label="telefone" transform={(e) => formatTelephone(e.target.value)} />
                <InputForm control={control} name="CPF" label="CPF" transform={(e) => formatCPF(e.target.value)} />
                <InputForm control={control} name="password" label="senha" type="password" />
            </div>
            <ButtonBase label={'cadastrar'} onClick={handleSubmit} />
        </div>
    )
}