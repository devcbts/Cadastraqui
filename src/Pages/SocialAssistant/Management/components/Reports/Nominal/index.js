import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import { ReactComponent as Excel } from 'Assets/icons/excel.svg'
import { ReactComponent as PDF } from 'Assets/icons/PDF.svg'
import RowActionInput from "../../RowActionInput";
export default function NominalReport() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px', width: 'max(40%,400px)' }}>
            <RowActionInput
                label="Cod. instituição no censo"
                buttonProps={{ label: 'salvar' }}
            />

            <div style={{ marginTop: '24px' }}>
                <h3 style={{ textAlign: 'center' }}>Relação nominal de bolsistas</h3>
                <Table.Root headers={['unidade/cidade', 'gerar']}>
                    <Table.Row>
                        <Table.Cell>Matriz</Table.Cell>
                        <Table.Cell>
                            <ButtonBase >
                                <Excel />
                            </ButtonBase>
                            <ButtonBase >
                                <PDF />
                            </ButtonBase>
                        </Table.Cell>
                    </Table.Row>
                </Table.Root>
            </div>
        </div>
    )
}