import InputBase from 'Components/InputBase'
import styles from './styles.module.scss'
import SelectBase from 'Components/SelectBase'
import { ReactComponent as Filter } from 'Assets/icons/filter.svg'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useOutsideClick from 'hooks/useOutsideClick'
export default function TableFilters({
    filters = [],
    itemCountPicker = false,
    table,
    value,
    onChangeValue = (value) => { },
    onChangeFilter = (id) => { },
    onChangeItemCount = (count) => { },
    itemCountOptions = [20, 50, 100]
}) {
    const size = itemCountOptions.map(e => ({ value: e, label: `${e.toString()} itens` }))
    const [showFilter, setShowFilter] = useState(false)
    const ref = useOutsideClick(() => {
        setShowFilter(false)
    })
    return (
        <div className={styles.filterWrapper}>
            {filters.length !== 0 &&
                <div style={{ display: 'flex', flexDirection: "row", gap: '16px', alignItems: 'start' }}>
                    <div style={{ width: '400px' }}>
                        <InputBase
                            placeholder="Busque por algo..." error={null} disabled={!value.id} onChange={(e) => {
                                onChangeValue(e.target.value)

                            }}
                            type={table.getColumn(value?.id)?.columnDef?.meta?.filterType ?? "text"}
                            value={value.value}
                        />
                    </div>
                    {/* <div style={{ position: 'relative' }} ref={ref}>

                        <Filter
                            height={30}
                            width={30}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowFilter(true)}
                        />

                        <AnimatePresence>

                            {showFilter && <motion.div
                                style={{ position: 'absolute', top: '50%', translateY: '-50%', left: '100%', borderRadius: '8px', backgroundColor: '#CFCFCF', scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <div style={{ padding: '8px' }}>
                                    {filters.map(e => (<div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                                        <input
                                            type='radio'
                                            name='filterRadio'
                                            checked={value.id === e.value}
                                            value={e.value}
                                            onChange={(e) => onChangeFilter(e.target.value)}
                                        /><span>{e.value}</span>
                                    </div>))}
                                </div>
                            </motion.div>}
                        </AnimatePresence>
                    </div> */}
                    <div style={{ width: '240px' }}>
                        <SelectBase
                            error={null}
                            onChange={(v) => onChangeFilter(v.value)}
                            options={filters}
                            defaultValue={filters[0]}
                        />
                    </div>
                </div>

            }
            {itemCountPicker && <div style={{ display: 'flex', alignItems: 'center', gap: '16px', placeContent: 'flex-end', flexGrow: '1' }}>
                Exibir
                <div style={{ width: '150px' }}>
                    <SelectBase
                        onChange={(e) => onChangeItemCount(e.value)}
                        options={size}
                        defaultValue={size[0]}
                        error={null} search={false}
                    />
                </div>
            </div>}
        </div>
    )
}