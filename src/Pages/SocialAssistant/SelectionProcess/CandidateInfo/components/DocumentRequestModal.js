import InputBase from "Components/InputBase";
import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import useControlForm from "hooks/useControlForm";
import { z } from "zod";

export default function DocumentRequestModal({
    open,
    onClose,
    onConfirm
}) {
    const { control, reset, formState: { isValid }, getValues, trigger } = useControlForm({
        schema: z.object({
            description: z.string().min(1, 'Descreva qual documento está sendo solicitado'),
            deadLineTime: z.string().date('Data inválida'),
        }),
        defaultValues: {
            description: "",
            deadLineTime: "",
            type: 'Document'
        }
    })
    const handleClose = () => {
        reset()
        onClose()
    }
    const handleAdd = () => {
        if (!isValid) {
            trigger()
            return
        }
        const values = getValues()
        onConfirm(values)
        handleClose()
    }
    return (
        <Modal
            title={'Solicitar Documento'}
            open={open}
            onClose={handleClose}
            onConfirm={handleAdd}
        >
            <InputBase error={null} value="Documento" readOnly label="tipo de solicitação" />
            <InputForm
                type="date"
                control={control}
                name="deadLineTime"
                label="prazo para envio"
            />
            <InputForm
                control={control}
                name="description"
                label="descrição"
            />
        </Modal>
    )
}