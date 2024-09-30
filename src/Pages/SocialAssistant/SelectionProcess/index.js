import FormSelect from "Components/FormSelect";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useNavigate } from "react-router";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import Loader from "Components/Loader";
export default function SelectionProcess() {
    const navigate = useNavigate()
    const [selection, setSelection] = useState({ value: 'scheduled', label: 'Pré-agendados' })
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const handleSelection = (value) => {
        setSelection(value)
    }
    const filter = useMemo(() => {
        return [
            { value: 'scheduled', label: 'Pré-agendados' },
            { label: 'Fase de inscrição', value: 'subscription' },
            { label: 'Fase de avaliação', value: 'validation' },
            { label: 'Finalizados', value: 'finished' }]
    }, [])
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getAllAnnouncements(selection.value)
                setAnnouncements(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchAnnouncements()
    }, [selection])
    return (
        <div className={styles.container}>
            <Loader loading={isLoading} />
            <h1>Processo de Seleção</h1>
            <div className={styles.selection}>
                <h3>Editais com atuação</h3>
                <SelectBase options={filter} value={selection} onChange={handleSelection} error={null} />
            </div>
            {!!selection?.value && (
                announcements.length ?
                    (<div style={{ marginTop: '24px' }}>
                        <Table.Root title={`Editais - ${selection.label}`} headers={['entidade', 'edital', 'total de vagas', 'concluído?', 'ações']}>
                            {
                                announcements.map((announcement) => (
                                    <Table.Row>
                                        <Table.Cell align="left">{announcement.entity}</Table.Cell>
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
                    </div>)
                    : <h3>
                        Nenhum edital encontrado na cateogria "{selection.label}"
                    </h3>
            )
            }
        </div>
    )
}