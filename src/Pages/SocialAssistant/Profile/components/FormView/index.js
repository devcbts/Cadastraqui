import ButtonBase from "Components/ButtonBase"
import InputBase from "Components/InputBase"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { NotificationService } from "services/notification"
import assistantProfileSchema from "./schemas/assistant-profile-schema"
import socialAssistantService from "services/socialAssistant/socialAssistantService"
import styles from './styles.module.scss'
import { formatCPF } from "utils/format-cpf"
export default function FormView({ data, onEdit }) {
    const [editMode, setEditMode] = useState(false)
    const { control, getValues, reset, formState: { isValid }, trigger } = useControlForm({
        schema: assistantProfileSchema,
        defaultValues: {
            name: "",
            email: "",
            CRESS: "",
            CPF: "",
            phone: "",
        },
        initialData: data
    })
    const handleSave = async () => {

        try {
            const values = getValues()
            await socialAssistantService.updateProfile(values)
            NotificationService.success({ text: 'Informações alteradas' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao atualizar as informações' })
        }
    }
    const handleCancel = () => {
        reset()
        setEditMode(false)

    }
    return (
        <div>
            <fieldset disabled={!editMode}>
                <InputForm control={control} name="name" label={'nome completo'} />
                <InputForm control={control} name="CPF" label={'CPF'} transform={(e) => formatCPF(e.target.value)} />
                <InputForm control={control} name="CRESS" label={'CRESS'} />
                <InputForm control={control} name="phone" label={'telefone'} />
                <InputForm control={control} name="email" label={'email'} />
            </fieldset>
            <InputBase error={null} readOnly name="" label={'senha'} value="********" />
            <div className={styles.actions}>
                {editMode && <ButtonBase label={'cancelar'} onClick={handleCancel} />}
                <ButtonBase label={editMode ? 'salvar' : 'editar'} onClick={async () => {
                    if (editMode) {
                        if (!isValid) {
                            trigger()
                            return
                        }
                        await handleSave()
                    }
                    setEditMode(!editMode)
                }} />
                {!editMode && <ButtonBase label={'alterar senha'} onClick={onEdit} />}
            </div>
        </div>
    )
}