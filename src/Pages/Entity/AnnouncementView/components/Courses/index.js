import Table from "Components/Table";

export default function Courses({ courses }) {
    return (
        <div>
            <h3>Vagas cadastradas</h3>
            <Table.Root headers={['matriz ou filial/cidade', 'curso/série', 'bolsas', 'turno']}>
                {
                    courses?.map(course => (
                        <Table.Row>
                            <Table.Cell>{course.entityName}/{course.city}</Table.Cell>
                            <Table.Cell>{course.availableCourses ?? course.grade}</Table.Cell>
                            <Table.Cell>{course.verifiedScholarships}</Table.Cell>
                            <Table.Cell>{course.shift}</Table.Cell>

                        </Table.Row>
                    ))
                }
            </Table.Root>
        </div>
    )
}