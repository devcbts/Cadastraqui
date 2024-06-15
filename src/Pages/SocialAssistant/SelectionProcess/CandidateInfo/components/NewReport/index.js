import FilePickerBase from "Components/FilePickerBase";
import InputBase from "Components/InputBase";
import Modal from "Components/Modal";

export default function NewReport({ open, onClose }) {
    return (
        <Modal
            open={open}
            title={'Fazer Upload de Relatórios'}
            onCancel={onClose}
        >
            <div style={{ width: '100%' }}>
                <InputBase type='date' label={'data do relatório'} error={null} />
                <FilePickerBase label={'documento'} error={null} />
            </div>
        </Modal>
    )
}