import { flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import SelectBase from "Components/SelectBase";
import InputBase from "Components/InputBase";
import debounce from "lodash.debounce";
import { ReactComponent as ChevIcon } from 'Assets/icons/chevron.svg'
import { AnimatePresence } from "framer-motion";
export default function DataTable({
    columns = [],
    data = [],
    title,
    enableFilters = false,
    onDataRequest = async (index, itemCount, value, name) => { },
    totalItems = null,
    allowPagination = false,
    serverSide = false,
    expandedContent = null
}) {
    // states that does not depends on serverside or clientside
    const [internalLoad, setInternalLoad] = useState(false)
    const pageSizeOptions = useMemo(() => [20, 50, 100].map(e => ({ value: e, label: `${e.toString()} itens` })), [])

    const [pagination, setPagination] = useState({
        _isSearch: false,
        pageIndex: 0,
        pageSize: pageSizeOptions[0].value,
    })
    const [filterState, setFilterState] = useState([{ id: '', value: '' }])
    // functions used on server side (pagination/filtering)
    // Request data based on table pagination and filters
    useEffect(() => {
        if (pagination._isSearch) {
            return
        }
        const fetchNewData = async () => {
            await onDataRequest(pagination.pageIndex, pagination.pageSize, filterState[0].value, filterState[0].id)
        }
        fetchNewData()
    }, [pagination.pageIndex, pagination.pageSize])
    // add a delay when calling the onDataRequest fn, since it'll be called during user typing
    // need to add onDataRequest as useCallback deps
    const debounceInput = useCallback(
        debounce(async (value, type) => {
            setPagination(prev => ({ ...prev, pageIndex: 0, _isSearch: true }))
            await onDataRequest(0, pagination.pageSize, value, type)
            setPagination(prev => ({ ...prev, pageIndex: 0, _isSearch: false }))
        },
            800),
        [pagination.pageSize, onDataRequest])

    const [expanded, setExpanded] = useState({})
    // create react table
    const table = useReactTable({
        columns,
        data,
        getExpandedRowModel: getExpandedRowModel(),
        getPaginationRowModel: allowPagination ? getPaginationRowModel() : null,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: serverSide ? null : getFilteredRowModel(),
        onPaginationChange: setPagination,
        onExpandedChange: setExpanded,
        manualPagination: serverSide,
        rowCount: serverSide ? totalItems : data.length,
        enableColumnFilters: enableFilters,
        state: {
            expanded,
            pagination: allowPagination ? pagination : null,
            columnFilters: filterState
        },
    })
    const availableFilters = useMemo(() => {
        const filter = table
            .getFlatHeaders()
            .filter(x => x.column.getCanFilter())
            .map(e => ({ value: e.column.columnDef.meta?.filterKey ?? e.id, label: e.column.columnDef.header }))
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
                                setFilterState(prev => {
                                    debounceInput(e.target.value, prev[0].id)
                                    return ([{ ...prev[0], value: e.target.value }])
                                })
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
                        <React.Fragment key={row.id} >
                            <tr className={styles.row} style={{ position: 'relative' }}>
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

                                {!!expandedContent ?
                                    <td className={styles.cell} style={{ cursor: 'pointer' }} onClick={() => row.toggleExpanded()}
                                        title="Ver mais"
                                    >
                                        <ChevIcon
                                            style={{ transform: row.getIsExpanded() ? 'rotateZ(180deg)' : '', transition: 'all .250s', }}
                                        />
                                    </td> : null}
                            </tr>
                            <AnimatePresence >
                                {row.getIsExpanded() && (
                                    <tr key={`expand_${row.id}`}>
                                        <td colSpan={row.getAllCells().length + 1} style={{ border: 'none' }}>
                                            {expandedContent(row)}
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </React.Fragment>
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