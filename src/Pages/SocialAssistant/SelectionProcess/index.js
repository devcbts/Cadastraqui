import FormSelect from "Components/FormSelect";
import SelectBase from "Components/SelectBase";
import useControlForm from "hooks/useControlForm";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { useNavigate } from "react-router";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import Loader from "Components/Loader";
import DataTable from "Components/DataTable";
export default function SelectionProcess() {
    const navigate = useNavigate()
    const [selection, setSelection] = useState({ value: 'scheduled', label: 'Pré-agendados' })
    const [data, setData] = useState({ announcements: [], total: 0 })
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
    const fetchAnnouncements = async ({
        page, size, search, type
    } = {}) => {
        try {
            console.log(selection)
            setIsLoading(true)
            const information = await socialAssistantService.getAllAnnouncements({ filter: selection.value, page, size, search, type })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }

    return (
        <div className={styles.container}>
            <Loader loading={isLoading} />
            <h1>Processo de Seleção</h1>
            <div className={styles.selection}>
                <h3>Editais com atuação</h3>
                <SelectBase options={filter} value={selection} onChange={handleSelection} error={null} />
            </div>
            {!!selection?.value && (
                // data.announcements.length ?
                (
                    <DataTable
                        key={selection.value}
                        data={data.announcements}
                        title={`Editais - ${selection.label}`}
                        columns={[
                            { accessorKey: 'entity', header: 'Entidade', meta: { cellAlign: 'left', filterKey: 'entidade' } },
                            { accessorKey: 'name', header: 'Edital', meta: { filterKey: 'edital' } },
                            { accessorKey: 'vacancies', header: 'Total de vagas', enableColumnFilter: false },
                            { accessorKey: 'finished', header: 'Concluído?', cell: (info) => info.getValue() ? 'Sim' : 'Não', enableColumnFilter: false },
                            { id: 'action', header: 'Ações', cell: ({ row }) => <ButtonBase label={'visualizar'} onClick={() => navigate(`selecao/${row.original.id}`)} /> },
                        ]}
                        enableFilters
                        allowPagination
                        serverSide
                        totalItems={data.total}
                        onDataRequest={async (index, count, value, name) => await fetchAnnouncements({ page: index, size: count, type: name, search: value })}
                    />

                )
                // : <h3>
                //     Nenhum edital encontrado na cateogria "{selection.label}"
                // </h3>
            )
            }
        </div>
    )
}