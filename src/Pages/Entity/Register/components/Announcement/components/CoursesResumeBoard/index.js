import ButtonBase from "Components/ButtonBase"
import Table from "Components/Table"
/**
 * 
 * @param {*} headers List of headers to be shown   
 * @param {*} onRemove Cb function that returns the current row element. If any is passed, 'actions' header will be added
 * default is NULL
 * @param {*} courses  
 * @type { id:string, 1: any, 2:any,...} A list of course objects to be displayed on the table.
 * Id must be present to be used as row key. Other params will be shown on the same header's order
 * @returns 
 */
export default function CoursesResumeBoard({ courses = [], onRemove = null, headers = [] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', placeContent: 'center' }}>
            <h1>Quadro resumo</h1>

            <Table.Root headers={onRemove ? headers.concat(['ações']) : headers}>
                {
                    courses.map(course => {
                        const { id, ...rest } = course
                        return (
                            <Table.Row key={course.id}>
                                {Object.values(rest).map((x) => {
                                    return (<Table.Cell>{x}</Table.Cell>)
                                })}
                                {onRemove && <Table.Cell>
                                    <ButtonBase label={'excluir'} onClick={() => { onRemove(course) }} danger />
                                </Table.Cell>}
                            </Table.Row>
                        )
                    })
                }
            </Table.Root>

        </div>
    )
}