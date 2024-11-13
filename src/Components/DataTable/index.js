import { flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from './styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import SelectBase from "Components/SelectBase";
import InputBase from "Components/InputBase";
import debounce from "lodash.debounce";
import { ReactComponent as ChevIcon } from 'Assets/icons/chevron.svg'
import { AnimatePresence } from "framer-motion";
import TableFilters from "./TableFilter";
import TablePagination from "./TablePagination";
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

    const [pagination, setPagination] = useState({
        _isSearch: false,
        pageIndex: 0,
        pageSize: 20,
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
            <TableFilters
                table={table}
                value={filterState[0]}
                itemCountPicker={allowPagination}
                filters={availableFilters}
                onChangeValue={(value) => setFilterState(prev => {
                    debounceInput(value, prev[0].id)
                    return ([{ ...prev[0], value: value }])
                })}
                onChangeFilter={(id) => setFilterState([{ id: id, value: '' }])}
                onChangeItemCount={(v) => setPagination((prev) => ({ ...prev, pageSize: v, pageIndex: 0 }))}
            />
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
            {allowPagination && <TablePagination
                table={table}
                pagination={pagination}
            />}
        </>
    )
}