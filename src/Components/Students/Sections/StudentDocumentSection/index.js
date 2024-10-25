import TextEditor from 'Components/TextEditor'
import styles from '../styles.module.scss'
import FilePickerBase from 'Components/FilePickerBase'
import studentService from 'services/student/studentService'
import { NotificationService } from 'services/notification'
import debounce from 'lodash.debounce'
import useAuth from 'hooks/useAuth'
import METADATA_FILE_TYPE from 'utils/file/metadata-file-type'
import METADATA_FILE_CATEGORY from 'utils/file/metadata-file-category'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router'
import ButtonBase from 'Components/ButtonBase'
import InputBase from 'Components/InputBase'
export default function StudentDocumentSection({
    studentId,
    candidateId,
    data
}) {
    const navigate = useNavigate()
    const handleChangeObservation = debounce(async (rich, plain) => {
        try {
            await studentService.createOrUpdateObservation({
                studentId: studentId,
                richText: rich,
                plainText: plain

            })
            NotificationService.success({ text: 'Observaçoes alteradas', type: "toast" })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message, type: "toast" })
        }

    }, 1000)
    const handleDocument = async (files = []) => {
        if (files.length === 0) {
            return
        }
        try {
            const formData = new FormData()
            for (const file of files) {
                const fileName = uuidv4()

                formData.append("file_metadatas", JSON.stringify({
                    [`metadata_${fileName}`]: {
                        type: METADATA_FILE_TYPE.STUDENT.ADDITIONAL_ASSISTANT,
                        category: METADATA_FILE_CATEGORY.Student
                    }
                }))
                formData.append(fileName, file)
            }
            await studentService.uploadDocument(studentId, formData)
            NotificationService.success({ text: 'Arquivo enviado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handlePageChange = (page) => {
        navigate(page, { state: { candidateId: candidateId } })
    }
    const { auth } = useAuth()
    const documentFields = [
        { field: "isUpdated", label: 'status' },
        { field: "lastUpdate", label: 'última atualização' },
    ]
    return (
        <div className={styles.information}>
            <h2 className={styles.title}>Documentos</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ButtonBase label={'ficha completa'} onClick={() => handlePageChange("ficha-completa")} style={{ alignSelf: 'start' }} />
                <ButtonBase label={'documentos enviados'} onClick={() => handlePageChange("documentos")} style={{ alignSelf: 'start' }} />
            </div>
            {Object.entries(data ?? {}).map(([k, v]) => {
                const currField = documentFields.find(e => k === e.field)
                if (!currField) { return null }
                return (
                    <div className={styles.content}>
                        <h4 className={styles.titleinput}>{currField.label}</h4>
                        <InputBase error={null} value={v} key={k} disabled />
                    </div>
                )
            })}
            {auth?.role === "ASSISTANT" &&
                <>
                    <TextEditor
                        title={'Observações'}
                        initialValue={data?.observation}
                        onChange={handleChangeObservation} />
                    <div style={{ width: 'inherit', placeSelf: 'center' }}>

                        <FilePickerBase label="enviar documento" error={null}
                            multiple
                            onChange={(e) => {
                                handleDocument(e.target.files)
                            }} />
                    </div>
                </>
            }
        </div>
    )
}