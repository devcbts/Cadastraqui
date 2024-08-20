import { ReactComponent as Arrow } from "Assets/icons/arrow.svg";
import ButtonBase from "Components/ButtonBase";
import FormFilePicker from "Components/FormFilePicker";
import Loader from "Components/Loader";
import Table from "Components/Table";
import Tooltip from "Components/Tooltip";
import useControlForm from "hooks/useControlForm";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import bankReportSchema from "./schemas/bank-report-schema";
import styles from './styles.module.scss';
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
export default function BankReport({ id, onBack }) {
    const [isLoading, setIsLoading] = useState(true)
    const { control, getValues, formState: { isValid }, trigger, watch, setValue } = useControlForm({
        schema: bankReportSchema,
        defaultValues: {
            file_bankReport: null,
            url_bankReport: null,
            metadata_bankReport: null,
            file_pixKey: null,
            url_pixKey: null,
            metadata_pixKey: null
        },
    })
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchRegistrato = async () => {
            try {
                setIsLoading(true)
                const registrato = await candidateService.getRegistrato(id)
                setData(registrato)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchRegistrato()
    }, [id])
    const handleUploadFile = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const report = getValues('file_bankReport')
            const pix = getValues('file_pixKey')
            const date = new Date()
            const formData = new FormData()
            const metadata = {
                [`metadata_${date.getMonth() + 1}-${date.getFullYear()}-registrato`]: {
                    type: METADATA_FILE_TYPE.BANK.REGISTRATO,
                    category: METADATA_FILE_CATEGORY.Finance,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-01T00:00:00`
                },
                [`metadata_${date.getMonth() + 1}-${date.getFullYear()}-pix`]: {
                    type: METADATA_FILE_TYPE.BANK.PIX,
                    category: METADATA_FILE_CATEGORY.Finance,
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-01T00:00:00`
                }
            }
            formData.append("file_metadatas", JSON.stringify(metadata))
            formData.append(`file_${date.getMonth() + 1}-${date.getFullYear()}-registrato`, report)
            formData.append(`file_${date.getMonth() + 1}-${date.getFullYear()}-pix`, pix)

            await uploadService.uploadBySectionAndId({ section: 'registrato', id }, formData)
            NotificationService.success({ text: 'Documentos enviados com sucesso' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar documentos, tente novamente' })
        }
    }
    const getStatus = (date) => {
        if (!date) return ''
        const currDate = new Date()
        currDate.setDate(1)
        const compareDate = date
        const days = currDate.getMonth() - compareDate.getMonth() +
            (12 * (currDate.getFullYear() - compareDate.getFullYear()))

        return days !== 0 ? 'Vencido' : 'Atualizado'
    }
    return (
        <>
            <Loader loading={isLoading} />
            <h1>{new Date().toLocaleString('pt-br', { year: 'numeric', month: 'long' }).toUpperCase()}</h1>
            <div className={styles.report}>
                <h1>Relatório de Contas e Relacionamentos (CCS)</h1>
                <div style={{ width: '100%' }}>
                    <FormFilePicker accept={"application/pdf"} control={control} label={'Arquivo'} name={'file_bankReport'} />
                    <h1>Chaves PIX</h1>
                    <FormFilePicker accept={"application/pdf"} control={control} label={'Arquivo'} name={'file_pixKey'} />
                    {<Table.Root headers={['data', 'status', 'tipo', 'ações']}>
                        {
                            data.map(e => (
                                <Table.Row>
                                    <Table.Cell>{e.date?.toLocaleString('pt-br', { month: 'long', year: 'numeric' })}</Table.Cell>
                                    <Table.Cell>{getStatus(e.date)}</Table.Cell>
                                    <Table.Cell>{e.type}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={e.url} target="_blank">
                                            <ButtonBase label={'visualizar'} />
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>}
                    {/* <FilePreview file={watchFile} url={getValues("url_bankReport")} text={'visualizar documento'} /> */}
                </div>
                <Tooltip tooltip={'Não possui ainda o seu relatório de contas e relacionamento do mês atual? Clique em Gerar relatório'}>
                    <a href="https://www.bcb.gov.br/meubc/registrato" target="_blank" rel="noreferrer">
                        <ButtonBase label={'gerar relatório'} />
                    </a>
                </Tooltip>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                    <ButtonBase onClick={onBack}><Arrow width="30px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                    <ButtonBase label={'enviar'} onClick={handleUploadFile} />
                </div>
            </div>
            <div>

            </div>
        </>
    )
}