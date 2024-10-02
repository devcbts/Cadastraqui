import Table from "Components/Table"
import { useEffect, useState } from "react"
import SelectInput from "../SelectInput"
import InputBase from "Components/InputBase"

export default function SelectTable({
    headers = [],
    onSelect = (value, ids) => { },
    defaultSelected = [],
    children
}) {
    const [selected, setSelected] = useState(() => {
        if (defaultSelected.every(e => typeof e === "object")) {
            return children.map((e) => {
                const item = defaultSelected?.find(x => x.id === e.id)
                return item ? ({ ...item, selected: true }) : ({ ...e, selected: false })
            })
        }
        return children.map((e) => defaultSelected?.includes(e.id) ? ({ ...e, selected: true }) : ({ ...e, selected: false }))
    })
    useEffect(() => {
        setSelected((prev) => {
            return children.map((e) => {
                const alreadyExists = prev.find(x => x.id === e.id)
                if (alreadyExists) {
                    return alreadyExists
                }
                return { ...e, selected: false }
            })
        })
    }, [children.length])
    // selectedAll can be "none", "partial", "all"
    const [selectAll, setSelectAll] = useState("none")
    const handleSelectAll = () => {
        setSelectAll((prev) => {
            if (prev === "none" || prev === "partial") {
                setSelected((prev) => [...prev].map(e => ({ ...e, selected: true })))
                return "all"
            } else {
                setSelected((prev) => [...prev].map(e => ({ ...e, selected: false })))
                return "none"
            }
        })

    }
    const handleSelect = () => {

        onSelect(selected.filter(e => e.selected), selected.filter(e => e.selected).map(e => e.id))
    }
    const handleSelectItem = (item) => {
        const hasItem = selected.find((e) => e.id === item.id && e.selected)
        if (hasItem) {
            setSelectAll("partial")
        }
        return setSelected((prev) => [...prev].map(e => {
            return { ...e, selected: e.id === item.id ? !e.selected : e.selected }
        }))
    }
    useEffect(() => {
        handleSelect()
        if (selected.every(e => e.selected)) {
            setSelectAll("all")
        }
    }, [selected])
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 0px', gap: '24px' }}>
            <Table.Root headers={[
                <input type="checkbox" onChange={handleSelectAll} checked={selectAll === "all"} />
            ].concat(headers.filter(e => !!e))}>
                {
                    selected?.map((child) => {
                        return (
                            <Table.Row key={child.id}>
                                <Table.Cell>
                                    <input type="checkbox" onChange={() => handleSelectItem(child)} checked={!!selected.find(item => item.id === child.id && item.selected)} />
                                </Table.Cell>
                                {
                                    child.cells?.filter(e => !!e).map((cell, i) => (
                                        <Table.Cell key={`${cell.id}-${i}`}>
                                            {typeof cell === "object"
                                                ? (
                                                    <SelectInput
                                                        type={cell.type}
                                                        selected={child.selected}
                                                        name={cell.name}
                                                        selectProps={{
                                                            options: cell.options,
                                                            value: child[`select-${cell.name}`]?.value,
                                                            onChange: (_, v) => {
                                                                setSelected((prev) => ([...prev].map(item => {
                                                                    return item.id === child.id ? ({ ...item, [`select-${cell.name}`]: v }) : ({ ...item })
                                                                })))
                                                            }
                                                        }}
                                                        inputProps={{
                                                            value: child[`input-${cell.name}`],
                                                            onChange: (v) => {
                                                                if (isNaN(v.trim())) {
                                                                    return null
                                                                }
                                                                setSelected((prev) => ([...prev].map(item => {
                                                                    return item.id === child.id ? ({ ...item, [`input-${cell.name}`]: v.trim() }) : ({ ...item })
                                                                })))
                                                            }
                                                        }}
                                                    />

                                                )
                                                : cell
                                            }
                                        </Table.Cell>
                                    )
                                    )
                                }
                            </Table.Row>
                        )
                    })
                }
            </Table.Root>
        </div>
    )
}