import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import useControlForm from "hooks/useControlForm";
import assistantSchema from "Pages/Entity/Register/components/Assistant/schemas/assistant-schema";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import { formatCPF } from "utils/format-cpf";
import { formatTelephone } from "utils/format-telephone";

export default function DirectorModal({ onClose, data, onUpdate }) {
    const { control, formState: { isValid }, trigger, getValues, reset } = useControlForm({
        schema: assistantSchema.omit({ password: true, CRESS: true, RG: true }),
        defaultValues: {
            name: "",
            CPF: "",
            email: "",
            phone: "",
        },
        initialData: data
    })
    const handleUpdate = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const values = getValues()
            await entityService.updateDirector(data.id, values)
            NotificationService.success({ text: 'Responsável atualizado' })
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
            onConfirm={handleUpdate}
            title={'Editar assistente'}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                <InputForm control={control} name="name" label="nome" />
                <InputForm control={control} name="email" label="email" />
                <InputForm control={control} name="phone" label="phone" transform={(e) => formatTelephone(e.target.value)} />
                <InputForm control={control} name="CPF" label="CPF" transform={(e) => formatCPF(e.target.value)} />
            </div>
        </Modal>
    )
}