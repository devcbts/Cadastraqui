import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { z } from "zod";

export default function UndoneScheduleModal({
    open, onConfirm, onClose
}) {
    const { control, watch, reset, formState: { isValid }, trigger, getValues } = useControlForm({
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
        if (!isValid) {
            trigger()
            return
        }
        onConfirm(getValues())
    }
    const handleClose = () => {
        reset()
        onClose()
    }
    return (
        <Modal title={'Não realizada'} open={open} onConfirm={handleConfirm} onCancel={handleClose}>
            <InputForm control={control} name="reason" label={'motivo'}
            // value={watch("reason")} options={[{ label: 'teste', value: 'teste' }]} 
            />
            <InputForm control={control} name="comment" label={'comentário (opcional)'} type="text-area"
            // value={watch("reason")} options={[{ label: 'teste', value: 'teste' }]} 
            />
        </Modal>
    )
}