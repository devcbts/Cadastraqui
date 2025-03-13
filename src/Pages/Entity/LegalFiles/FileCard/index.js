import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
import Modal from 'Components/Modal'
import { useState } from 'react'
import { downloadFile } from 'utils/file/download-file'
import getLegalFields from '../get-fields'

export default function FileCard({
    label,
    doc,
    ...props
}) {
    const [showInfo, setShowInfo] = useState(false)
    const handleModal = () => {
        setShowInfo(prev => !prev)
    }
    return (
        <div style={{
            backgroundColor: '#fff',
            width: 'min(100%,380px)',
            minHeight: '60px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: "center",
            justifyContent: 'space-between',
            marginBottom: '8px',
            flexDirection: 'column',
            placeSelf: 'center',
            overflow: 'hidden'
        }}
            {...props}
        >
            <div style={{
                padding: '16px 24px',

            }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <strong >{label}</strong>
                    {(!!doc?.fields && JSON.stringify(doc?.fields) !== "{}") ?


                        <Help height={22} onClick={(e) => {
                            e.stopPropagation()
                            handleModal()
                        }}
                            style={{ cursor: 'pointer' }} />
                        : null}
                </div>
            </div>
            <div style={{
                minHeight: '30px',
                width: '100%',
                display: "flex"
            }}>
                {
                    doc?.url && (
                        <div style={{
                            width: '100%',
                            padding: '0 8px',
                            flex: 1,
                            // backgroundColor: '#bbb',
                            alignItems: 'center', justifyContent: 'space-around',
                            display: 'flex',
                        }}>
                            <strong
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(doc?.url, '_blank')
                                }}> Visualizar</strong>
                            <strong
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation()

                                    downloadFile(doc?.url, doc?.name)
                                }}
                            >  Baixar</strong>
                        </div>
                    )
                }
            </div>
            <Modal onClose={handleModal}
                open={showInfo}
                destructiveText='Fechar'
                onConfirm={null}
                text={'Informações do documento'}
            >
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
                    {getLegalFields(doc?.fields).map(x => (
                        <strong>{x}</strong>
                    ))}
                </div>
            </Modal>
        </div>
    )
}