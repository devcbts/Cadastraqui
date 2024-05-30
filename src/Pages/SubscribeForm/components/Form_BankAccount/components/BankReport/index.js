import ButtonBase from "Components/ButtonBase";
import FormFilePicker from "Components/FormFilePicker";
import Tooltip from "Components/Tooltip";
import useControlForm from "hooks/useControlForm";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import createFileForm from "utils/create-file-form";
import bankReportSchema from "./schemas/bank-report-schema";
import styles from './styles.module.scss'
export default function BankReport({ id }) {
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        schema: bankReportSchema,
        defaultValues: {
            file_bankReport: null
        }
    })
    const handleUploadFile = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const values = getValues()
            const formData = createFileForm(values)
            await uploadService.uploadBySectionAndId({ section: 'registrato', id }, formData)
            NotificationService.success({ text: 'Registrato enviado com sucesso' })
        } catch (err) {
            NotificationService.error({ text: 'Erro ao enviar o registrato, tente novamente' })
        }
    }
    return (
        <>
            <h1>{new Date().toLocaleString('pt-br', { year: 'numeric', month: 'long' }).toUpperCase()}</h1>
            <div className={styles.report}>
                <h1>Relatório de Contas e Relationamentos (CCS)</h1>
                <div style={{ width: '100%' }}>
                    <FormFilePicker accept={"application/pdf"} control={control} label={'Arquivo'} name={'file_bankReport'} />
                </div>
                <ButtonBase label={'enviar'} onClick={handleUploadFile} />
                <Tooltip tooltip={'Não possui ainda o seu relatório de contas e relacionamento do mês atual?'}>
                    <a href="https://www.bcb.gov.br/meubc/registrato" target="_blank">
                        <ButtonBase label={'gerar relatório'} />
                    </a>
                </Tooltip>
            </div>
            <div>

            </div>
        </>
    )
}