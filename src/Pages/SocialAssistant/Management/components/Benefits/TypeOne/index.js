import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import Table from "Components/Table";
import { ReactComponent as Document } from 'Assets/icons/document.svg'
import CheckboxBase from "Components/CheckboxBase";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TypeOneResponsiblePDF from "./PDF/Responsible";
import RowActionInput from "../../RowActionInput";
export default function BenefitsTypeOne() {
    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Benefícios Tipo 1</h2>
            <label>Cód. instituição no censo: 123123123</label>
            <div style={{ display: "flex", flexDirection: 'column', marginTop: '12px' }}>
                <RowActionInput
                    label="Valores da ação de apoio"
                    inputProps={{
                        readOnly: true
                    }}
                    buttonProps={{
                        label: 'salvar'
                    }}
                />

            </div>
            <Table.Root headers={['rank', 'candidato', 'CPF', 'Cód. Ident. bolsista (censo)', 'termo', 'autorizar termo?']}>
                <Table.Row>
                    <Table.Cell divider>1</Table.Cell>
                    <Table.Cell >candidato nome</Table.Cell>
                    <Table.Cell >cpf</Table.Cell>
                    <Table.Cell >
                        <RowActionInput buttonProps={{ label: 'salvar' }} />
                    </Table.Cell>
                    <Table.Cell >
                        <PDFDownloadLink document={<TypeOneResponsiblePDF />}>
                            <Document height={30} width={30} cursor={'pointer'} />
                        </PDFDownloadLink>
                    </Table.Cell>
                    <Table.Cell >
                        <input type="checkbox" disabled={true} />
                    </Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}