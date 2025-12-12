import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import ButtonBase from 'Components/ButtonBase'
import CustomFilePicker from "Components/CustomFilePicker"
import FilePreview from "Components/FilePreview"
import Modal from 'Components/Modal'
import { useState } from 'react'
import { ENTITY_GROUP_TYPE_MAPPER } from "utils/enums/entity-group-document-type"
import { downloadFile } from 'utils/file/download-file'
import { downloadZip } from 'utils/file/download-zip'
import FileInfo from '../../FileCard/FileInfo'
export default function DefaultCard({ type, docs, multiple, onUpdate, onUpload, actions = null }) {
    const [open, setOpen] = useState(false)
    const handleDocs = () => {
        setOpen(prev => !prev)
    }
    return (
        < div style={{ display: 'flex', flex: 1, flexDirection: "column", alignItems: 'center' }
        }>
            <div style={{ display: "flex", alignItems: 'center', gap: '4px' }}>
                {ENTITY_GROUP_TYPE_MAPPER[type]}
                {!multiple &&
                    <CustomFilePicker
                        onUpload={(files) => {
                            onUpdate(
                                docs[0].id,
                                files,
                            )
                        }}
                    >
                        <Edit width={20} height={20} />
                    </CustomFilePicker>}
                <FileInfo doc={docs[0]} />
            </div>
            {actions}
            {
                docs.length === 0
                    ? <CustomFilePicker
                        onUpload={async (files) => {
                            onUpload(files)
                        }}
                        multiple={multiple}
                    >
                        <strong>Adicionar</strong>
                    </CustomFilePicker>
                    : ((multiple)
                        ? <strong style={{ cursor: 'pointer' }} onClick={() => {
                            handleDocs()
                            // docs.map(({ url }) => window.open(url, '_blank'))
                        }}>Ver todos ({docs.length})</strong>

                        : <FilePreview text={'visualizar'} url={docs[0].url} />)
            }
            <Modal
                onClose={handleDocs}
                onConfirm={() => {
                    downloadZip(docs.map(e => ({ filename: e.name, url: e.url })))
                }}
                confirmText='Baixar todos'
                destructiveText='Fechar'
                open={open}
            >
                {docs.map(x => <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    backgroundColor: '#eee', padding: '16px', margin: '8px', borderRadius: 8

                }}>
                    {x.name}
                    <CustomFilePicker
                        onUpload={(files) => {
                            onUpdate(
                                docs[0].id,
                                files,
                            )
                        }}
                    >

                        <ButtonBase label={'alterar'} />
                    </CustomFilePicker>
                    <ButtonBase label={'baixar'} onClick={() => downloadFile(x.url, x.name)} />
                </div>)}
            </Modal>
        </div >
    )
}