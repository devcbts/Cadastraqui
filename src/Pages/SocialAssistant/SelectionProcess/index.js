import FormSelect from "Components/FormSelect";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useNavigate } from "react-router";
export default function SelectionProcess() {
    const navigate = useNavigate()
    const [selection, setSelection] = useState({ label: '', value: '' })
    const handleSelection = (value) => {
        setSelection(value)
    }
    return (
        <div className={styles.container}>
            <h1>Processo de Seleção</h1>
            <div className={styles.selection}>
                <span>Editais com atuação</span>
                <SelectBase options={[{ label: 'abc', value: 1 }]} value={selection} onChange={handleSelection} error={null} />
            </div>
            <div>
                <span>Editais - {selection.label}</span>
                <Table.Root headers={['entidade', 'edital', 'total de vagas', 'concluído?', 'ações']}>
                    <Table.Row>
                        <Table.Cell>teste</Table.Cell>
                        <Table.Cell>teste</Table.Cell>
                        <Table.Cell>teste</Table.Cell>
                        <Table.Cell>teste</Table.Cell>
                        <Table.Cell>
                            <ButtonBase label={'visualizar'} onClick={() => navigate('selecao/1234')} />
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </div>
    )
}