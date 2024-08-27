import BackPageTitle from "Components/BackPageTitle";
import SelectBase from "Components/SelectBase";
import { useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useLocation, useNavigate } from "react-router";
import Loader from "Components/Loader";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
export default function AssistantManagementAnnouncements() {
    const { state } = useLocation()
    const [selection, setSelection] = useState({ label: 'Fase de inscrição', value: 'subscription' })
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const filter = [
        { value: 'scheduled', label: 'Pré-agendados' },
        { label: 'Fase de inscrição', value: 'subscription' },
        { label: 'Fase de avaliação', value: 'validation' },
        { label: 'Finalizados', value: 'finished' }]
    useEffect(() => {
        // TODO: if state.isUnit -> limit selection only to those announcements that had it's validation period finished
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
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Gerencial Administrativo'} path={'/gerencial'} />
            <div className={styles.container}>
                {!state?.isUnit
                    ? (
                        <div className={styles.selection}>
                            <h3>Filtrar por</h3>
                            <SelectBase
                                options={filter}
                                value={selection}
                                onChange={setSelection}
                                error={null}
                            />
                        </div>
                    )
                    : <>Editais - Fase de avaliação finalizada</>
                }
                {announcements.length > 0
                    ? <Table.Root headers={['edital', 'entidade', 'ações']}>
                        {
                            announcements.map((e) => (
                                <Table.Row>
                                    <Table.Cell>{e.name}</Table.Cell>
                                    <Table.Cell>{e.entity}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => navigate(e.id, { state })} />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                    : <h3>Nenhum edital encontrado na cateogria "{selection.label}"</h3>
                }
            </div>
        </>
    )
}