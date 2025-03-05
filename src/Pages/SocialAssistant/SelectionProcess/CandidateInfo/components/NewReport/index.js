import FormFilePicker from "Components/FormFilePicker";
import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import useControlForm from "hooks/useControlForm";
import reportSchema from "./schemas/report-schema";

export default function NewReport({ open, onClose, onSubmit }) {
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: reportSchema,
        defaultValues: {
            file: null,
            date: ""
        }
    })
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        const values = getValues()
        onSubmit(values)
        onClose()
    }
    return (
        <Modal
            open={open}
            title={'Fazer Upload de Relatórios'}
            onClose={onClose}
            onConfirm={handleSubmit}
        >
            <div style={{ width: '100%' }}>
                <InputForm control={control} name="date" type='date' label={'data do relatório'} />
                <FormFilePicker control={control} name="file" label={'documento'} accept={"application/pdf"} />
            </div>
        </Modal>
    )
}