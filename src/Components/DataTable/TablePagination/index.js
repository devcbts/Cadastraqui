import ButtonBase from "Components/ButtonBase"

export default function TablePagination({
    table,
    pagination
}) {

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', placeSelf: 'center', alignItems: 'center', marginTop: '24px' }}>
            {table.getPageCount() === 0
                ? <span>Página 1</span>
                : (
                    <>
                        <ButtonBase label={'<'} onClick={() => {
                            if (table.getCanPreviousPage()) {
                                table.previousPage()
                            }
                        }}
                            disabled={!table.getCanPreviousPage()}
                        />
                        <span>Página <strong>{pagination.pageIndex + 1}</strong> de <strong>{table.getPageCount()}</strong></span>
                        <ButtonBase label={'>'} onClick={() => {
                            if (table.getCanNextPage()) {
                                table.nextPage()
                            }
                        }}
                            disabled={!table.getCanNextPage()}
                        />
                    </>
                )
            }

        </div>

    )
}