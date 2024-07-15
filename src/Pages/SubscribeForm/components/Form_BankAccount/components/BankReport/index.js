import ButtonBase from "Components/ButtonBase";
import FormFilePicker from "Components/FormFilePicker";
import Tooltip from "Components/Tooltip";
import useControlForm from "hooks/useControlForm";
import { ReactComponent as Arrow } from "Assets/icons/arrow.svg";
import { Link } from "react-router-dom";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import bankReportSchema from "./schemas/bank-report-schema";
import styles from './styles.module.scss'
import FilePreview from "Components/FilePreview";
import { useEffect, useState } from "react";
import candidateService from "services/candidate/candidateService";
import Table from "Components/Table";
import Loader from "Components/Loader";
export default function BankReport({ id, onBack }) {
    const [isLoading, setIsLoading] = useState(true)
    const { control, getValues, formState: { isValid }, trigger, watch, setValue } = useControlForm({
        schema: bankReportSchema,
        defaultValues: {
            file_bankReport: null,
            date: null,
            url_bankReport: null
        },
    })
    useEffect(() => {
        const fetchRegistrato = async () => {
            try {
                setIsLoading(true)
                const registrato = await candidateService.getRegistrato(id)
                setValue('date', registrato.date)
                setValue('url_bankReport', registrato.url)
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
            const value = getValues('file_bankReport')
            const date = new Date()
            const formData = new FormData()
            formData.append(`file_${date.getMonth() + 1}-${date.getFullYear()}`, value)

            await uploadService.uploadBySectionAndId({ section: 'registrato', id }, formData)
            NotificationService.success({ text: 'Registrato enviado com sucesso' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar o registrato, tente novamente' })
        }
    }
    const getStatus = () => {
        const currDate = new Date()
        currDate.setDate(1)
        const compareDate = watch('date')
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
                    {watch('date') && <Table.Root headers={['data', 'status', 'ações']}>
                        <Table.Row>
                            <Table.Cell>{watch('date')?.toLocaleString('pt-br', { month: 'long', year: 'numeric' })}</Table.Cell>
                            <Table.Cell>{getStatus()}</Table.Cell>
                            <Table.Cell>
                                <Link to={watch('url_bankReport')} target="_blank">
                                    <ButtonBase label={'visualizar'} />
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Root>}
                    {/* <FilePreview file={watchFile} url={getValues("url_bankReport")} text={'visualizar documento'} /> */}
                </div>
                <Tooltip tooltip={'Não possui ainda o seu relatório de contas e relacionamento do mês atual?'}>
                    <a href="https://www.bcb.gov.br/meubc/registrato" target="_blank">
                        <ButtonBase label={'gerar relatório'} />
                    </a>
                </Tooltip>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>

                    <ButtonBase onClick={onBack}><Arrow width="40px" style={{ transform: "rotateZ(180deg)" }} /></ButtonBase>
                    <ButtonBase label={'enviar'} onClick={handleUploadFile} />
                </div>
            </div>
            <div>

            </div>
        </>
    )
}