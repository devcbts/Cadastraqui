import ButtonBase from "Components/ButtonBase"
import FormFilePicker from "Components/FormFilePicker"
import useControlForm from "hooks/useControlForm"
import ccsFileSchema from "./ccs-file-schema"
import { ReactComponent as Arrow } from 'Assets/icons/arrow.svg'
import FilePreview from "Components/FilePreview"
import Table from "Components/Table"
import { Link } from "react-router-dom"
export default function CCSFile({
    fieldName,
    title,
    onBack,
    onSend,
    currentFile = null,
    children
}) {
    const { control, getValues, formState: { isValid }, trigger, watch, setValue } = useControlForm({
        schema: ccsFileSchema(fieldName),
        defaultValues: {
            [`file_${fieldName}`]: null,
            [`url_${fieldName}`]: null,
            // [`metadata_${fieldName}`]: null
        },
    })
    const handleFile = async () => {
        const valid = await trigger()
        if (!valid) {
            return
        }
        const file = getValues(`file_${fieldName}`)
        await onSend(file)
    }
    const watchFile = watch(`file_${fieldName}`)

    const getStatus = (date) => {
        if (!date) return ''
        const currDate = new Date()
        currDate.setDate(1)
        const compareDate = new Date(date)
        const days = currDate.getMonth() - compareDate.getMonth() +
            (12 * (currDate.getFullYear() - compareDate.getFullYear()))

        return days !== 0 ? 'Vencido' : 'Atualizado'
    }
    return (
        <>

            <div style={{ width: '100%' }}>
                <h1>{title}</h1>
                {onSend && <FormFilePicker accept={"application/pdf"} control={control} label={'Arquivo'} name={`file_${fieldName}`} />}
                {(!onSend && !currentFile) &&
                    <h3 style={{ textAlign: 'center', margin: '24px 0px' }}>Nenhum arquivo</h3>
                }
                {!!currentFile && <Table.Root headers={['data', 'status', 'ações']}>

                    <Table.Row>
                        <Table.Cell>{new Date(currentFile?.metadata?.date).toLocaleString('pt-br', { month: 'long', year: 'numeric' })}</Table.Cell>
                        <Table.Cell>{getStatus(currentFile?.metadata?.date)}</Table.Cell>
                        <Table.Cell>
                            <Link to={currentFile?.url} target="_blank">
                                <ButtonBase label={'visualizar'} />
                            </Link>
                        </Table.Cell>
                    </Table.Row>


                </Table.Root>}
                <FilePreview file={watchFile} url={getValues(`url_${fieldName}`)} text={'visualizar documento'} />
            </div>
            {children}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                {onSend && <ButtonBase label={'enviar'} onClick={handleFile} />}
            </div>
            <div>

            </div>
        </>
    )
}