import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";

export default function AnnouncementTable({ title, rowData, onClick }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <span>{title}</span>
            <Table.Root headers={['curso/série', 'vagas', 'critérios', 'ações']}>
                {
                    rowData?.map((data) => {
                        return (<Table.Row>
                            <Table.Cell>{data?.availableCourses ?? data?.grade}</Table.Cell>
                            <Table.Cell>{data?.verifiedScholarships}</Table.Cell>
                            <Table.Cell>{data?.criteria}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'visualizar'} onClick={() => onClick(data.id)} />
                            </Table.Cell>
                        </Table.Row>)
                    })
                }
            </Table.Root>
        </div>
    )
}