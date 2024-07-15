import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";

import styles from './styles.module.scss'
import { Link } from "react-router-dom";
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import { useEffect, useState } from "react";
export default function BankReport({ applicationId, id }) {
    // { date: '', url: '' }
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchRegistrato = async () => {
            try {
                const registrato = await socialAssistantService.getRegistrato(applicationId, id)
                setData({ date: registrato.date, url: registrato.url })
            } catch (err) { }
        }
        fetchRegistrato()
    }, [id])
    const getStatus = () => {
        const currDate = new Date()
        currDate.setDate(1)
        const compareDate = data.date
        const days = currDate.getMonth() - compareDate.getMonth() +
            (12 * (currDate.getFullYear() - compareDate.getFullYear()))

        return days !== 0 ? 'Vencido' : 'Atualizado'
    }
    return (
        <>
            <h1>{new Date().toLocaleString('pt-br', { year: 'numeric', month: 'long' }).toUpperCase()}</h1>
            <div className={styles.report}>
                <h1>Relatório de Contas e Relacionamentos (CCS)</h1>
                {data && <Table.Root headers={['data', 'status', 'ações']}>
                    <Table.Row>
                        <Table.Cell>{data.date?.toLocaleString('pt-br', { month: 'long', year: 'numeric' })}</Table.Cell>
                        <Table.Cell>{getStatus()}</Table.Cell>
                        <Table.Cell>
                            <Link to={data.url} target="_blank">
                                <ButtonBase label={'visualizar'} />
                            </Link>
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>

                }
            </div>
            <div>

            </div>
        </>
    )

}