import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";

import styles from './styles.module.scss'
export default function BankReport({ id }) {
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        defaultValues: {
            file_bankReport: null
        }
    })

    return (
        <>
            <h1>{new Date().toLocaleString('pt-br', { year: 'numeric', month: 'long' }).toUpperCase()}</h1>
            <div className={styles.report}>
                <h1>Relatório de Contas e Relationamentos (CCS)</h1>
                <div style={{ width: '100%' }}>
                    <FormFilePicker accept={"application/pdf"} control={control} label={'Arquivo'} name={'file_bankReport'} />
                </div>
            </div>
            <div>

            </div>
        </>
    )
}