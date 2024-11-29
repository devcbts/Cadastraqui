import ButtonBase from "Components/ButtonBase";
import DataTable from "Components/DataTable";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";
import { CALL_STATUS, CALL_STATUS_TRANSLATION } from "utils/enums/call-status";
import formatDate from "utils/format-date";

export default function LinkedCalls() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        calls: [],
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const fetchData = async ({ page, size } = {}) => {
        try {
            setIsLoading(true)
            const information = await callService.getUserCalls({ page, size })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }

    const handleFinishCall = async (id) => {
        NotificationService.confirm({
            title: 'Finalizar chamado',
            text: 'Quando finalizado, não poderão ser enviadas novas mensagens',
            onConfirm: async () => {
                try {
                    await callService.finishCall({ id })
                    NotificationService.success({ text: 'Chamado finalizado' })
                    setData((prev) => ({
                        ...prev,
                        calls: [...prev.calls].map(call => {
                            return call.id === id ? ({ ...call, status: CALL_STATUS.CLOSED }) : call
                        })
                    }))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }

            }
        })
    }
    return (
        <>
            <Loader loading={isLoading} />
            <DataTable
                title={'Meus chamados'}
                data={data.calls}
                totalItems={data.total}
                onDataRequest={(index, count) => fetchData({ page: index, size: count })}
                allowPagination
                serverSide
                columns={[
                    { accessorKey: 'callSubject', header: 'Chamado' },
                    { accessorKey: 'number', header: 'Número' },
                    { accessorKey: 'CreatedAt', header: 'Abertura', cell: (info) => formatDate(info.getValue()) },
                    { accessorKey: 'status', header: 'Status', cell: (info) => CALL_STATUS_TRANSLATION[info.getValue()] },
                    {
                        id: 'actions', header: 'Ações', cell: ({ row: { original: call } }) => {
                            return <>
                                <ButtonBase label={'Visualizar'} onClick={() => navigate(call.id)} />
                                {call.status !== CALL_STATUS.CLOSED
                                    && <ButtonBase label={'finalizar'} onClick={() => handleFinishCall(call.id)} danger />}
                            </>
                        }

                    },
                ]}
            />

        </>
    )
}