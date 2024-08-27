import ButtonBase from "Components/ButtonBase";
import InputBase from "Components/InputBase";
import { ReactComponent as Document } from 'Assets/icons/document.svg'
import Table from "Components/Table";
import RowActionInput from "Pages/SocialAssistant/Management/components/RowActionInput";
export default function SelectedCandidateBenefitsTypeTwo() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: 'max(600px,60%)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '24px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <label>Candidato(a): Nome do candidato</label>
                <RowActionInput
                    label="Cód. identificação bolsista (censo)"
                    buttonProps={{ label: 'salvar' }}
                />

                <RowActionInput
                    label="Valor exato do total da ação de apoio"
                    buttonProps={{ label: 'salvar' }}
                />

            </div>
            <div>
                <label> Descrição dos serviços usufruídos: </label>
                <InputBase error={null} type="text-area" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '32px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <label>Termo de benefícios</label>
                    <Document height={30} width={30} cursor={'pointer'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <label>Autorizar termo?</label>
                    <input type="checkbox" />
                </div>
            </div>
            <Table.Root
                headers={['nome', 'CPF', 'parentesco', 'profissão']}
            >
                <Table.Row>
                    <Table.Cell>Nome</Table.Cell>
                    <Table.Cell>CPF</Table.Cell>
                    <Table.Cell>parentesco</Table.Cell>
                    <Table.Cell>Profissão</Table.Cell>
                </Table.Row>
            </Table.Root>
        </div>
    )
}