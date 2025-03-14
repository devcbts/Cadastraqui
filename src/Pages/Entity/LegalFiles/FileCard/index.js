import { ReactComponent as NewDocument } from 'Assets/icons/fileCirclePlus.svg'
import { ReactComponent as Edit } from 'Assets/icons/pencil.svg'
import CustomFilePicker from 'Components/CustomFilePicker'
import { downloadFile } from 'utils/file/download-file'
import FileInfo from './FileInfo'
export default function FileCard({
    label,
    doc,
    onAdd,
    multiple = false,
    onEdit,
    ...props
}) {



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
            overflow: 'hidden',
            boxShadow: '0px 0px 8px .1px #999'
        }}
            {...props}
        >
            <div style={{
                padding: '16px 24px',

            }}>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <strong >{label}</strong>
                    {(!!doc) ?
                        <>
                            {onEdit && <CustomFilePicker onUpload={(file) => onEdit(doc.id, file[0])}>
                                <Edit height={22} />
                            </CustomFilePicker>}
                            <FileInfo doc={doc} />
                        </>
                        : <>
                            {onAdd && <CustomFilePicker onUpload={(file) => onAdd(file)} multiple={multiple}>
                                <NewDocument />
                            </CustomFilePicker>}
                        </>}
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


        </div>
    )
}