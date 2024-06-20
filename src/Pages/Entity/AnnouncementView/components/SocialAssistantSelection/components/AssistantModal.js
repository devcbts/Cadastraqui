import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import useControlForm from "hooks/useControlForm";
import assistantSchema from "Pages/Entity/Register/components/Assistant/schemas/assistant-schema";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import { formatCPF } from "utils/format-cpf";
import { formatTelephone } from "utils/format-telephone";

export default function AssistantModal({ onClose, data, onUpdate }) {
    const { control, formState: { isValid }, trigger, getValues, reset } = useControlForm({
        schema: assistantSchema.omit({ password: true }),
        defaultValues: {
            name: "",
            CPF: "",
            email: "",
            RG: "",
            CRESS: "",
            phone: "",
        },
        initialData: data
    })
    const handleUpdateAssistant = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const values = getValues()
            await entityService.updateAssistant({ assistant_id: data.user_id, ...values })
            NotificationService.success({ text: 'Assistente atualizado' })
            onUpdate({ ...data, ...values })
            onClose()
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleClose = () => {
        reset()
        onClose()
    }
    return (
        <Modal
            open={!!data}
            onCancel={handleClose}
            onConfirm={handleUpdateAssistant}
            title={'Editar assistente'}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                <InputForm control={control} name="name" label="nome" />
                <InputForm control={control} name="email" label="email" />
                <InputForm control={control} name="phone" label="phone" transform={(e) => formatTelephone(e.target.value)} />
                <InputForm control={control} name="CRESS" label="CRESS" />
                <InputForm control={control} name="CPF" label="CPF" transform={(e) => formatCPF(e.target.value)} />
                <InputForm control={control} name="RG" label="RG" />
            </div>
        </Modal>
    )
}