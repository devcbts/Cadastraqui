import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";

export default function AnnouncementTable({ title, onClick }) {
    return (
        <div>
            <span>{title}</span>
            <Table.Root headers={['#', 'curso', 'vagas', 'critérios', 'ações']}>
                <Table.Row>
                    <Table.Cell divider>1</Table.Cell>
                    <Table.Cell>Agronomia</Table.Cell>
                    <Table.Cell>30</Table.Cell>
                    <Table.Cell>Cad.Único; Menor renda; Doença Grave; Sorteio</Table.Cell>
                    <Table.Cell>
                        <ButtonBase label={'visualizar'} onClick={() => onClick('123123')} />
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}