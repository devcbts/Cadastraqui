import BackPageTitle from "Components/BackPageTitle";
import SelectBase from "Components/SelectBase";
import { useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useLocation, useNavigate } from "react-router";
import Loader from "Components/Loader";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import DataTable from "Components/DataTable";
export default function AssistantManagementAnnouncements() {
    const { state } = useLocation()
    const [selection, setSelection] = useState({ label: 'Fase de inscrição', value: 'subscription' })
    const [data, setData] = useState({ announcements: [], total: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const filter = [
        { value: 'scheduled', label: 'Pré-agendados' },
        { label: 'Fase de inscrição', value: 'subscription' },
        { label: 'Fase de avaliação', value: 'validation' },
        { label: 'Finalizados', value: 'finished' }]
    const fetchAnnouncements = async ({ page, size } = {}) => {
        try {
            setIsLoading(true)
            const query = !state?.isUnit ? selection.value : 'validationFinished'
            const information = await socialAssistantService.getAllAnnouncements({ filter: query, page, size })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }
    // useEffect(() => {
    //     // TODO: if state.isUnit -> limit selection only to those announcements that had it's validation period finished
    //     fetchAnnouncements()
    // }, [selection.value])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Gerencial Administrativo'} path={'/gerencial'} />
            <div className={styles.container}>
                {(
                    <div className={styles.selection}>
                        {!state?.isUnit ?
                            <>
                                <h3>Filtrar por</h3>
                                <SelectBase
                                    options={filter}
                                    value={selection}
                                    onChange={setSelection}
                                    error={null}
                                />
                            </>

                            : <h3>Editais - Fase de avaliação finalizada</h3>
                        }
                    </div>
                )
                }

                {/* {data.announcements.length > 0
                    ? <Table.Root headers={['edital', 'entidade', 'ações']}>
                        {
                            data.announcements.map((e) => (
                                <Table.Row>
                                    <Table.Cell align="start">{e.name}</Table.Cell>
                                    <Table.Cell>{e.entity}</Table.Cell>
                                    <Table.Cell>
                                        <ButtonBase label={'visualizar'} onClick={() => navigate(e.id, { state })} />
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Root>
                    : <h3>Nenhum edital encontrado na cateogria "{!state?.isUnit ? selection.label : 'Avaliação finalizada'}"</h3>
                } */}
            </div>
            <DataTable
                key={selection.value}
                // title={`Editais - ${!state?.isUnit ? selection.label : 'Fase de avaliação finalizada'}`}
                serverSide
                allowPagination
                onDataRequest={(index, count) => fetchAnnouncements({ page: index, size: count })}
                data={data.announcements}
                totalItems={data.total}
                columns={[
                    { accessorKey: "name", header: 'Edital', meta: { cellAlign: 'start' } },
                    { accessorKey: "entity", header: 'Instituição' },
                    { id: "actions", cell: ({ row: { original } }) => <ButtonBase label={'visualizar'} onClick={() => navigate(original.id, { state })} /> },
                ]}
            />
        </>
    )
}