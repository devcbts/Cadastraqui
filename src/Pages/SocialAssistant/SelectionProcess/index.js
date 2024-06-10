import FormSelect from "Components/FormSelect";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { useEffect, useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useNavigate } from "react-router";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function SelectionProcess() {
    const navigate = useNavigate()
    const [selection, setSelection] = useState({ label: '', value: '' })
    const [announcements, setAnnouncements] = useState([])
    const handleSelection = (value) => {
        setSelection(value)
    }
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const information = await socialAssistantService.getAllAnnouncements()
                setAnnouncements(information)
            } catch (err) { }
        }
        fetchAnnouncements()
    }, [])
    return (
        <div className={styles.container}>
            <h1>Processo de Seleção</h1>
            <div className={styles.selection}>
                <span>Editais com atuação</span>
                <SelectBase options={[{ label: 'abc', value: 1 }]} value={selection} onChange={handleSelection} error={null} />
            </div>
            {!!selection?.value && (
                <div>
                    <span>Editais - {selection.label}</span>
                    <Table.Root headers={['entidade', 'edital', 'total de vagas', 'concluído?', 'ações']}>
                        {
                            announcements.map((announcement) => (
                                <Table.Row>
                                    <Table.Cell>{announcement.entity}</Table.Cell>
                                    <Table.Cell>{announcement.name}</Table.Cell>
                                    <Table.Cell>{announcement.vacancies}</Table.Cell>
                                    <Table.Cell>{announcement.finished ? 'Sim' : 'Não'}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => navigate(`selecao/${announcement.id}`)} />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                </div>
            )
            }
        </div>
    )
}