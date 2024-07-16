import FormFilePicker from "Components/FormFilePicker";
import Modal from "Components/Modal";
import useControlForm from "hooks/useControlForm";
import { z } from "zod";

export default function SendDocumentSolicitation({
    data,
    onClose,
    onConfirm
}) {
    const { control, trigger, formState: { isValid }, getValues } = useControlForm({
        schema: z.object({ file: z.instanceof(File, 'Arquivo obrigatório').refine((data) => data !== null, 'Arquivo obrigatório') }),
        defaultValues: {
            file: null
        }
    })
    const handleConfirm = () => {
        if (!isValid) {
            trigger()
            return
        }
        const file = getValues("file")
        onConfirm(data.id, file)
        onClose()
    }
    return (
        <Modal
            open={!!data}
            title={'Enviar Documento'}
            text={data?.description}
            onCancel={onClose}
            onConfirm={handleConfirm}
        >
            <div>
                <FormFilePicker control={control} label={"arquivo"} name={"file"} accept={'application/pdf'} />
            </div>
        </Modal>
    )
}