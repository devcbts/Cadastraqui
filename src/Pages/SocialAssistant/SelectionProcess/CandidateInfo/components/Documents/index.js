import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import styles from '../../styles.module.scss'
export default function Documents() {
    return (
        <div className={styles.table}>
            <h3>Documentos do candidato</h3>
            <Table.Root headers={['documento', 'ações']}>
                <Table.Row>
                    <Table.Cell>Registrato</Table.Cell>
                    <Table.Cell>
                        <ButtonBase label={'visualizar'} />
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}