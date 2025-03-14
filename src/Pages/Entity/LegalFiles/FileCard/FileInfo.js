import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
import Modal from "Components/Modal"
import { useState } from "react"
import formatDate from 'utils/format-date'
import getLegalFields from "../get-fields"
export default function FileInfo({
    doc
}) {
    const [open, setOpen] = useState(false)
    const handleModal = () => {
        setOpen(prev => !prev)
    }
    if (!doc) {
        return null
    }
    return (
        <>
            <Help height={22} onClick={(e) => {
                e.stopPropagation()
                handleModal()
            }}
                style={{ cursor: 'pointer' }} />
            <Modal onClose={handleModal}
                open={open}
                destructiveText='Fechar'
                // onConfirm={null}
                text={'Informações do documento'}
            >
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <strong>Enviado em: {formatDate(doc?.createdAt)}</strong>
                    <strong>Nome do arquivo: {doc?.name}</strong>
                    {getLegalFields(doc?.fields).map(x => (
                        <strong>{x}</strong>
                    ))}
                </div>
            </Modal>
        </>
    )
}