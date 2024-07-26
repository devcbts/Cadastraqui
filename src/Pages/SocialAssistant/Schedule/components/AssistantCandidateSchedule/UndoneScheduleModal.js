import FormSelect from "Components/FormSelect";
import Modal from "Components/Modal";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { z } from "zod";

export default function UndoneScheduleModal({
    open, onConfirm, onClose
}) {
    const { control, watch, reset } = useControlForm({
        schema: z.object({
            reason: z.string().min(1, 'Motivo obrigatório'),
            comment: z.string().nullish()
        }),
        defaultValues: {
            reason: '',
            comment: null
        }
    })
    const handleConfirm = () => {

    }
    const handleClose = () => {
        reset()
        onClose()
    }
    return (
        <Modal open={open} onConfirm={handleConfirm} onCancel={handleClose}>
            <FormSelect control={control} name="reason" label={'motivo'} value={watch("reason")} options={[{ label: 'teste', value: 'teste' }]} />
        </Modal>
    )
}