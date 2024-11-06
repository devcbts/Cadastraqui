import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import SelectBase from "Components/SelectBase";
import InputBase from "Components/InputBase";
import debounce from "lodash.debounce";
export default function DataTable({
    columns = [],
    data = [],
    title,
    onDataRequest = async (index, itemCount, value, name) => { },
    totalItems = null,
    allowPagination = false,
    serverSide = false
}) {
    // states that does not depends on serverside or clientside
    const [internalLoad, setInternalLoad] = useState(false)
    const pageSizeOptions = useMemo(() => [2, 50, 100].map(e => ({ value: e, label: `${e.toString()} itens` })), [])

    const [pagination, setPagination] = useState({
        allowPagination,
        pageIndex: 0,
        pageSize: pageSizeOptions[0].value,
    })
    const [filterState, setFilterState] = useState([{ id: '', value: '' }])
    // functions used on server side (pagination/filtering)
    const handleDataRequest = useCallback(async (currentFilter) => {
        setInternalLoad(true)
        await onDataRequest(pagination.pageIndex, pagination.pageSize, currentFilter?.value, currentFilter?.id)
        setInternalLoad(false)
    }, [pagination.pageIndex, pagination.pageSize, onDataRequest])

    const handlePagination = useCallback((updater) => {
        setPagination(updater)
        if (serverSide) {
            handleDataRequest(filterState[0])
        }
    }, [handleDataRequest])
    const debouncedCall = useMemo(() => debounce(async (filter) => await handleDataRequest(filter), 700), [handleDataRequest])
    useEffect(() => {
        if (serverSide && filterState[0]?.value) {
            debouncedCall(filterState[0])
        }
    }, [filterState[0]])
    // create react table
    const table = useReactTable({
        columns,
        data,
        getPaginationRowModel: allowPagination ? getPaginationRowModel() : null,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: serverSide ? null : getFilteredRowModel(),
        onPaginationChange: handlePagination,
        manualPagination: serverSide,
        rowCount: serverSide ? totalItems : data.length,
        state: {
            pagination: allowPagination ? pagination : null,
            columnFilters: filterState
        },
    })
    const availableFilters = useMemo(() => {
        const filter = table
            .getFlatHeaders()
            .filter(x => x.column.getCanFilter())
            .map(e => ({ value: e.id, label: e.column.columnDef.header }))
        setFilterState([{ id: filter[0]?.value ?? '', value: '' }])
        return filter
    }, [table])

    return (
        <>
            {internalLoad && 'Carregando...'}
            <div className={styles.filterWrapper}>
                {availableFilters.length !== 0 &&
                    <div style={{ display: 'flex', flexDirection: "row", gap: '16px' }}>
                        <div style={{ width: '400px' }}>
                            <InputBase placeholder="Busque por algo..." error={null} disabled={!filterState[0].id} onChange={(e) => {
                                setFilterState(prev => ([{ ...prev[0], value: e.target.value }]))
                            }}
                                type={table.getColumn(filterState[0]?.id)?.columnDef?.meta?.filterType ?? "text"}
                                value={filterState[0].value}
                            />
                        </div>
                        <div style={{ width: '240px' }}>

                            <SelectBase
                                error={null}
                                onChange={(v) => setFilterState([{ id: v.value, value: '' }])}
                                options={availableFilters}
                                defaultValue={availableFilters[0]}
                            />
                        </div>
                    </div>

                }
                {allowPagination && <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', placeContent: 'flex-end', flexGrow: '1' }}>
                    Exibir
                    <div style={{ width: 'fit-content' }}>
                        <SelectBase
                            onChange={(e) => setPagination((prev) => ({ ...prev, pageSize: e.value, pageIndex: 0 }))}
                            options={pageSizeOptions}
                            defaultValue={pageSizeOptions[0]}
                            error={null} search={false} />
                    </div>
                </div>}
            </div>
            <h3>{title}</h3>
            <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className={styles.header} >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className={styles.row} >
                            {row.getVisibleCells().map((cell) => {
                                const config = cell.column.columnDef.meta
                                return (
                                    <td key={cell.id}
                                        className={[styles.cell, config?.cellDivider ? styles.divider : ''].join(' ')}
                                    >
                                        <span key={cell.id} className={styles.content} style={{ justifyContent: config?.cellAlign ?? 'center', }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </span>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                allowPagination && <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', placeSelf: 'center', alignItems: 'center', marginTop: '24px' }}>
                    <ButtonBase label={'<'} onClick={() => {
                        if (table.getCanPreviousPage()) {
                            table.previousPage()
                        }
                    }}
                        disabled={!table.getCanPreviousPage()}
                    />
                    <span>Página {pagination.pageIndex + 1} de {table.getPageCount()}</span>
                    <ButtonBase label={'>'} onClick={() => {
                        if (table.getCanNextPage()) {
                            table.nextPage()
                        }
                    }}
                        disabled={!table.getCanNextPage()}
                    />
                </div>
            }
        </>
    )
}