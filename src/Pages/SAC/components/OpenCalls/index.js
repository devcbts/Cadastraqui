import ButtonBase from "Components/ButtonBase";
import DataTable from "Components/DataTable";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";
import { CALL_STATUS_TRANSLATION } from "utils/enums/call-status";
import formatDate from "utils/format-date";

export default function OpenCalls() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        calls: [],
        total: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const fetchData = async ({ page, size } = {}) => {
        try {
            setIsLoading(true)
            const information = await callService.getOpenCalls({ page, size })
            setData(information)
        } catch (err) { }
        setIsLoading(false)
    }

    const handleLinkCall = async (id) => {
        try {
            await callService.linkCall({ id })
            navigate(id)
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <Loader loading={isLoading} />
            <DataTable
                title={'Lista de chamados abertos'}
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
                        id: 'actions', header: 'Ações', cell: ({ row: { original: call } }) => <ButtonBase label={'vincular'} onClick={() => handleLinkCall(call.id)} />
                    },
                ]}

            />

        </>
    )
}